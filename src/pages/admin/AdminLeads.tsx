import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Loader2, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Lead {
  id: string;
  name: string | null;
  email: string;
  customer_whatsapp: string | null;
  source_domain: string | null;
  created_from: string | null;
  score: number | null;
  status: string | null;
  created_at: string | null;
}

function getPriority(score: number | null): { label: string; icon: string; className: string } {
  if (score !== null && score >= 70) return { label: 'Hot', icon: '🔴', className: 'bg-destructive/10 text-destructive' };
  if (score !== null && score >= 40) return { label: 'Warm', icon: '🟡', className: 'bg-gold/10 text-gold' };
  return { label: 'Cold', icon: '⚪', className: 'bg-muted text-muted-foreground' };
}

export default function AdminLeads() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads((data as unknown as Lead[]) || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.fetchError', { defaultValue: 'Failed to load leads' }), description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filteredLeads = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.email?.toLowerCase().includes(s) || l.name?.toLowerCase().includes(s));
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('admin.copied', { defaultValue: 'Copied!' }) });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="heading-section text-foreground">
          {t('admin.leadsTitle', { defaultValue: 'Leads' })}
        </h1>

        <Input
          placeholder={t('admin.searchLeads', { defaultValue: 'Search by email or name...' })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">{t('admin.noLeads', { defaultValue: 'No leads yet.' })}</p>
          </div>
        ) : (
          <div className="border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.priority', { defaultValue: 'Priority' })}</TableHead>
                  <TableHead>{t('admin.nameCol', { defaultValue: 'Name' })}</TableHead>
                  <TableHead>{t('admin.emailCol', { defaultValue: 'Email' })}</TableHead>
                  <TableHead>{t('admin.whatsappCol', { defaultValue: 'WhatsApp' })}</TableHead>
                  <TableHead>{t('admin.sourceCol', { defaultValue: 'Source' })}</TableHead>
                  <TableHead>{t('admin.statusCol', { defaultValue: 'Status' })}</TableHead>
                  <TableHead>{t('admin.dateCol', { defaultValue: 'Date' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const priority = getPriority(lead.score);
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Badge className={`${priority.className} border-0 text-xs`}>
                          {priority.icon} {priority.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{lead.name || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{lead.email}</span>
                          <button onClick={() => copyToClipboard(lead.email)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.customer_whatsapp ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{lead.customer_whatsapp}</span>
                            <button onClick={() => copyToClipboard(lead.customer_whatsapp!)} className="text-muted-foreground hover:text-foreground">
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.source_domain || lead.created_from || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{lead.status || 'new'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
