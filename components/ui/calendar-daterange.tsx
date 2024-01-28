"use client"

import * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// // import { DayPicker } from "react-day-picker"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/components/react-datepicker.scss"
import { ja } from "date-fns/locale"
import { UseFormReturn } from "react-hook-form"

// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

interface CalendarDateRangeProps {
  date: Date | null;
  setDate: (date: Date) => void;
  section: "selectsStart" | "selectsEnd";
  startDate: Date;
  endDate: Date;
}

function CalendarDateRange({
  date,
  setDate,
  section,
  startDate,
  endDate
}: CalendarDateRangeProps) {

  registerLocale('ja', ja);

  if (!date || Number.isNaN(date.getTime())) {
    date = null;
  }

  switch (section) {
    case "selectsStart":
      return (
        <DatePicker
          showIcon
          dateFormat="yyyy/MM/dd"
          locale="ja"
          selected={date}
          onChange={(value) => { if (value) { setDate(value) } }}
          placeholderText="日付を入力"
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
      )

    case "selectsEnd":
      return (
        <DatePicker
          showIcon
          dateFormat="yyyy/MM/dd"
          locale="ja"
          selected={date}
          onChange={(value) => { if (value) { setDate(value) } }}
          placeholderText="日付を入力"
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      )

    default:
      break;
  }


  return "INVALID"
}
CalendarDateRange.displayName = "CalendarDateRange"

export { CalendarDateRange }
