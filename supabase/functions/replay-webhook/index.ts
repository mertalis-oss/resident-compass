import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { failure_id } = await req.json();
    if (!failure_id) {
      return new Response(JSON.stringify({ error: "failure_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the failure record
    const { data: failure, error: fetchError } = await supabase
      .from("stripe_webhook_failures")
      .select("*")
      .eq("id", failure_id)
      .eq("resolved", false)
      .single();

    if (fetchError || !failure) {
      return new Response(
        JSON.stringify({ error: "Failure not found or already resolved" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Increment retry count
    await supabase
      .from("stripe_webhook_failures")
      .update({ retry_count: (failure.retry_count || 0) + 1, updated_at: new Date().toISOString() })
      .eq("id", failure_id);

    // Attempt to reprocess via the RPC
    const payload = failure.payload as Record<string, unknown>;
    const { error: rpcError } = await supabase.rpc("process_stripe_payment", {
      p_event_id: failure.event_id,
      p_event_type: failure.event_type,
      p_enrollment_id: payload.enrollment_id as string,
      p_user_id: payload.user_id as string,
      p_payment_intent: payload.payment_intent as string,
      p_amount_cents: payload.amount_cents as number,
      p_expected_amount_cents: payload.expected_amount_cents as number,
      p_is_refund: payload.is_refund as boolean ?? false,
    });

    if (rpcError) {
      // Update failure metrics
      await supabase
        .from("stripe_webhook_metrics")
        .upsert(
          { event_type: failure.event_type, failure_count: 1, last_processed_at: new Date().toISOString() },
          { onConflict: "event_type" }
        );

      return new Response(
        JSON.stringify({ success: false, error: rpcError.message }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as resolved
    await supabase
      .from("stripe_webhook_failures")
      .update({ resolved: true, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", failure_id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Replay webhook error:", err);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
