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
import { Copy, Loader2, PackageOpen } from 'lucide-react';
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
  created_at: string | null;
  paid_at: string | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-teal/10 text-teal',
  processing: 'bg-gold/10 text-gold',
  fulfilled: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminOrders() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionDialog, setActionDialog] = useState<{ id: string; action: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter);
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
    setUpdating(true);
    try {
      const { error } = await supabase.from('orders').update({ status: actionDialog.action as any }).eq('id', actionDialog.id);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="heading-section text-foreground">
          {t('admin.ordersTitle', { defaultValue: 'Orders' })}
        </h1>

        <div className="flex items-center gap-4">
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
              <SelectItem value="pending">{t('admin.pending', { defaultValue: 'Pending' })}</SelectItem>
              <SelectItem value="paid">{t('admin.paid', { defaultValue: 'Paid' })}</SelectItem>
              <SelectItem value="processing">{t('admin.processing', { defaultValue: 'Processing' })}</SelectItem>
              <SelectItem value="fulfilled">{t('admin.fulfilled', { defaultValue: 'Fulfilled' })}</SelectItem>
              <SelectItem value="cancelled">{t('admin.cancelled', { defaultValue: 'Cancelled' })}</SelectItem>
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
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{order.customer_name || '-'}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                          <button onClick={() => copyToClipboard(order.customer_email)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {order.customer_whatsapp && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{order.customer_whatsapp}</span>
                            <button onClick={() => copyToClipboard(order.customer_whatsapp!)} className="text-muted-foreground hover:text-foreground">
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
                      <div className="flex items-center justify-end gap-1">
                        {order.status === 'paid' && (
                          <Button size="sm" variant="outline" onClick={() => setActionDialog({ id: order.id, action: 'processing' })}>
                            {t('admin.markProcessing', { defaultValue: 'Processing' })}
                          </Button>
                        )}
                        {(order.status === 'paid' || order.status === 'processing') && (
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
      </div>
    </AdminLayout>
  );
}
