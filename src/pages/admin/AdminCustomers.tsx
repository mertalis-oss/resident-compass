import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Loader2, UserCheck, Mail, Phone, Globe, ShoppingCart } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Customer {
  email: string;
  name: string | null;
  whatsapp: string | null;
  source: string | null;
  total_orders: number;
  total_spent: number;
  currency: string;
  last_order_at: string | null;
  statuses: string[];
  lead_score: number | null;
  lead_status: string | null;
}

export default function AdminCustomers() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = useCallback(async () => {
    try {
      // Fetch orders and leads, merge by email
      const [ordersRes, leadsRes] = await Promise.all([
        supabase.from('orders').select('customer_email, customer_name, customer_whatsapp, source_domain, amount, currency, status, created_at').order('created_at', { ascending: false }),
        supabase.from('leads').select('email, name, customer_whatsapp, source_domain, score, status'),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (leadsRes.error) throw leadsRes.error;

      const customerMap = new Map<string, Customer>();

      // Process orders
      for (const order of (ordersRes.data || [])) {
        const email = order.customer_email?.toLowerCase();
        if (!email) continue;
        const existing = customerMap.get(email);
        if (existing) {
          existing.total_orders += 1;
          existing.total_spent += Number(order.amount || 0);
          if (!existing.name && order.customer_name) existing.name = order.customer_name;
          if (!existing.whatsapp && order.customer_whatsapp) existing.whatsapp = order.customer_whatsapp;
          if (order.status && !existing.statuses.includes(order.status)) existing.statuses.push(order.status);
          if (!existing.last_order_at || (order.created_at && order.created_at > existing.last_order_at)) {
            existing.last_order_at = order.created_at;
          }
        } else {
          customerMap.set(email, {
            email,
            name: order.customer_name || null,
            whatsapp: order.customer_whatsapp || null,
            source: order.source_domain || null,
            total_orders: 1,
            total_spent: Number(order.amount || 0),
            currency: order.currency || 'USD',
            last_order_at: order.created_at || null,
            statuses: order.status ? [order.status] : [],
            lead_score: null,
            lead_status: null,
          });
        }
      }

      // Enrich with leads data
      for (const lead of (leadsRes.data || [])) {
        const email = lead.email?.toLowerCase();
        if (!email) continue;
        const existing = customerMap.get(email);
        if (existing) {
          if (!existing.name && lead.name) existing.name = lead.name;
          if (!existing.whatsapp && lead.customer_whatsapp) existing.whatsapp = lead.customer_whatsapp;
          if (!existing.source && lead.source_domain) existing.source = lead.source_domain;
          existing.lead_score = lead.score as number | null;
          existing.lead_status = lead.status as string | null;
        } else {
          customerMap.set(email, {
            email,
            name: lead.name || null,
            whatsapp: lead.customer_whatsapp || null,
            source: lead.source_domain || null,
            total_orders: 0,
            total_spent: 0,
            currency: 'USD',
            last_order_at: null,
            statuses: [],
            lead_score: lead.score as number | null,
            lead_status: lead.status as string | null,
          });
        }
      }

      // Sort: paying customers first, then by score
      const sorted = Array.from(customerMap.values()).sort((a, b) => {
        if (a.total_orders !== b.total_orders) return b.total_orders - a.total_orders;
        return (b.lead_score || 0) - (a.lead_score || 0);
      });

      setCustomers(sorted);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to load customers', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.email.includes(s) || c.name?.toLowerCase().includes(s) || c.whatsapp?.includes(s);
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!' });
  };

  const formatMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-section text-foreground">Customers</h1>
          <Badge variant="outline" className="text-xs">{filtered.length} total</Badge>
        </div>

        <Input
          placeholder="Search by email, name, or WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No customers yet.</p>
          </div>
        ) : (
          <div className="border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{c.name || '—'}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{c.email}</span>
                          <button onClick={() => copyToClipboard(c.email)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.whatsapp ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{c.whatsapp}</span>
                          <button onClick={() => copyToClipboard(c.whatsapp!)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{c.total_orders}</span>
                        {c.statuses.includes('paid') && <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px]">Paid</Badge>}
                        {c.statuses.includes('pending') && <Badge className="bg-yellow-500/10 text-yellow-600 border-0 text-[10px]">Pending</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{c.total_spent > 0 ? formatMoney(c.total_spent, c.currency) : '—'}</span>
                    </TableCell>
                    <TableCell>
                      {c.lead_score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{c.lead_score}</span>
                          <Badge className={`border-0 text-[10px] ${
                            c.lead_score >= 70 ? 'bg-destructive/10 text-destructive' :
                            c.lead_score >= 40 ? 'bg-yellow-500/10 text-yellow-600' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {c.lead_score >= 70 ? '🔴 Hot' : c.lead_score >= 40 ? '🟡 Warm' : '⚪ Cold'}
                          </Badge>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{c.source || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : c.lead_status || '—'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
