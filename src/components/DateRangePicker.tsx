import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
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

  const [range, setRange] = useState<DateRange | undefined>(
    startDate || endDate ? { from: startDate, to: endDate } : undefined
  );

  const handleRangeSelect = (r: DateRange | undefined) => {
    setRange(r);
    if (r?.from && r?.to) {
      onDateRangeChange(r.from, r.to);
      setIsOpen(false);
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
      return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    }
    return "Seleccionar período";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent
        className="w-[min(95vw,640px)] max-w-none p-2 sm:p-3 bg-background border shadow-lg"
        aria-label="Selector de período"
      >
        <div className="space-y-2">
          <div className="text-xs font-medium text-center">Período</div>
          
          <div className="grid grid-cols-2 gap-1.5">
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
              className="text-[10px] h-8 touch-manipulation px-2"
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
              className="text-[10px] h-8 touch-manipulation px-2"
            >
              Último mes
            </Button>
          </div>

          <div className="rounded-md border flex justify-center overflow-hidden">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              defaultMonth={range?.from || startDate || new Date()}
              className="pointer-events-auto p-1 [&_.rdp-months]:gap-2 [&_.rdp-month]:p-0 [&_.rdp-caption]:pb-1 [&_.rdp-table]:m-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangePicker;