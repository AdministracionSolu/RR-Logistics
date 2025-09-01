import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Map, Upload, History, AlertTriangle, Bot } from 'lucide-react';

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
    },
    {
      href: '/bot-admin',
      label: 'Bot Admin',
      icon: Bot,
      description: 'Administración del bot automatizado'
    }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-2 sm:px-4">
        {/* Logo and title - responsive sizing */}
        <div className="flex items-center space-x-1 sm:space-x-2 mr-2 sm:mr-4">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Map className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm sm:text-lg font-semibold">Gestión interna</h1>
          </div>
        </div>

        {/* Navigation items - mobile optimized */}
        <div className="flex items-center space-x-1 flex-1 justify-center sm:justify-start">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xs:inline text-xs sm:text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Last update - hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="text-xs text-muted-foreground">
            Última actualización: {new Date().toLocaleTimeString('es-MX')}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;