"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PersianTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
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

export function PersianTimePicker({ value, onChange, className }: PersianTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse current time
  const [hours, minutes, seconds] =value.trim() ? (value?.split(":")).map(Number) : [0,0, 0]
 
console.log({
    hours,
    minutes, seconds
})
  const handleTimeChange = (newHours: number, newMinutes: number, newSeconds: number) => {
    const timeString = `${newHours?.toString().padStart(2, "0")}:${newMinutes?.toString().padStart(2, "0")}:${newSeconds?.toString().padStart(2, "0")}`
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
  const generateSeconds = () => Array.from({ length: 60 }, (_, i) => i)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="زمان را انتخاب کنید"
            className={`text-right pr-10 ${className}`}
            dir="rtl"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Clock className="h-4 w-4 text-blue-500" />
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
                      onClick={() => handleTimeChange(hour, minutes, seconds)}
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
                      onClick={() => handleTimeChange(hours, minute, seconds)}
                    >
                      {toPersianNumber(minute.toString().padStart(2, "0"))}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Seconds */}
            <div className="flex-1">
              <div className="text-center text-sm font-medium mb-2">ثانیه</div>
              <ScrollArea className="h-32 border rounded">
                <div className="p-1">
                  {generateSeconds().map((second) => (
                    <Button
                      key={second}
                      variant={seconds === second ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-center mb-1"
                      onClick={() => handleTimeChange(hours, minutes, second)}
                    >
                      {toPersianNumber(second.toString().padStart(2, "0"))}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
