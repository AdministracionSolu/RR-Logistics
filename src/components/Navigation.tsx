import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Map, Upload, History, AlertTriangle, Bot, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const MobileNavContent = () => (
    <div className="flex flex-col space-y-4 p-6">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex flex-col space-y-2 mb-4">
          <span className="text-sm font-medium">{profile?.full_name || profile?.email}</span>
          <span className="text-xs text-muted-foreground">Usuario A</span>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            handleSignOut();
            setIsMobileMenuOpen(false);
          }}
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

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

        {/* Desktop Navigation */}
        {!isMobile && (
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
        )}

        {/* Mobile Navigation */}
        {isMobile && <div className="flex-1" />}

        {/* Desktop User info and logout */}
        {!isMobile && (
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
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <MobileNavContent />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
};

export default Navigation;