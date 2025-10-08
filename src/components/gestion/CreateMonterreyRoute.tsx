import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';
import { createMonterreyRoute } from '@/scripts/createMonterreyRoute';

const CreateMonterreyRoute = () => {
  const { toast } = useToast();

  const handleCreate = async () => {
    try {
      toast({
        title: 'Creando ruta...',
        description: 'Guardando Sector Prueba Monterrey en la base de datos',
      });

      await createMonterreyRoute();

      toast({
        title: '✅ Ruta creada',
        description: 'Sector Prueba Monterrey se creó exitosamente. Recarga la página para verla en el mapa.',
      });
      
      // Reload the page to show the route
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la ruta. Ver consola para detalles.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleCreate} className="gap-2">
      <MapPin className="h-4 w-4" />
      Crear Sector Prueba Monterrey
    </Button>
  );
};

export default CreateMonterreyRoute;
