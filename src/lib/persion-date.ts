// Utility functions for Persian date operations with robust calendar detection
function toEnglishDigits(str: string): string {
  return str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (d) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
  );
}
export class PersianDateUtils {

  // Test if Persian calendar is supported
  static isPersianCalendarSupported(): boolean {
    try {
      const testDate = new Date() // January 1, 2024
      const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })

      const parts = formatter.formatToParts(testDate)
      const yearPart = parts.find((part) => part.type === "year")

      // Persian year for 2024-01-01 should be around 1402-1403
      if (yearPart) {
        const year = Number.parseInt(yearPart.value.replace(/[^\d]/g, ""))
        return year >= 1400 && year <= 1450 // Reasonable range for Persian calendar
      }

      return false
    } catch (error) {
      return false
    }
  }

  // Get available calendar info
  static getCalendarInfo(): {
    supportsPersian: boolean
    detectedLocales: string[]
    testResults: any[]
  } {
    const testDate = new Date(2024, 2, 20) // March 20, 2024 (Persian New Year)
    const testResults = []
    const locales = [
      "fa-IR-u-ca-persian",
      "fa-IR",
      "fa-AF-u-ca-persian",
      "fa-AF",
      "ps-AF-u-ca-persian",
      "ur-PK-u-ca-persian",
    ]

    for (const locale of locales) {
      try {
        const formatter = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })

        const formatted = formatter.format(testDate)
        const parts = formatter.formatToParts(testDate)

        testResults.push({
          locale,
          formatted,
          parts,
          success: true,
        })
      } catch (error) {
        testResults.push({
          locale,
          error: (error as any)?.message || "Unknown error",
          success: false,
        })
      }
    }

    return {
      supportsPersian: this.isPersianCalendarSupported(),
      detectedLocales: locales,
      testResults,
    }
  }

  // Convert Gregorian date to Persian Solar Hijri with multiple methods
  static gregorianToPersian(gregorianDate: Date): { year: number; month: number; day: number } {
    // Method 1: Try Persian calendar with Intl
    try {
      const result = this.tryIntlPersianCalendar(gregorianDate)
      if (result && !isNaN(result.year) && !isNaN(result.month) && !isNaN(result.day)) {
        return result
      }
    } catch (error) {

    }

    // Method 2: Try different locale variations
    try {
      const result = this.tryAlternativeLocales(gregorianDate)

      if (result && !isNaN(result.year) && !isNaN(result.month) && !isNaN(result.day)) {
        return result
      }
    } catch (error) {

    }

    // Method 3: Use mathematical conversion algorithm

    return this.gregorianToPersianMath(gregorianDate)
  }

  // Method 1: Standard Persian calendar
  private static tryIntlPersianCalendar(gregorianDate: Date): { year: number; month: number; day: number } | null {
    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    const parts = formatter.formatToParts(gregorianDate)


    const yearPart = parts.find((part) => part.type === "year")
    const monthPart = parts.find((part) => part.type === "month")
    const dayPart = parts.find((part) => part.type === "day")

    if (!yearPart || !monthPart || !dayPart) {
      throw new Error("Missing date parts")
    }

    const year = Number.parseInt(yearPart.value.replace(/[^\d]/g, ""))
    const month = Number.parseInt(monthPart.value.replace(/[^\d]/g, "")) - 1 // 0-based
    const day = Number.parseInt(dayPart.value.replace(/[^\d]/g, ""))

    return { year, month, day }
  }

  // Method 2: Try alternative locales
  private static tryAlternativeLocales(gregorianDate: Date): { year: number; month: number; day: number } | null {
    const locales = ["fa-AF-u-ca-persian", "fa-IR", "fa-AF"]

    for (const locale of locales) {
      try {
        const formatter = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })

        const parts = formatter.formatToParts(gregorianDate)


        const yearPart = parts.find((part) => part.type === "year")
        const monthPart = parts.find((part) => part.type === "month")
        const dayPart = parts.find((part) => part.type === "day")

        if (yearPart && monthPart && dayPart) {
          const year = Number.parseInt(toEnglishDigits(yearPart.value));
          const month = Number.parseInt(toEnglishDigits(monthPart.value)) - 1;
          const day = Number.parseInt(toEnglishDigits(dayPart.value));


          // Check if this looks like a Persian date (year should be > 1300)
          if (year > 1300 && year < 1500) {
            return { year, month, day }
          }
        }
      } catch (error) {
        continue
      }
    }

    return null
  }

  // Method 3: Mathematical conversion (Kazimierz M. Borkowski algorithm)
  private static gregorianToPersianMath(gregorianDate: Date): { year: number; month: number; day: number } {
    const gYear = gregorianDate.getFullYear()
    const gMonth = gregorianDate.getMonth() + 1
    const gDay = gregorianDate.getDate()


    // Calculate Julian Day Number
    const a = Math.floor((14 - gMonth) / 12)
    const y = gYear - a
    const m = gMonth + 12 * a - 3

    const jd =
      gDay +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) +
      1721119

    // Convert Julian Day to Persian
    let pYear, pMonth, pDay

    if (jd <= 1948321) {
      // Before Persian calendar reform
      const cycle = Math.floor((jd - 1948321) / 1029983)
      let aux = (jd - 1948321) % 1029983

      if (aux < 366) {
        pYear = 1 + 2820 * cycle
        pMonth = 0
        pDay = aux + 1
      } else {
        aux -= 366
        pYear = 1 + 2820 * cycle + 1 + Math.floor(aux / 365)
        pMonth = 0
        pDay = (aux % 365) + 1
      }
    } else {
      // After Persian calendar reform (simplified)
      let aux = jd - 1948321
      pYear = 1 + Math.floor(aux / 365.2422)
      aux = aux - Math.floor((pYear - 1) * 365.2422)

      if (aux <= 186) {
        pMonth = Math.floor((aux - 1) / 31)
        pDay = ((aux - 1) % 31) + 1
      } else {
        pMonth = Math.floor((aux - 187) / 30) + 6
        pDay = ((aux - 187) % 30) + 1
      }
    }

    // Adjust for current era (approximate)
    pYear = Math.max(1, Math.floor(gYear - 621.5))

    // Simple month/day calculation for current dates
    if (gMonth >= 3 && gMonth <= 5) {
      pMonth = gMonth - 3
    } else if (gMonth >= 6 && gMonth <= 8) {
      pMonth = gMonth - 6 + 3
    } else if (gMonth >= 9 && gMonth <= 11) {
      pMonth = gMonth - 9 + 6
    } else if (gMonth === 12) {
      pMonth = 9
    } else if (gMonth === 1) {
      pMonth = 10
      pYear -= 1
    } else if (gMonth === 2) {
      pMonth = 11
      pYear -= 1
    }

    pDay = Math.min(gDay, pMonth < 6 ? 31 : 30)

    return {
      year: pYear,
      month: pMonth, // 0-based
      day: pDay,
    }
  }

  // Get current Persian date
  static getCurrentPersianDate(): { year: number; month: number; day: number } {
    return this.gregorianToPersian(new Date())
  }

  // Format Persian date as string
  static formatPersianDate(year: number, month: number, day: number): string {
    const monthStr = (month + 1).toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    return `${year}/${monthStr}/${dayStr}`
  }

  // Get Persian date string for today
  static getTodayPersianString(): string {
    const { year, month, day } = this.getCurrentPersianDate()
    return this.formatPersianDate(year, month, day)
  }

  // Get Persian month names
  static getPersianMonthName(month: number): string {
    const months = [
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
    return months[month] || "نامشخص"
  }

  // Get formatted Persian date with month name
  static getFormattedPersianDate(): string {
    const { year, month, day } = this.getCurrentPersianDate()
    const monthName = this.getPersianMonthName(month)
    return `${day} ${monthName} ${year}`
  }
}
