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
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col space-y-2 p-3">
          <div className="text-sm font-medium">Período de simulación</div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Fecha inicio</label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateSelect(date, true)}
                disabled={(date) => date > new Date() || (endDate && date > endDate)}
                initialFocus
                className="rounded-md border"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground">Fecha fin</label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateSelect(date, false)}
                disabled={(date) => date > new Date() || (startDate && date < startDate)}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                onDateRangeChange(weekAgo, today);
              }}
              className="text-xs"
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
              }}
              className="text-xs"
            >
              Último mes
            </Button>
          </div>
          
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-xs"
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;