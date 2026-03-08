import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function WebhooksPage() {
  const queryClient = useQueryClient();
  const [replayingId, setReplayingId] = useState<string | null>(null);

  const { data: failures, isLoading } = useQuery({
    queryKey: ["webhook-failures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stripe_webhook_failures")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: metrics } = useQuery({
    queryKey: ["webhook-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stripe_webhook_metrics")
        .select("*")
        .order("last_processed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const replayMutation = useMutation({
    mutationFn: async (failureId: string) => {
      setReplayingId(failureId);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/replay-webhook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ failure_id: failureId }),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Replay failed");
      return result;
    },
    onSuccess: () => {
      toast.success("Webhook replayed successfully");
      queryClient.invalidateQueries({ queryKey: ["webhook-failures"] });
      queryClient.invalidateQueries({ queryKey: ["webhook-metrics"] });
      setReplayingId(null);
    },
    onError: (err: Error) => {
      toast.error(`Replay failed: ${err.message}`);
      setReplayingId(null);
    },
  });

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Webhook Dead Letter Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and reprocess failed Stripe webhook events.
          </p>
        </div>

        {/* Metrics Summary */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div
                key={m.event_type}
                className="rounded-lg border border-border bg-card p-4 space-y-1"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {m.event_type}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-primary">
                    ✓ {m.success_count}
                  </span>
                  <span className="text-lg font-semibold text-destructive">
                    ✗ {m.failure_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Failures Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Status</TableHead>
                <TableHead>Event ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <RefreshCw className="inline animate-spin mr-2 h-4 w-4" />
                    Loading…
                  </TableCell>
                </TableRow>
              ) : !failures || failures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No failed webhooks 🎉
                  </TableCell>
                </TableRow>
              ) : (
                failures.map((f) => (
                  <TableRow key={f.id} className={f.resolved ? "opacity-60" : ""}>
                    <TableCell>
                      {f.resolved ? (
                        <Badge variant="outline" className="border-primary text-primary gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[160px] truncate">
                      {f.event_id}
                    </TableCell>
                    <TableCell className="text-sm">{f.event_type}</TableCell>
                    <TableCell className="text-sm text-destructive max-w-[200px] truncate">
                      {f.error_message}
                    </TableCell>
                    <TableCell className="text-center">{f.retry_count}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(f.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={f.resolved || replayingId === f.id}
                        onClick={() => replayMutation.mutate(f.id)}
                      >
                        {replayingId === f.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        <span className="ml-1">Replay</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
