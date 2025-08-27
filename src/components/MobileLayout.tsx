import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Map, Calendar, AlertTriangle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const [alertsCount, setAlertsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    loadAlertsCount();
    
    // Update alerts count every minute
    const interval = setInterval(loadAlertsCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAlertsCount = async () => {
    try {
      const { count } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'cobro_duplicado')
        .eq('estado', 'activa');

      setAlertsCount(count || 0);
    } catch (error) {
      console.error('Error loading alerts count:', error);
    }
  };

  const navItems = [
    {
      href: '/',
      label: 'Mapa',
      icon: Map,
      path: '/'
    },
    {
      href: '/eventos',
      label: 'Eventos',
      icon: Calendar,
      path: '/eventos'
    },
    {
      href: '/alertas',
      label: 'Alertas',
      icon: AlertTriangle,
      path: '/alertas',
      badge: alertsCount > 0 ? alertsCount : undefined
    },
    {
      href: '/configuracion',
      label: 'Config',
      icon: Settings,
      path: '/configuracion'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - minimizado en mobile */}
      <header className="bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between md:px-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Map className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold">Gestión interna</h1>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {new Date().toLocaleTimeString('es-MX')}
        </div>
      </header>

      {/* Main Content - takes remaining space */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation - fixed at bottom */}
      <nav className="bg-background/95 backdrop-blur border-t px-2 py-2 safe-area-inset-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg min-w-[64px] relative transition-colors',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 mb-1" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-[20px]"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;