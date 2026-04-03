import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingCart, Users, UserCheck, Webhook, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin/services', icon: Package, labelKey: 'admin.navServices' },
  { to: '/admin/orders', icon: ShoppingCart, labelKey: 'admin.navOrders' },
  { to: '/admin/leads', icon: Users, labelKey: 'admin.navLeads' },
  { to: '/admin/system/webhooks', icon: Webhook, labelKey: 'admin.navWebhooks' },
];

const defaultLabels: Record<string, string> = {
  'admin.navServices': 'Services',
  'admin.navOrders': 'Orders',
  'admin.navLeads': 'Leads',
  'admin.navWebhooks': 'Webhooks',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="text-lg font-heading text-sidebar-foreground">
            {t('admin.panelTitle', { defaultValue: 'Admin Panel' })}
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey, { defaultValue: defaultLabels[item.labelKey] })}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('admin.logout', { defaultValue: 'Sign Out' })}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
