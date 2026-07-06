import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Copy, Check } from "lucide-react";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "";
const MCP_URL = `https://${projectRef}.supabase.co/functions/v1/mcp`;

export default function Connect() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="min-h-screen bg-corporate-navy text-holistic">
      <Helmet>
        <title>Connect Plan B Asia to your AI assistant</title>
        <meta
          name="description"
          content="Connect Plan B Asia to ChatGPT or Claude and let your AI assistant browse advisory services and open inquiries on your behalf."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="container max-w-3xl px-6 py-24">
        <p className="text-xs tracking-[0.2em] uppercase text-holistic/40 mb-6">
          Agent Integrations
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
          Connect Plan B Asia to your AI assistant
        </h1>
        <p className="text-holistic/60 mb-12 leading-relaxed">
          Let ChatGPT or Claude browse our advisory offerings and open a
          confidential inquiry with our strategic team on your behalf.
        </p>

        {/* MCP URL */}
        <section className="mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-holistic/40 mb-3">
            Server URL
          </p>
          <div className="flex items-center gap-3 rounded-md border border-border/20 bg-black/20 px-4 py-3">
            <code className="flex-1 text-sm md:text-base font-mono text-holistic/90 break-all">
              {MCP_URL}
            </code>
            <button
              onClick={copy}
              aria-label="Copy server URL"
              className="shrink-0 inline-flex items-center gap-2 rounded border border-border/20 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-holistic/70 hover:text-holistic hover:border-holistic/40 transition-colors duration-500"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        {/* ChatGPT */}
        <section className="mb-14">
          <h2 className="text-xl font-light tracking-tight mb-5">ChatGPT</h2>
          <ol className="space-y-3 text-holistic/70 leading-relaxed list-decimal list-inside marker:text-holistic/40">
            <li>
              Open{" "}
              <a
                className="underline underline-offset-4 hover:text-holistic transition-colors"
                href="https://chatgpt.com/#settings/Connectors/Advanced"
                target="_blank"
                rel="noreferrer"
              >
                ChatGPT → Settings → Connectors → Advanced
              </a>{" "}
              and enable Developer mode (read the risk notice shown there).
            </li>
            <li>In the chat composer's "+" menu, turn on Developer mode.</li>
            <li>Click <em>Add sources</em>, then <em>Connect more</em>.</li>
            <li>Name the connector <em>Plan B Asia</em> and paste the server URL above.</li>
            <li>Ask ChatGPT to use Plan B Asia — for example, "list Plan B Asia's visa services".</li>
          </ol>
        </section>

        {/* Claude */}
        <section className="mb-16">
          <h2 className="text-xl font-light tracking-tight mb-5">Claude</h2>
          <ol className="space-y-3 text-holistic/70 leading-relaxed list-decimal list-inside marker:text-holistic/40">
            <li>
              Open{" "}
              <a
                className="underline underline-offset-4 hover:text-holistic transition-colors"
                href="https://claude.ai/customize/connectors?modal=add-custom-connector"
                target="_blank"
                rel="noreferrer"
              >
                Claude → Custom connectors
              </a>
              .
            </li>
            <li>Name the connector <em>Plan B Asia</em> and paste the server URL above.</li>
            <li>Enable the connector from the chat composer, then ask Claude to use Plan B Asia.</li>
          </ol>
        </section>

        <p className="text-xs text-holistic/40 leading-relaxed">
          Your assistant can browse our services and, with your permission, open a
          confidential inquiry with the Plan B Asia advisory team.
        </p>
      </main>
    </div>
  );
}
