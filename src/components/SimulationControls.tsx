import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface SimulationControlsProps {
  isPlaying: boolean;
  progress: number;
  selectedTruck: string | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
}

const SimulationControls = ({
  isPlaying,
  progress,
  selectedTruck,
  onPlay,
  onPause,
  onStop,
  onRestart,
  onSpeedChange,
  speed
}: SimulationControlsProps) => {
  if (!selectedTruck) return null;

  return (
    <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-background/95 backdrop-blur-sm border shadow-lg z-10 w-[90%] max-w-md">
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-semibold text-sm">Simulación: {selectedTruck}</h3>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Inicio</span>
            <span>{progress.toFixed(0)}%</span>
            <span>Final</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={isPlaying ? onPause : onPlay}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="h-8 w-8 p-0"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Velocidad:</span>
          <div className="flex gap-1">
            {[0.5, 1, 2, 4].map((speedOption) => (
              <Button
                key={speedOption}
                variant={speed === speedOption ? "default" : "outline"}
                size="sm"
                onClick={() => onSpeedChange(speedOption)}
                className="h-6 px-2 text-xs"
              >
                {speedOption}x
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimulationControls;