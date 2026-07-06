import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List Plan B Asia's active advisory services (visas, relocation, wellness, expeditions, etc). Optionally filter by category or locale.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optional category filter, e.g. 'visa', 'wellness', 'expedition'."),
    locale: z
      .enum(["en", "tr", "all"])
      .optional()
      .describe("Restrict to services visible on the EN, TR, or all sites. Defaults to 'all'."),
    limit: z.number().int().min(1).max(100).optional().describe("Max services to return. Default 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, locale, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    let q = supabase
      .from("services")
      .select(
        "id,title,slug,category,short_description,price,currency,delivery_time_days,visible_on,is_featured",
      )
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .limit(limit ?? 50);
    if (category) q = q.eq("category", category.toLowerCase());
    if (locale && locale !== "all") q = q.in("visible_on", [locale, "all"]);
    const { data, error } = await q;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { services: data ?? [] },
    };
  },
});
