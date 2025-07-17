"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PersianDateUtils } from "@/lib/persion-date"
import { Calendar } from "iconsax-react"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DateObject from "react-date-object"

interface PersianDatePickerProps {
  value: Date
  setValue: (value: Date) => void
  className?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}






export function PersianDatePicker({ value, setValue, className, placeholder = "تاریخ را انتخاب کنید", error, disabled }: PersianDatePickerProps) {
  const datePickerRef = useRef<any>(null)

  const localeDate = new DateObject({
    calendar: persian,
    locale: persian_fa,
    date: value,
  }).format("YYYY/MM/DD")


  return (
    <div className="w-full ">
      <DatePicker
        value={value}
        className="w-full "
        containerClassName="w-full"
        ref={datePickerRef}
        calendar={persian}
        locale={persian_fa}
        render={() => {
          return <div className="relative w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute left-2 top-6 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => datePickerRef.current?.openCalendar()}
            >
              <Calendar variant="Bold" size={30} className="h-4 w-4 text-primary-main" color="#7367F0" />
            </Button>
            <Input
              value={localeDate}
              onChange={(e) => setValue(new Date(e.target.value))}
              placeholder={placeholder}
              className={`text-right pr-10 ${className}`}
              dir="rtl"
              error={error}
              onFocus={() => datePickerRef.current?.openCalendar()}
              disabled={disabled}
            />

          </div>

        }}
        onChange={(date) => setValue((date?.toDate()?.toISOString() || new Date()) as Date)}
      />
    </div>
  )
}
