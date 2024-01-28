"use client"

import * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// // import { DayPicker } from "react-day-picker"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/components/react-datepicker.scss"
import { ja } from "date-fns/locale"

// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

// export type CalendarProps = React.ComponentProps<typeof DatePicker>

function CalendarDate({
  className = "",
  classNames = "",
  showOutsideDays = true,
  ...props
}/* : CalendarProps */) {

  registerLocale('ja', ja);

  if (Number.isNaN(props.selected.getTime())) {
    props.selected = '';
  }

  return (
    <DatePicker
      showIcon
      dateFormat="yyyy/MM/dd"
      locale="ja"
      selected={props.selected}
      onChange={(date) => props.onSelect(props.selected, date)}
      placeholderText="日付を入力"
    />
  )
}
CalendarDate.displayName = "CalendarDate"

export { CalendarDate }
