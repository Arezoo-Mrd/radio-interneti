"use client"

import { PersianDatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

import { Plus, Trash2 } from "lucide-react"
import { PersianTimePicker } from "@/components/ui/time-picker"

export function NewPlaylist() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      is_public: true,
      activate: true,
      presenter: [{ name: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "presenter",
  })

  const startDate = watch("start_date")
  const endDate = watch("end_date")
  const isPublic = watch("is_public")
  const activate = watch("activate")

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      console.log("Form data:", data)
      // Here you would typically send the data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      alert("رویداد با موفقیت ایجاد شد!")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("خطا در ایجاد رویداد")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-right" dir="rtl">
      اطلاعات پلی‌لیست
      </h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-right block" dir="rtl">
            عنوان پلی‌لیست
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="عنوان موردنظر خود را وارد کنید."
              className="text-right"
              dir="rtl"
            />
            {/* {errors.title && <p className="text-sm text-red-500 text-right">{errors.title.message}</p>} */}
          </div>

         

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-right block" dir="rtl">
              زمان شروع پلی‌لیست
              </label>
              <PersianDatePicker
                value={startDate || ""}
                onChange={(value) => setValue("start_date", value)}
                placeholder="تاریخ شروع را انتخاب کنید"
              />
                <PersianTimePicker
                    value={endDate || ""}
                    onChange={(value) => setValue("end_date", value)}
                   
                />
              {/* {errors.start_date && <p className="text-sm text-red-500 text-right">{errors.start_date.message}</p>} */}
            </div>


          </div>

       
        </form>
      </div>
    </div>
  )
}
