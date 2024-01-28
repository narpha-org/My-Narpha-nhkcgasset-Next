"use client"

import * as React from 'react';
import { DateTime } from 'luxon';
// import { Calendar as CalendarIcon } from 'lucide-react';

// import { Button } from '@/components/ui/button';
import { CalendarDateTime } from '@/components/ui/calendar-datetime';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { SelectSingleEventHandler } from 'react-day-picker';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
    DateTime.fromJSDate(date)
  );

  const handleSelect = (day, selected) => {
    const selectedDateTime = DateTime.fromJSDate(selected);

    setSelectedDateTime(selectedDateTime);
    setDate(selectedDateTime.toJSDate());
  };

  return (
    <div className="px-0 pt-0 pb-0">
      <CalendarDateTime
        mode="single"
        selected={selectedDateTime.toJSDate()}
        onSelect={handleSelect}
        initialFocus
      />
    </div>
  );
}
