import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { askConcierge } from "@/lib/ai/concierge";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIConciergeWidgetProps {
  userId: string;
  daysSpent: number;
  taxResident: boolean;
  enrollmentStatus: string | null;
}

const RATE_LIMIT = 5;

export default function AIConciergeWidget({
  userId,
  daysSpent,
  taxResident,
  enrollmentStatus,
}: AIConciergeWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check hourly message count on open
  useEffect(() => {
    if (!open) return;
    const checkCount = async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("ai_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", oneHourAgo);
      setMsgCount(count ?? 0);
    };
    checkCount();
  }, [open, userId, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    if (msgCount >= RATE_LIMIT) {
      toast.error("You've reached the limit of 5 AI messages per hour. Please try again later.");
      return;
    }

    const userMsg: Message = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      // Record in DB (trigger will enforce hard limit)
      const { error: insertError } = await supabase
        .from("ai_messages")
        .insert({ user_id: userId, message: trimmed });

      if (insertError) {
        if (insertError.message?.includes("rate limit")) {
          toast.error("AI rate limit exceeded. Please wait before sending another message.");
          setSending(false);
          return;
        }
        throw insertError;
      }

      const response = await askConcierge({
        user_id: userId,
        role: "client",
        days_spent: daysSpent,
        tax_resident: taxResident,
        enrollment_status: enrollmentStatus,
        language: "en",
        reforms_context: "2026 Thailand Revenue Code reforms: worldwide income taxation for residents spending 180+ days",
        user_message: trimmed,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply, timestamp: response.timestamp },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          aria-label="Open AI Concierge"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-primary/5">
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">AI Concierge</h3>
              <p className="text-[11px] text-muted-foreground">
                {msgCount}/{RATE_LIMIT} messages this hour
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3 min-h-[280px]">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center mt-10">
                Ask me about visas, tax compliance, or relocation planning.
              </p>
            )}
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-xl px-3.5 py-2.5 text-sm flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Agent is analyzing your context…
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <Textarea
              placeholder="Type your question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[40px] max-h-[80px] resize-none text-sm"
              disabled={sending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
