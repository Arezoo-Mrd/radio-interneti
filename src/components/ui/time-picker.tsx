"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "iconsax-react"


interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
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

export default function TimePicker({
  value = "",
  onChange = () => { },
  className = "",
  placeholder = "انتخاب زمان",
  error,
  disabled
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse current time
  const [hours, minutes] = value.trim() ? value.split(":").map(Number) : [0, 0]

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
    onChange(timeString)
  }

  const handleInputChange = (inputValue: string) => {
    const englishValue = toEnglishNumber(inputValue)
    onChange(englishValue)
  }

  const displayValue = value ? toPersianNumber(value) : ""

  // Generate time options
  const generateHours = () => Array.from({ length: 24 }, (_, i) => i)
  const generateMinutes = () => Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="w-full flex items-center justify-center ">
      <div className="w-full max-w-md">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                value={displayValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                className={`text-right pr-12 ${className} ${error ? 'border-red-500' : ''}`}
                dir="rtl"
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
              >
                <Clock variant="Bold" size={30} className="h-4 w-4 text-primary-main" color="#7367F0" />
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4">

              <div className="flex gap-4" dir="ltr">
                {/* Hours Column */}
                <div className="flex-1">
                  <div className="text-center text-sm font-medium mb-2 text-gray-600">
                    ساعت
                  </div>
                  <ScrollArea className="h-40 border rounded-md">
                    <div className="p-1">
                      {generateHours().map((hour) => (
                        <Button
                          key={hour}
                          variant={hours === hour ? "default" : "ghost"}
                          size="sm"
                          className={`w-full justify-center mb-1 ${hours === hour
                            ? "bg-primary-main text-white hover:bg-primary-main"
                            : "hover:bg-gray-100"
                            }`}
                          onClick={() => handleTimeChange(hour, minutes)}
                        >
                          {toPersianNumber(hour.toString().padStart(2, "0"))}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Minutes Column */}
                <div className="flex-1">
                  <div className="text-center text-sm font-medium mb-2 text-gray-600">
                    دقیقه
                  </div>
                  <ScrollArea className="h-40 border rounded-md">
                    <div className="p-1">
                      {generateMinutes().map((minute) => (
                        <Button
                          key={minute}
                          variant={minutes === minute ? "default" : "ghost"}
                          size="sm"
                          className={`w-full justify-center mb-1 ${minutes === minute
                            ? "bg-primary-main text-white hover:bg-primary-light"
                            : "hover:bg-gray-100"
                            }`}
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

            {/* Footer with Done button */}
            <div className="border-t p-3">
              <Button
                className="w-full bg-primary-main hover:bg-primary-light text-white"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                تمام
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {error && (
          <p className="text-sm text-red-500 mt-1 text-right" dir="rtl">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}