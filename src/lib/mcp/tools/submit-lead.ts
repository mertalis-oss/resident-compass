import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "submit_lead",
  title: "Submit lead inquiry",
  description:
    "Submit a new advisory inquiry to Plan B Asia. Use when the user wants to start a conversation with the strategic advisory team about relocation, visas, or wellness. Returns a lead id.",
  inputSchema: {
    name: z.string().trim().min(1).max(200).describe("Full name of the prospective client."),
    email: z.string().trim().toLowerCase().email().max(200),
    whatsapp: z.string().trim().max(50).optional().describe("Optional WhatsApp number in E.164 format."),
    intent: z
      .string()
      .trim()
      .max(2000)
      .optional()
      .describe("What the client is looking for (short free text)."),
    service_slug: z
      .string()
      .trim()
      .optional()
      .describe("Optional slug of the service the lead is interested in."),
    language: z.enum(["en", "tr"]).optional().describe("Preferred contact language."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, whatsapp, intent, service_slug, language }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );

    let service_id: string | null = null;
    if (service_slug) {
      const { data: svc } = await supabase
        .from("services")
        .select("id")
        .eq("slug", service_slug.toLowerCase())
        .maybeSingle();
      service_id = svc?.id ?? null;
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        customer_whatsapp: whatsapp ?? null,
        intent: intent ?? null,
        service_id,
        language: language ?? "en",
        created_from: "mcp",
        entry_point: "mcp",
        source_site: "mcp",
      })
      .select("id")
      .single();

    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Lead created: ${data.id}` }],
      structuredContent: { lead_id: data.id },
    };
  },
});
