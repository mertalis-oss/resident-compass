import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_service",
  title: "Get service",
  description:
    "Fetch the full details of a single Plan B Asia service by its slug (e.g. 'dtv-visa', 'thailand-elite'). Includes description, features, FAQ, price, and delivery time.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Service slug (lowercase, hyphenated)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug.toLowerCase())
      .eq("is_active", true)
      .maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: `No active service found for slug '${slug}'.` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { service: data },
    };
  },
});
