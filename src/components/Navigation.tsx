import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Map, Upload, History, AlertTriangle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Vista general de la flota'
    },
    {
      href: '/eventos',
      label: 'Eventos',
      icon: Calendar,
      description: 'Registro y historial de cruces'
    }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-2 mr-8">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Gestión interna</h1>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex items-center gap-2',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <div className="text-xs text-muted-foreground">
            Última actualización: {new Date().toLocaleTimeString('es-MX')}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;