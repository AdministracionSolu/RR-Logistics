import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users } from 'lucide-react';
const CreateTestUsers = () => {
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const createUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ecbmrrpssdmmoqygtknf.supabase.co/functions/v1/create-test-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYm1ycnBzc2RtbW9xeWd0a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzQ1MTIsImV4cCI6MjA3MTA1MDUxMn0.A8CriuvTLVFE02ZW5ULZ4pSpNutER47X-sqr7K6lm-o`
        }
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('seededUsers', 'true');
        toast({
          title: "Usuarios creados exitosamente",
          description: `Usuario A: ${result.users.userA}, Usuario B: ${result.users.userB}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.errors?.userA || result.errors?.userB || "Error desconocido"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear usuarios de prueba"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem('seededUsers')) {
      createUsers();
    }
  }, []);
  return <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        
        
      </Card>
    </div>;
};
export default CreateTestUsers;