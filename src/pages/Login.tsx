import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, AlertCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateTestUsers from '@/components/CreateTestUsers';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    signIn,
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }
    const {
      error: signInError
    } = await signIn(email, password);
    if (signInError) {
      setError('Credenciales incorrectas. Verifique su email y contraseña.');
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Credenciales incorrectas"
      });
    } else {
      toast({
        title: "Bienvenido",
        description: "Inicio de sesión exitoso"
      });
    }
    setLoading(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Home button */}
        <div className="flex justify-start mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Button>
        </div>

        {/* Logo y branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-lg">
              <Map className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión Interna</h1>
            <p className="text-muted-foreground mt-2">Sistema de monitoreo y seguimiento</p>
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="usuario@empresa.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} className="h-11" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} className="h-11" />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </> : 'Iniciar Sesión'}
              </Button>

              {/* Botón de registro deshabilitado */}
              
            </form>
          </CardContent>
        </Card>

        {/* Footer con información adicional */}
        <div className="text-center space-y-2">
          
        </div>
      </div>
      
      {/* Componente temporal para crear usuarios de prueba */}
      <CreateTestUsers />
    </div>;
};
export default Login;