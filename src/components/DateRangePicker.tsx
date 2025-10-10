import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  className?: string;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onDateRangeChange,
  className
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined, isStart: boolean) => {
    if (isStart) {
      onDateRangeChange(date, endDate);
    } else {
      onDateRangeChange(startDate, date);
    }
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) {
      return "Seleccionar período";
    }
    if (startDate && !endDate) {
      return `Desde ${format(startDate, 'dd/MM/yyyy')}`;
    }
    if (!startDate && endDate) {
      return `Hasta ${format(endDate, 'dd/MM/yyyy')}`;
    }
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM')}`;
    }
    return "Seleccionar período";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-start text-left font-normal text-xs h-8 px-2",
            !startDate && !endDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background z-50" align="start" side="right" sideOffset={8}>
        <div className="flex flex-col space-y-3 p-4 max-h-[80vh] overflow-y-auto">
          <div className="text-sm font-medium">Período</div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                onDateRangeChange(weekAgo, today);
                setIsOpen(false);
              }}
              className="text-xs flex-1"
            >
              Última semana
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - 30);
                onDateRangeChange(monthAgo, today);
                setIsOpen(false);
              }}
              className="text-xs flex-1"
            >
              Último mes
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha inicio</label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateSelect(date, true)}
                disabled={(date) => date > new Date() || (endDate && date > endDate)}
                initialFocus
                className="rounded-md border p-3 pointer-events-auto"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha fin</label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateSelect(date, false)}
                disabled={(date) => date > new Date() || (startDate && date < startDate)}
                className="rounded-md border p-3 pointer-events-auto"
              />
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;