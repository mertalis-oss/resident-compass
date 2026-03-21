import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useDomainScope } from '@/hooks/useDomainScope';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Copy, RotateCcw, Pencil, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Service {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  is_bundle: boolean | null;
  visible_on: string | null;
  category: string | null;
  stripe_price_id: string;
  short_description: string | null;
  description: string | null;
  features: { title: string; description: string }[] | null;
  faq: { question: string; answer: string }[] | null;
  seo_title: string | null;
  seo_description: string | null;
  image_url: string | null;
  calendly_url: string | null;
  delivery_time_days: number | null;
  location: string | null;
  capacity: number | null;
  order_index: number | null;
}

const emptyService: Partial<Service> = {
  title: '',
  slug: '',
  price: 0,
  currency: 'USD',
  stripe_price_id: '',
  is_active: true,
  is_featured: false,
  is_bundle: false,
  visible_on: 'both',
  category: '',
  short_description: '',
  description: '',
  seo_title: '',
  seo_description: '',
  image_url: '',
  calendly_url: '',
  delivery_time_days: null,
  location: '',
  capacity: null,
  order_index: 0,
};

export default function AdminServices() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const scope = useDomainScope();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editService, setEditService] = useState<Partial<Service>>(emptyService);
  const [saving, setSaving] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      let query = supabase.from('services').select('*').order('order_index', { ascending: true });
      if (!showDeleted) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      setServices((data as unknown as Service[]) || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.fetchError', { defaultValue: 'Failed to load services' }), description: err.message });
    } finally {
      setLoading(false);
    }
  }, [showDeleted, toast, t]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Debounced slug check
  useEffect(() => {
    if (!editService.slug || editService.slug.length < 2) {
      setSlugAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSlugChecking(true);
      const { data } = await supabase
        .from('services')
        .select('id')
        .eq('slug', editService.slug!)
        .neq('id', editService.id || '')
        .maybeSingle();
      setSlugAvailable(!data);
      setSlugChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [editService.slug, editService.id]);

  const autoSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        title: editService.title,
        slug: editService.slug,
        price: editService.price,
        currency: editService.currency || 'USD',
        stripe_price_id: editService.stripe_price_id,
        is_active: editService.is_active ?? true,
        is_featured: editService.is_featured ?? false,
        is_bundle: editService.is_bundle ?? false,
        visible_on: (editService.visible_on || 'both') as 'tr' | 'global' | 'both',
        category: editService.category || null,
        short_description: editService.short_description || null,
        description: editService.description || null,
        seo_title: editService.seo_title || null,
        seo_description: editService.seo_description || null,
        image_url: editService.image_url || null,
        calendly_url: editService.calendly_url || null,
        delivery_time_days: editService.delivery_time_days || null,
        location: editService.location || null,
        capacity: editService.capacity || null,
        order_index: editService.order_index || 0,
      };

      if (editService.id) {
        // @ts-ignore - payload matches DB schema
        const { error } = await supabase.from('services').update(payload).eq('id', editService.id);
        if (error) throw error;
        toast({ title: t('admin.serviceUpdated', { defaultValue: 'Service updated' }) });
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
        toast({ title: t('admin.serviceCreated', { defaultValue: 'Service created' }) });
      }
      setEditOpen(false);
      setEditService(emptyService);
      fetchServices();
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.saveError', { defaultValue: 'Save failed' }), description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (svc: Service) => {
    try {
      const { error } = await supabase.from('services').insert({
        title: `${svc.title} (Copy)`,
        slug: `${svc.slug}-copy-${Date.now()}`,
        price: svc.price,
        currency: svc.currency,
        stripe_price_id: svc.stripe_price_id,
        is_active: false,
        is_featured: false,
        is_bundle: svc.is_bundle,
        visible_on: svc.visible_on,
        category: svc.category,
        short_description: svc.short_description,
        description: svc.description,
        seo_title: svc.seo_title,
        seo_description: svc.seo_description,
        image_url: svc.image_url,
        calendly_url: svc.calendly_url,
        delivery_time_days: svc.delivery_time_days,
        location: svc.location,
        capacity: svc.capacity,
        order_index: (svc.order_index || 0) + 1,
      });
      if (error) throw error;
      toast({ title: t('admin.serviceDuplicated', { defaultValue: 'Service duplicated' }) });
      fetchServices();
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.duplicateError', { defaultValue: 'Duplicate failed' }), description: err.message });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase.from('services').update({ is_active: true }).eq('id', id);
      if (error) throw error;
      toast({ title: t('admin.serviceRestored', { defaultValue: 'Service restored' }) });
      setRestoreConfirm(null);
      fetchServices();
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('admin.restoreError', { defaultValue: 'Restore failed' }), description: err.message });
    }
  };

  const visibilityBadge = (v: string | null) => {
    if (v === 'tr') return <Badge variant="outline" className="text-xs">TR</Badge>;
    if (v === 'global') return <Badge variant="outline" className="text-xs">Global</Badge>;
    return <Badge variant="secondary" className="text-xs">Both</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-section text-foreground">
            {t('admin.servicesTitle', { defaultValue: 'Services' })}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
              <span className="text-sm text-muted-foreground">
                {t('admin.showDeleted', { defaultValue: 'Show inactive' })}
              </span>
            </div>
            <Button onClick={() => { setEditService(emptyService); setEditOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.addService', { defaultValue: 'Add Service' })}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {t('admin.noServices', { defaultValue: 'No services found.' })}
          </div>
        ) : (
          <div className="border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.titleCol', { defaultValue: 'Title' })}</TableHead>
                  <TableHead>{t('admin.slugCol', { defaultValue: 'Slug' })}</TableHead>
                  <TableHead>{t('admin.priceCol', { defaultValue: 'Price' })}</TableHead>
                  <TableHead>{t('admin.visibilityCol', { defaultValue: 'Visibility' })}</TableHead>
                  <TableHead>{t('admin.statusCol', { defaultValue: 'Status' })}</TableHead>
                  <TableHead className="text-right">{t('admin.actionsCol', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((svc) => (
                  <TableRow key={svc.id} className={!svc.is_active ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">
                      {svc.title}
                      {svc.is_featured && <Badge className="ml-2 bg-gold text-gold-foreground text-xs">★</Badge>}
                      {svc.visible_on && svc.visible_on !== 'both' && svc.visible_on !== scope && (
                        <span className="ml-2 inline-flex items-center text-xs text-destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {t('admin.hiddenScope', { defaultValue: 'Hidden on this domain' })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">{svc.slug}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: svc.currency || 'USD', minimumFractionDigits: 0 }).format(svc.price)}
                    </TableCell>
                    <TableCell>{visibilityBadge(svc.visible_on)}</TableCell>
                    <TableCell>
                      {svc.is_active ? (
                        <Badge className="bg-success/10 text-success border-0">{t('admin.active', { defaultValue: 'Active' })}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-destructive">{t('admin.inactive', { defaultValue: 'Inactive' })}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditService(svc); setEditOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(svc)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {!svc.is_active && showDeleted && (
                          <Dialog open={restoreConfirm === svc.id} onOpenChange={(open) => setRestoreConfirm(open ? svc.id : null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-success">
                                <RotateCcw className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t('admin.restoreConfirm', { defaultValue: 'Restore Service?' })}</DialogTitle>
                                <DialogDescription>{t('admin.restoreDesc', { defaultValue: 'This will make the service active again.' })}</DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setRestoreConfirm(null)}>
                                  {t('admin.cancel', { defaultValue: 'Cancel' })}
                                </Button>
                                <Button onClick={() => handleRestore(svc.id)}>
                                  {t('admin.restore', { defaultValue: 'Restore' })}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit/Create Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editService.id
                  ? t('admin.editService', { defaultValue: 'Edit Service' })
                  : t('admin.newService', { defaultValue: 'New Service' })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.titleCol', { defaultValue: 'Title' })}</Label>
                  <Input
                    value={editService.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditService((prev) => ({
                        ...prev,
                        title,
                        slug: prev.id ? prev.slug : autoSlug(title),
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.slugCol', { defaultValue: 'Slug' })}</Label>
                  <div className="relative">
                    <Input
                      value={editService.slug || ''}
                      onChange={(e) => setEditService((prev) => ({ ...prev, slug: e.target.value }))}
                      className={slugAvailable === false ? 'border-destructive' : ''}
                    />
                    {slugChecking && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                    {slugAvailable === false && (
                      <p className="text-xs text-destructive mt-1">{t('admin.slugTaken', { defaultValue: 'Slug already exists' })}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.priceCol', { defaultValue: 'Price' })}</Label>
                  <Input type="number" value={editService.price || 0} onChange={(e) => setEditService((prev) => ({ ...prev, price: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.currency', { defaultValue: 'Currency' })}</Label>
                  <Select value={editService.currency || 'USD'} onValueChange={(v) => setEditService((prev) => ({ ...prev, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="TRY">TRY</SelectItem>
                      <SelectItem value="THB">THB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stripe Price ID</Label>
                  <Input value={editService.stripe_price_id || ''} onChange={(e) => setEditService((prev) => ({ ...prev, stripe_price_id: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.visibilityCol', { defaultValue: 'Visibility' })}</Label>
                  <Select value={editService.visible_on || 'both'} onValueChange={(v) => setEditService((prev) => ({ ...prev, visible_on: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="tr">TR Only</SelectItem>
                      <SelectItem value="global">Global Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.category', { defaultValue: 'Category' })}</Label>
                  <Input value={editService.category || ''} onChange={(e) => setEditService((prev) => ({ ...prev, category: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.shortDesc', { defaultValue: 'Short Description' })}</Label>
                <Input value={editService.short_description || ''} onChange={(e) => setEditService((prev) => ({ ...prev, short_description: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.description', { defaultValue: 'Description' })}</Label>
                <Textarea rows={4} value={editService.description || ''} onChange={(e) => setEditService((prev) => ({ ...prev, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={editService.is_active ?? true} onCheckedChange={(v) => setEditService((prev) => ({ ...prev, is_active: v }))} />
                  <Label>{t('admin.active', { defaultValue: 'Active' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editService.is_featured ?? false} onCheckedChange={(v) => setEditService((prev) => ({ ...prev, is_featured: v }))} />
                  <Label>{t('admin.featured', { defaultValue: 'Featured' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editService.is_bundle ?? false} onCheckedChange={(v) => setEditService((prev) => ({ ...prev, is_bundle: v }))} />
                  <Label>{t('admin.bundle', { defaultValue: 'Bundle' })}</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                {t('admin.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button onClick={handleSave} disabled={saving || slugAvailable === false}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('admin.save', { defaultValue: 'Save' })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
