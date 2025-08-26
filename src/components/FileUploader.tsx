import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  onUploadComplete?: () => void;
}

const FileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    processed: number;
    errors: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const parseFileContent = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const events: any[] = [];
          
          // Skip header and process data lines
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const cols = parseCSVLine(line);
            if (cols.length >= 8) {
              events.push({
                tag_id: cols[0]?.replace(/"/g, ''),
                concepto: cols[1]?.replace(/"/g, ''),
                fecha_hora: cols[2]?.replace(/"/g, ''),
                caseta_nombre: cols[3]?.replace(/"/g, ''),
                carril_id: parseInt(cols[4]?.replace(/"/g, '')) || null,
                clase: cols[5]?.replace(/"/g, ''),
                importe: parseFloat(cols[6]?.replace(/"/g, '')) || 0,
                saldo: parseFloat(cols[7]?.replace(/"/g, '')) || 0,
                folio: cols[8]?.replace(/"/g, '') || null
              });
            }
          }
          
          resolve(events);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const findCasetaByName = async (casetaNombre: string) => {
    const { data } = await supabase
      .from('casetas_autopista')
      .select('id')
      .ilike('nombre', `%${casetaNombre}%`)
      .limit(1)
      .single();
    
    return data?.id || null;
  };

  const processFileUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setUploadResults(null);
    
    try {
      const events = await parseFileContent(file);
      const results = { total: events.length, processed: 0, errors: 0 };
      
      for (let i = 0; i < events.length; i++) {
        try {
          const event = events[i];
          
          // Find caseta by name
          const casetaId = await findCasetaByName(event.caseta_nombre);
          
          // Parse date
          const fechaHora = new Date(event.fecha_hora);
          if (isNaN(fechaHora.getTime())) {
            results.errors++;
            continue;
          }
          
          // Insert toll event
          const { error } = await supabase
            .from('toll_events')
            .insert({
              tag_id: event.tag_id,
              concepto: event.concepto,
              fecha_hora: fechaHora.toISOString(),
              caseta_id: casetaId,
              caseta_nombre: event.caseta_nombre,
              carril_id: event.carril_id,
              clase: event.clase,
              importe: event.importe,
              saldo: event.saldo,
              folio: event.folio,
              source_type: 'file'
            });
          
          if (error) {
            console.error('Error inserting event:', error);
            results.errors++;
          } else {
            results.processed++;
          }
          
        } catch (error) {
          console.error('Error processing event:', error);
          results.errors++;
        }
        
        setProgress(Math.round((i + 1) / events.length * 100));
      }
      
      setUploadResults(results);
      
      if (results.processed > 0) {
        toast({
          title: "Archivo procesado",
          description: `${results.processed} eventos cargados exitosamente${results.errors > 0 ? `, ${results.errors} errores` : ''}`,
        });
        onUploadComplete?.();
      } else {
        toast({
          title: "Error en procesamiento",
          description: "No se pudieron procesar los eventos del archivo",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el archivo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Solo se admiten archivos CSV y Excel",
        variant: "destructive"
      });
      return;
    }
    
    processFileUpload(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Cargar Archivo PASE
        </CardTitle>
        <CardDescription>
          Sube archivos CSV o Excel con datos de cruces de casetas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
          size="lg"
        >
          <FileText className="mr-2 h-4 w-4" />
          {uploading ? 'Procesando...' : 'Seleccionar Archivo'}
        </Button>
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Procesando archivo... {progress}%
            </p>
          </div>
        )}
        
        {uploadResults && (
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{uploadResults.processed} eventos procesados exitosamente</span>
            </div>
            {uploadResults.errors > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>{uploadResults.errors} eventos con errores</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Total: {uploadResults.total} registros en el archivo
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;