"use client"

import * as React from 'react';
import { DateTime } from 'luxon';
// import { Calendar as CalendarIcon } from 'lucide-react';

// import { Button } from '@/components/ui/button';
import { CalendarDate } from '@/components/ui/calendar-date';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateTime>(
    DateTime.fromJSDate(date)
  );

  const handleSelect = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);

    setSelectedDate(selectedDay);
    setDate(selectedDay.toJSDate());
  };

  return (
    <CalendarDate
      mode="single"
      selected={selectedDate.toJSDate()}
      onSelect={handleSelect}
      initialFocus
    />
  );
}
