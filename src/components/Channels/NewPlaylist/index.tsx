"use client"

import AddNewMusic from "@/components/MediaArchive/AddMedia/Add"
import { PersianDatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { PersianTimePicker } from "@/components/ui/time-picker"
import { useMultiAudio } from "@/hooks/use-multi-audio"
import { createPlaylistSchema, CreatePlaylistSchemaType } from "@/schema/playlist.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Header from "./Header"

export function NewPlaylist() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { audioFiles, audioStates, addAudioFile, removeAudioFile } =
  useMultiAudio();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
  
    Array.from(files).forEach((file) => {
     if (file.type.startsWith("audio/")) {
      addAudioFile(file);
     } else {
      toast.warning("فرمت فایل صحیح نمی‌باشد.");
     }
    });
  
    // Reset input
    if (fileInputRef.current) {
     fileInputRef.current.value = "";
    }
   };
  

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreatePlaylistSchemaType>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      active: true,
    },
  })



  const startDate = watch("start_date")
  const startTime = watch("start_time")
  const endDate = watch("end_date")
  const endTime = watch("end_time")



  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      console.log("Form data:", data)
      // Here you would typically send the data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("پلی‌لیست با موفقیت ایجاد شد!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("خطا در ایجاد پلی‌لیست")
    } finally {
      setIsSubmitting(false)
    }
  }

  

  return (
    <div className="w-full p-6">
      <Header
      disabled={isSubmitting}
      saveChanges={() => onSubmit({})}
      isEditMode={false}
      />
     <div className="w-full  p-4 pb-11 rounded-xl border border-[#F6F6F6] bg-[#FAFAFA]">
      <h1 className="text-[15px] font-PeydaMedium pb-6 text-right" dir="rtl">
      اطلاعات پلی‌لیست
      </h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-right block text-[14px] f" dir="rtl">
            عنوان پلی‌لیست
            </label>
            <Input
              id="title"
              {...register("name")}
              placeholder="عنوان موردنظر خود را وارد کنید."
              className="text-right"
              dir="rtl"
            />
            {/* {errors.title && <p className="text-sm text-red-500 text-right">{errors.title.message}</p>} */}
          </div>

         

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <label className="text-right block" dir="rtl">
              زمان شروع پلی‌لیست
              </label>
             <div className="flex gap-2">
             <PersianDatePicker
                value={startDate || ""}
                onChange={(value) => setValue("start_date", value)}
                placeholder="تاریخ موردنظر خود را انتخاب کنید."
              />
                <PersianTimePicker
                    value={startTime || ""}
                    onChange={(value) => setValue("start_time", value)}
                    placeholder="زمان موردنظر خود را انتخاب کنید."
                   
                />
             </div>
             
            </div>
            <div className="space-y-2">
              <label className="text-right block" dir="rtl">
              زمان پایان پلی‌لیست
              </label>
             <div className="flex gap-2">
             <PersianDatePicker
                value={endDate || ""}
                onChange={(value) => setValue("end_date", value)}
                placeholder="تاریخ موردنظر خود را انتخاب کنید."
              />
             <PersianTimePicker
                    value={endTime || ""}
                    onChange={(value) => setValue("end_time", value)}
                    placeholder="زمان موردنظر خود را انتخاب کنید."
                   
                />
             </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <AddNewMusic
    className="w-full"
     audioFiles={audioFiles}
     audioStates={audioStates}
     handleFileUpload={handleFileUpload}
     removeAudioFile={removeAudioFile}
     fileInputRef={fileInputRef}
     wrapperClassName="pt-6"
    />
    </div>
   
  )
}
