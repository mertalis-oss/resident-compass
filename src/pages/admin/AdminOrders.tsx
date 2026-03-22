import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Loader2, PackageOpen, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminLayout from '@/components/admin/AdminLayout';

interface Order {
  id: string;
  customer_name: string | null;
  customer_email: string;
  customer_whatsapp: string | null;
  status: string | null;
  refund_status: string | null;
  amount: number | null;
  currency: string | null;
  service_title_snapshot: string | null;
  source_domain: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  stripe_event_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  lead_id: string | null;
  updated_by: string | null;
  admin_notes: string | null;
  audit_trail: any[] | null;
  created_at: string | null;
  paid_at: string | null;
}

const statusColors: Record<string, string> = {
  initiated: 'bg-muted text-muted-foreground',
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-teal/10 text-teal',
  processing: 'bg-gold/10 text-gold',
  fulfilled: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
  refunded: 'bg-destructive/10 text-destructive',
  disputed: 'bg-destructive/20 text-destructive',
  abandoned: 'bg-muted text-muted-foreground/60',
  failed: 'bg-destructive/10 text-destructive',
};

const TERMINAL_STATES = ['refunded', 'cancelled', 'failed', 'disputed'];

export default function AdminOrders() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionDialog, setActionDialog] = useState<{ id: string; action: string } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter as any);
      const { data, error } = await query;
      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.fetchError', { defaultValue: 'Failed to load orders' }), description: err.message });
    } finally {
      setLoading(false);
    }
  }, [filter, toast, t]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (o.customer_email?.toLowerCase().includes(s) || o.customer_name?.toLowerCase().includes(s) || o.service_title_snapshot?.toLowerCase().includes(s));
  });

  const handleStatusUpdate = async () => {
    if (!actionDialog || updating) return;
    const order = orders.find(o => o.id === actionDialog.id);
    if (!order) return;

    // Terminal state lock
    if (TERMINAL_STATES.includes(order.status || '')) {
      toast({ variant: 'destructive', title: t('admin.terminalState', { defaultValue: 'Cannot change terminal status' }), description: t('admin.terminalStateDesc', { defaultValue: 'Refunded, cancelled, failed, and disputed orders cannot be changed back.' }) });
      setActionDialog(null);
      return;
    }

    setUpdating(true);
    try {
      const existingAudit = Array.isArray(order.audit_trail) ? order.audit_trail : [];
      const auditEntry = {
        action: `status_changed_to_${actionDialog.action}`,
        old_status: order.status,
        new_status: actionDialog.action,
        timestamp: new Date().toISOString(),
        by: 'admin',
      };

      const { error } = await supabase.from('orders').update({
        status: actionDialog.action as any,
        updated_by: 'admin',
        audit_trail: [...existingAudit, auditEntry],
      }).eq('id', actionDialog.id);

      if (error) throw error;
      toast({ title: t('admin.orderUpdated', { defaultValue: 'Order updated' }) });
      setActionDialog(null);
      fetchOrders();
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.updateError', { defaultValue: 'Update failed' }), description: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('admin.copied', { defaultValue: 'Copied!' }) });
  };

  const isTerminal = (status: string | null) => TERMINAL_STATES.includes(status || '');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="heading-section text-foreground">
          {t('admin.ordersTitle', { defaultValue: 'Orders' })}
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <Input
            placeholder={t('admin.searchOrders', { defaultValue: 'Search by email, name, or service...' })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.allStatuses', { defaultValue: 'All Statuses' })}</SelectItem>
              <SelectItem value="initiated">{t('admin.initiated', { defaultValue: 'Initiated' })}</SelectItem>
              <SelectItem value="pending">{t('admin.pending', { defaultValue: 'Pending' })}</SelectItem>
              <SelectItem value="paid">{t('admin.paid', { defaultValue: 'Paid' })}</SelectItem>
              <SelectItem value="processing">{t('admin.processing', { defaultValue: 'Processing' })}</SelectItem>
              <SelectItem value="fulfilled">{t('admin.fulfilled', { defaultValue: 'Fulfilled' })}</SelectItem>
              <SelectItem value="cancelled">{t('admin.cancelled', { defaultValue: 'Cancelled' })}</SelectItem>
              <SelectItem value="refunded">{t('admin.refunded', { defaultValue: 'Refunded' })}</SelectItem>
              <SelectItem value="disputed">{t('admin.disputed', { defaultValue: 'Disputed' })}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">{t('admin.noOrders', { defaultValue: 'No orders yet. Payments will appear here once completed.' })}</p>
          </div>
        ) : (
          <div className="border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.customer', { defaultValue: 'Customer' })}</TableHead>
                  <TableHead>{t('admin.serviceCol', { defaultValue: 'Service' })}</TableHead>
                  <TableHead>{t('admin.amountCol', { defaultValue: 'Amount' })}</TableHead>
                  <TableHead>{t('admin.statusCol', { defaultValue: 'Status' })}</TableHead>
                  <TableHead>{t('admin.dateCol', { defaultValue: 'Date' })}</TableHead>
                  <TableHead className="text-right">{t('admin.actionsCol', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setDetailOrder(order)}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{order.customer_name || '-'}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                          <button onClick={(e) => { e.stopPropagation(); copyToClipboard(order.customer_email); }} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {order.customer_whatsapp && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{order.customer_whatsapp}</span>
                            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(order.customer_whatsapp!); }} className="text-muted-foreground hover:text-foreground">
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.service_title_snapshot || '-'}</TableCell>
                    <TableCell className="font-medium">
                      {order.amount
                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency || 'USD', minimumFractionDigits: 0 }).format(order.amount)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[order.status || 'pending']} border-0 text-xs`}>
                        {order.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => setDetailOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'paid' && !isTerminal(order.status) && (
                          <Button size="sm" variant="outline" onClick={() => setActionDialog({ id: order.id, action: 'processing' })}>
                            {t('admin.markProcessing', { defaultValue: 'Processing' })}
                          </Button>
                        )}
                        {(order.status === 'paid' || order.status === 'processing') && !isTerminal(order.status) && (
                          <Button size="sm" variant="outline" className="text-success" onClick={() => setActionDialog({ id: order.id, action: 'fulfilled' })}>
                            {t('admin.markFulfilled', { defaultValue: 'Fulfilled' })}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Action confirm dialog */}
        <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.confirmAction', { defaultValue: 'Confirm Status Change' })}</DialogTitle>
              <DialogDescription>
                {t('admin.confirmActionDesc', { defaultValue: 'Are you sure you want to update this order status?' })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)} disabled={updating}>
                {t('admin.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button onClick={handleStatusUpdate} disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('admin.confirm', { defaultValue: 'Confirm' })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Order Detail Modal */}
        <Dialog open={!!detailOrder} onOpenChange={(open) => !open && setDetailOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('admin.orderDetail', { defaultValue: 'Order Details' })}</DialogTitle>
              <DialogDescription>{detailOrder?.id}</DialogDescription>
            </DialogHeader>
            {detailOrder && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 text-sm pr-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.emailLabel', { defaultValue: 'Email' })}</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{detailOrder.customer_email}</p>
                        <button onClick={() => copyToClipboard(detailOrder.customer_email)}><Copy className="h-3 w-3 text-muted-foreground" /></button>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.amountLabel', { defaultValue: 'Amount' })}</p>
                      <p className="font-medium">
                        {detailOrder.amount
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: detailOrder.currency || 'USD', minimumFractionDigits: 0 }).format(detailOrder.amount)
                          : '-'}{' '}
                        <span className="text-muted-foreground text-xs">{detailOrder.currency}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.statusCol', { defaultValue: 'Status' })}</p>
                      <Badge className={`${statusColors[detailOrder.status || 'pending']} border-0 text-xs`}>
                        {detailOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.refundStatusLabel', { defaultValue: 'Refund Status' })}</p>
                      <p className="font-medium">{detailOrder.refund_status || 'none'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">UTM Source</p>
                      <p className="font-medium">{detailOrder.utm_source || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">UTM Campaign</p>
                      <p className="font-medium">{detailOrder.utm_campaign || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Lead ID</p>
                      <p className="font-medium text-xs break-all">{detailOrder.lead_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Stripe Event</p>
                      <p className="font-medium text-xs break-all">{detailOrder.stripe_event_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Stripe Session</p>
                      <p className="font-medium text-xs break-all">{detailOrder.stripe_session_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Payment Intent</p>
                      <p className="font-medium text-xs break-all">{detailOrder.stripe_payment_intent || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.updatedBy', { defaultValue: 'Updated By' })}</p>
                      <p className="font-medium">{detailOrder.updated_by || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{t('admin.domain', { defaultValue: 'Domain' })}</p>
                      <p className="font-medium">{detailOrder.source_domain || '-'}</p>
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">{t('admin.auditTrail', { defaultValue: 'Audit Trail' })}</p>
                    {Array.isArray(detailOrder.audit_trail) && detailOrder.audit_trail.length > 0 ? (
                      <div className="space-y-2">
                        {detailOrder.audit_trail.map((entry: any, i: number) => (
                          <div key={i} className="text-xs bg-muted/30 rounded p-2 border border-border/50">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{entry.action}</span>
                              <span className="text-muted-foreground">{entry.by}</span>
                            </div>
                            {entry.old_status && (
                              <p className="text-muted-foreground">{entry.old_status} → {entry.new_status}</p>
                            )}
                            <p className="text-muted-foreground/60">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t('admin.noAudit', { defaultValue: 'No audit entries' })}</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
