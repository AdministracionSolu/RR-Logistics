import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Map, Bot, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente"
    });
  };

  const navItems = [
    {
      href: '/dashboard-a',
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
      <div className="container flex h-16 items-center px-4">
        {/* Logo and title */}
        <div className="flex items-center space-x-2 mr-4">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">Gestión interna</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex items-center gap-2 px-3',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User info and logout */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-medium">{profile?.full_name || profile?.email}</span>
            <span className="text-xs text-muted-foreground">Usuario A</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Salir</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;