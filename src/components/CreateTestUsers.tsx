import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users } from 'lucide-react';

const CreateTestUsers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/create-test-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Usuarios creados exitosamente",
          description: `Usuario A: ${result.users.userA}, Usuario B: ${result.users.userB}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.errors?.userA || result.errors?.userB || "Error desconocido",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear usuarios de prueba",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin: Crear Usuarios
          </CardTitle>
          <CardDescription>
            Ejecutar una vez para crear usuarios de prueba
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createUsers} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando usuarios...
              </>
            ) : (
              'Crear Usuarios de Prueba'
            )}
          </Button>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>• Usuario A: a@solu.mx / Passw0rd!A</p>
            <p>• Usuario B: b@solu.mx / Passw0rd!B</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTestUsers;