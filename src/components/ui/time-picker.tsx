"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "iconsax-react"

interface PersianTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

// Convert English numbers to Persian
const toPersianNumber = (num: number | string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  return num.toString().replace(/\d/g, (digit) => persianDigits[Number.parseInt(digit)])
}

// Convert Persian numbers to English
const toEnglishNumber = (persianNum: string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"
  return persianNum.replace(/[۰-۹]/g, (digit) => englishDigits[persianDigits.indexOf(digit)])
}

export function PersianTimePicker({ value, onChange, className, placeholder, error, disabled }: PersianTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse current time
  const [hours, minutes] = value.trim() ? (value?.split(":")).map(Number) : [0, 0]


  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours?.toString().padStart(2, "0")}:${newMinutes?.toString().padStart(2, "0")}`
    onChange(timeString)
  }

  const handleInputChange = (inputValue: string) => {
    const englishValue = toEnglishNumber(inputValue)
    onChange(englishValue)
  }

  const displayValue = toPersianNumber(value)

  // Generate time options
  const generateHours = () => Array.from({ length: 24 }, (_, i) => i)
  const generateMinutes = () => Array.from({ length: 60 }, (_, i) => i)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}

            placeholder={placeholder}
            className={`text-right pr-10 ${className}`}
            dir="rtl"
            error={error}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-2 top-6 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Clock color="#7367F0" size={30} variant="Bold" className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-4">
          <div className="text-center font-semibold mb-4">انتخاب زمان</div>
          <div dir="ltr" className="flex gap-2">
            {/* Hours */}
            <div className="flex-1">
              <div className="text-center text-sm font-medium mb-2">ساعت</div>
              <ScrollArea className="h-32 border rounded">
                <div className="p-1">
                  {generateHours().map((hour) => (
                    <Button
                      key={hour}
                      variant={hours === hour ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-center mb-1"
                      onClick={() => handleTimeChange(hour, minutes)}
                    >
                      {toPersianNumber(hour.toString().padStart(2, "0"))}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Minutes */}
            <div className="flex-1">
              <div className="text-center text-sm font-medium mb-2">دقیقه</div>
              <ScrollArea className="h-32 border rounded">
                <div className="p-1">
                  {generateMinutes().map((minute) => (
                    <Button
                      key={minute}
                      variant={minutes === minute ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-center mb-1"
                      onClick={() => handleTimeChange(hours, minute)}
                    >
                      {toPersianNumber(minute.toString().padStart(2, "0"))}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>


          </div>
        </div>
        <div className="flex p-2">
          <Button className="w-full" size="sm" onClick={() => setIsOpen(false)}>
            تمام
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
