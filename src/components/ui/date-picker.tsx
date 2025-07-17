"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PersianDateUtils } from "@/lib/persion-date"
import { Calendar } from "iconsax-react"

interface PersianDatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

// Persian month names
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

// Persian day names (starting from Saturday)
const persianDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

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

// Solar Hijri calendar utilities
class PersianCalendar {
  // Check if a Persian year is leap year
  static isLeapYear(year: number): boolean {
    const breaks = [
      -14, 3, 13, 84, 111, 138, 165, 192, 219, 246, 273, 300, 327, 354, 381, 408, 435, 462, 489, 516, 543, 570, 597,
      624, 651, 678, 705, 732, 759, 786, 813, 840, 867, 894, 921, 948, 975, 1002, 1029, 1056, 1083, 1110, 1137, 1164,
      1191, 1218, 1245, 1272, 1299, 1326, 1353, 1380, 1407, 1434, 1461, 1488, 1515, 1542, 1569, 1596, 1623, 1650,
    ]

    let jp = breaks[0]
    let jump = 0
    for (let j = 1; j <= breaks.length; j++) {
      const jm = breaks[j]
      jump = jm - jp
      if (year < jm) break
      jp = jm
    }

    const n = year - jp
    if (n < jump) {
      if (n < jump - 1) {
        return (
          n % 33 === 1 ||
          n % 33 === 5 ||
          n % 33 === 9 ||
          n % 33 === 13 ||
          n % 33 === 17 ||
          n % 33 === 22 ||
          n % 33 === 26 ||
          n % 33 === 30
        )
      } else {
        return jump === 33 && n === 32
      }
    }
    return false
  }

  // Get number of days in a Persian month
  static getDaysInMonth(year: number, month: number): number {
    if (month < 6) return 31 // First 6 months
    if (month < 11) return 30 // Next 5 months
    return this.isLeapYear(year) ? 30 : 29 // Last month
  }

  // Convert Persian date to Julian Day Number
  static persianToJulian(year: number, month: number, day: number): number {
    const epbase = year - 979
    const epyear = epbase >= 0 ? epbase : epbase - 33
    const aux2 = epyear % 128


    let julday = 365 * year + Math.floor(epyear / 33) * 8 + Math.floor((aux2 + 3) / 4)

    if (aux2 % 4 === 0 && aux2 !== 0) {
      julday += 1
    }

    for (let i = 0; i < month; i++) {
      julday += this.getDaysInMonth(year, i)
    }

    return julday + day + 1948321
  }

  // Get day of week for a Persian date (0 = Saturday, 6 = Friday)
  static getDayOfWeek(year: number, month: number, day: number): number {
    const julian = this.persianToJulian(year, month, day)
    return (julian + 2) % 7
  }

  // Get first day of week for a Persian month
  static getFirstDayOfMonth(year: number, month: number): number {
    return this.getDayOfWeek(year, month, 1)
  }
}



export function PersianDatePicker({ value, onChange, className, placeholder = "تاریخ را انتخاب کنید", error, disabled }: PersianDatePickerProps) {
  const currentPersianDate = PersianDateUtils.getCurrentPersianDate()


  const [isOpen, setIsOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(currentPersianDate.year)
  const [currentMonth, setCurrentMonth] = useState(currentPersianDate.month)
  const [view, setView] = useState<"calendar" | "months" | "years">("calendar")
  const [selectedDay, setSelectedDay] = useState<number | null>(currentPersianDate.day)


  // Initialize current date

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const daysInMonth = PersianCalendar.getDaysInMonth(currentYear, currentMonth)
    const firstDayOfWeek = PersianCalendar.getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for proper alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Generate years for year selection
  const generateYears = () => {
    const years = []
    const startYear = currentYear - 6
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i)
    }
    return years
  }

  const handleDateSelect = (day: number) => {
    setSelectedDay(day)
    const month = (currentMonth + 1).toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    const newDate = `${currentYear}/${month}/${dayStr}`
    onChange(newDate)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex)
    setView("calendar")
  }

  const handleYearSelect = (year: number) => {
    setCurrentYear(year)
    setView("calendar")
  }

  const handleDone = () => {
    setIsOpen(false)
  }

  const handleInputChange = (inputValue: string) => {
    const englishValue = toEnglishNumber(inputValue)
    onChange(englishValue)
  }

  const handleMonthNavigation = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
  }

  const displayValue = toPersianNumber(value)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-2 top-6 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Calendar variant="Bold" size={30} className="h-4 w-4 text-primary-main" color="#7367F0" />
          </Button>
          <Input
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className={`text-right pr-10 ${className}`}
            dir="rtl"
            error={error}
            disabled={disabled}
          />

        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          {view === "calendar" && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">


                <div className="text-center flex items-center gap-0">
                  <Button
                    variant="ghost"
                    className="font-semibold text-sm px-1 hover:bg-gray-100"
                    onClick={() => setView("months")}
                  >
                    {persianMonths[currentMonth]}
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-semibold text-sm px-1 hover:bg-gray-100"
                    onClick={() => setView("years")}
                  >
                    {toPersianNumber(currentYear)}
                  </Button>
                </div>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(currentMonth < 11 ? currentMonth + 1 : 0)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(currentMonth > 0 ? currentMonth - 1 : 11)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>


              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {persianDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {generateCalendarDays().map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <Button
                        variant={selectedDay === day ? "default" : "ghost"}
                        size="sm"
                        className={`w-full h-full text-sm ${selectedDay === day
                          ? "bg-primary-button hover:bg-primary-main2 text-white rounded-lg"
                          : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleDateSelect(day)}
                      >
                        {toPersianNumber(day)}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Done button */}
              <div className="flex justify-end">
                <Button onClick={handleDone} className="bg-primary-button hover:bg-primary-main2 text-white px-6">
                  تمام
                </Button>
              </div>
            </>
          )}

          {view === "months" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => setView("calendar")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-semibold text-lg">انتخاب ماه</div>
                <div className="w-8"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {persianMonths.map((month, index) => (
                  <Button
                    key={month}
                    variant={currentMonth === index ? "default" : "ghost"}
                    className={`p-3 text-sm ${currentMonth === index ? "bg-primary-button hover:bg-primary-main2 text-white" : "hover:bg-gray-100"
                      }`}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="ghost" onClick={() => setView("calendar")}>
                  بازگشت به تقویم
                </Button>
              </div>
            </>
          )}

          {view === "years" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentYear(currentYear - 12)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="font-semibold text-lg">انتخاب سال</div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentYear(currentYear + 12)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {generateYears().map((year) => (
                  <Button
                    key={year}
                    variant={currentYear === year ? "default" : "ghost"}
                    className={`p-3 text-sm ${currentYear === year ? "bg-primary-button hover:bg-primary-main2 text-white" : "hover:bg-gray-100"
                      }`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {toPersianNumber(year)}
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="ghost" onClick={() => setView("calendar")}>
                  بازگشت به تقویم
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
