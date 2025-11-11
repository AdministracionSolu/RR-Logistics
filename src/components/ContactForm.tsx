import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const contactSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  empresa: z.string().trim().min(1, 'La empresa es requerida').max(100, 'Máximo 100 caracteres'),
  celular: z.string().trim().min(10, 'Mínimo 10 dígitos').max(15, 'Máximo 15 dígitos'),
  correo: z.string().trim().email('Correo inválido').max(255, 'Máximo 255 caracteres'),
  necesidad: z.string().trim().min(1, 'Este campo es requerido').max(500, 'Máximo 500 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contactos')
        .insert([{
          nombre: data.nombre,
          empresa: data.empresa,
          celular: data.celular,
          correo: data.correo,
          necesidad: data.necesidad,
        }]);

      if (error) throw error;

      toast({
        title: 'Mensaje enviado',
        description: 'Nos pondremos en contacto contigo pronto.',
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
          <Mail className="mr-2 h-4 w-4" />
          Contáctanos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contáctanos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register('nombre')} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input id="empresa" {...register('empresa')} />
            {errors.empresa && <p className="text-sm text-destructive">{errors.empresa.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular">Celular</Label>
            <Input id="celular" type="tel" {...register('celular')} />
            {errors.celular && <p className="text-sm text-destructive">{errors.celular.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo</Label>
            <Input id="correo" type="email" {...register('correo')} />
            {errors.correo && <p className="text-sm text-destructive">{errors.correo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="necesidad">¿Qué necesitan específicamente?</Label>
            <Textarea id="necesidad" {...register('necesidad')} rows={4} />
            {errors.necesidad && <p className="text-sm text-destructive">{errors.necesidad.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
