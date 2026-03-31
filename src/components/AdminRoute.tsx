import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async (userId?: string) => {
      const resolvedUserId = userId ?? (await supabase.auth.getSession()).data.session?.user.id;

      if (!resolvedUserId) {
        if (!isMounted) return;
        setAuthorized(false);
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc('has_role', {
        _user_id: resolvedUserId,
        _role: 'admin',
      });

      if (!isMounted) return;

      if (error || !isAdmin) {
        setAuthorized(false);
        setLoading(false);
        navigate('/', { replace: true });
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    void checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (!isMounted) return;
        setAuthorized(false);
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      void checkAdmin(session.user.id);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
