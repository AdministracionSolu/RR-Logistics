import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const [selectingStart, setSelectingStart] = useState(true);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectingStart) {
      // Seleccionó fecha inicial, ahora pedir la final
      onDateRangeChange(date, endDate);
      setSelectingStart(false);
    } else {
      // Seleccionó fecha final, cerrar
      onDateRangeChange(startDate, date);
      setIsOpen(false);
      setSelectingStart(true); // Reset para próxima vez
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSelectingStart(true); // Siempre empezar con fecha inicial
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
        className="w-auto max-w-[min(95vw,380px)] p-3 bg-background border shadow-lg"
        aria-label="Selector de período"
      >
        <DialogTitle className="text-sm font-semibold text-center mb-2">
          {selectingStart ? 'Fecha inicial' : 'Fecha final'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {selectingStart ? 'Selecciona la fecha de inicio' : 'Selecciona la fecha final'}
        </DialogDescription>
        
        <div>
          <Calendar
            mode="single"
            selected={selectingStart ? startDate : endDate}
            onSelect={handleDateSelect}
            defaultMonth={selectingStart ? (startDate || new Date()) : (endDate || startDate || new Date())}
            disabled={selectingStart ? undefined : (date) => startDate ? date < startDate : false}
            className="pointer-events-auto rounded-md border"
            classNames={{
              months: "flex",
              month: "space-y-2 p-2",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-xs",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangePicker;