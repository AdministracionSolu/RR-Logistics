import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SpotEmbed = () => {
  const [hasError, setHasError] = useState(false);
  const isMobile = useIsMobile();
  const spotUrl = 'https://maps.findmespot.com/s/K16M';

  const handleIframeError = () => {
    setHasError(true);
  };

  const openInNewTab = () => {
    window.open(spotUrl, '_blank', 'noopener,noreferrer');
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar el mapa SPOT
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            El mapa no se puede mostrar debido a restricciones de seguridad del navegador.
          </p>
          <Button onClick={openInNewTab} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Abrir en nueva pestaña
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        height: 'calc(100vh - 64px)', 
        overflow: 'hidden', 
        position: 'relative',
        width: '100%'
      }}
    >
      <iframe
        src={spotUrl}
        title="SPOT live map"
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ 
          border: 0, 
          width: isMobile ? 'calc(100% + 80px)' : 'calc(100% + 60px)', // Extra width to push left menu out of view
          height: isMobile ? 'calc(100vh - 64px + 120px)' : 'calc(100vh - 64px + 80px)', // Extra height to push header/bottom out of view
          marginLeft: isMobile ? '-80px' : '-60px', // Push left content out of view
          marginTop: isMobile ? '-80px' : '0px', // Push SPOT header out of view on mobile
          marginBottom: '-80px' // Push bottom content down to hide the yellow bar
        }}
        allowFullScreen
        onError={handleIframeError}
        onLoad={(e) => {
          // Check if iframe loaded correctly
          try {
            const iframe = e.currentTarget;
            // If we can't access the contentWindow, it might be blocked
            if (!iframe.contentWindow) {
              setHasError(true);
            }
          } catch (error) {
            setHasError(true);
          }
        }}
      />
    </div>
  );
};

export default SpotEmbed;