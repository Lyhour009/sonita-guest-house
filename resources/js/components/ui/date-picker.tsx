import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    name?: string;
    id?: string;
    minDate?: string;
    maxDate?: string;
    className?: string;
    required?: boolean;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    portaled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    disabled = false,
    name,
    id,
    minDate,
    maxDate,
    className,
    required = false,
    align = 'start',
    side = 'bottom',
    sideOffset = 6,
    portaled = true,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse date safely from YYYY-MM-DD string
    const selectedDate = React.useMemo(() => {
        if (!value) return undefined;
        try {
            return typeof value === 'string' ? parseISO(value) : value;
        } catch {
            return undefined;
        }
    }, [value]);

    const min = React.useMemo(
        () => (minDate ? parseISO(minDate) : undefined),
        [minDate],
    );
    const max = React.useMemo(
        () => (maxDate ? parseISO(maxDate) : undefined),
        [maxDate],
    );

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            const formatted = format(date, 'yyyy-MM-dd');
            onChange?.(formatted);
        } else {
            onChange?.('');
        }
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.('');
    };

    const handleToday = () => {
        const today = new Date();
        const formatted = format(today, 'yyyy-MM-dd');
        onChange?.(formatted);
        setOpen(false);
    };

    return (
        <div className={cn('relative inline-block w-full', className)}>
            {/* Hidden Input for Standard Form Submissions */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    id={id}
                    value={value || ''}
                    required={required}
                />
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            'h-10 w-full justify-between rounded-xl border-border bg-background px-3.5 text-left text-sm font-normal font-sans shadow-2xs transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary/20',
                            !selectedDate && 'text-muted-foreground',
                        )}
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                                {selectedDate
                                    ? format(selectedDate, 'PPP')
                                    : placeholder}
                            </span>
                        </div>

                        {selectedDate && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="ml-1.5 size-4 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align={align}
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={true}
                    portaled={portaled}
                    className="w-72 p-3 rounded-2xl shadow-xl border-border z-[100] bg-popover"
                >
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        disabled={(date: Date) => {
                            if (min && date < min) return true;
                            if (max && date > max) return true;
                            return false;
                        }}
                    />
                    <div className="flex items-center justify-between border-t border-border/60 pt-2.5 mt-1 px-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onChange?.('');
                                setOpen(false);
                            }}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleToday}
                            className="h-7 text-xs font-semibold"
                        >
                            Today
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DatePicker;
