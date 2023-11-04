"use client"

import * as React from 'react';
import { DateTime } from 'luxon';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateTime>(
    DateTime.fromJSDate(date)
  );

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);

    setSelectedDate(selectedDay);
    setDate(selectedDay.toJSDate());
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="z-10">
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal w-full',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            selectedDate.toFormat('DDD')
          ) : (
            <span>日付を選択</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate.toJSDate()}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
