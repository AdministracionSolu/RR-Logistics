-- Create triggers to update truck data when toll events are inserted
CREATE TRIGGER update_truck_on_toll_event
    AFTER INSERT ON public.toll_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_truck_trail();

CREATE TRIGGER calculate_expenses_on_toll_event
    AFTER INSERT ON public.toll_events
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_daily_expenses();