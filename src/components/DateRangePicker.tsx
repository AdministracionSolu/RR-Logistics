import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
        className="w-[min(96vw,680px)] sm:w-auto sm:max-w-[680px] max-h-[85vh] overflow-auto overscroll-contain p-2 sm:p-3 bg-background border shadow-lg"
        aria-label="Selector de período"
      >
        <div className="space-y-1.5">
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
              numberOfMonths={isMobile ? 1 : 2}
              defaultMonth={range?.from || startDate || new Date()}
              className="pointer-events-auto p-1"
              classNames={{
                months: "flex flex-col sm:flex-row gap-2",
                month: "space-y-2",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-xs font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                row: "flex w-full mt-1",
                cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangePicker;