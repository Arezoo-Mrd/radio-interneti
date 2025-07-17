"use client"

import { useStorePlaylistMutation } from "@/app/(protected)/channels/[slug]/new-playlist/api"
import { Button } from "@/components/ui/button"
import { PersianDatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { PersianTimePicker } from "@/components/ui/time-picker"
import { createPlaylistSchema, CreatePlaylistSchemaType } from "@/schema/playlist.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import AddMusicToPlayList from "./AddMusicToPlayList"
import Header from "./Header"
import { useState } from "react"
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist"
import { useAtom } from "jotai"
import PlaylistManager from "./PlayListManager"

export function NewPlaylist() {
  const { slug } = useParams()
  const { mutate: storePlaylist, isPending: isPendingStorePlaylist } = useStorePlaylistMutation()
  const [playlistName, setPlaylistName] = useState<string | null>(null)


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
      start_date: new Date(),
      end_date: new Date(),
      start_time: "",
      end_time: "",
      activate: true,
    },
  })



  const startDate = watch("start_date")
  const startTime = watch("start_time")
  const endDate = watch("end_date")
  const endTime = watch("end_time")




  const storePlaylistHandler = (data: CreatePlaylistSchemaType) => {

    storePlaylist({
      ...data,
      channel_playlist: Number(slug),
    }, {
      onSuccess: (data) => {
        data && setPlaylistName(data.data.name)
      }
    })
  }
  const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)


  return (
    <div className="w-full p-6">
      <Header
      />
      {addPlaylistState.showChangePosition ? <PlaylistManager /> :
        <>
          <div className="w-full  p-4 pb-11 rounded-xl border border-[#F6F6F6] bg-[#FAFAFA]">
            <h1 className="text-[15px] font-PeydaMedium pb-6 text-right" dir="rtl">
              اطلاعات پلی‌لیست
            </h1>
            <div>
              <form onSubmit={handleSubmit(storePlaylistHandler)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-right block text-[14px] f" dir="rtl">
                    عنوان پلی‌لیست
                  </label>
                  <Input
                    id="title"
                    disabled={!!playlistName}
                    {...register("name")}
                    placeholder="عنوان موردنظر خود را وارد کنید."
                    className="text-right"
                    dir="rtl"
                    error={errors.name?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <label className="text-right block" dir="rtl">
                      زمان شروع پلی‌لیست
                    </label>
                    <div className="flex gap-2">
                      <PersianDatePicker
                        disabled={!!playlistName}
                        value={startDate}
                        setValue={(value) => setValue("start_date", value)}
                        placeholder="تاریخ موردنظر خود را انتخاب کنید."

                      />
                      <PersianTimePicker
                        disabled={!!playlistName}
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
                        value={endDate}
                        setValue={(value) => setValue("end_date", value)}
                        placeholder="تاریخ موردنظر خود را انتخاب کنید."

                        disabled={!!playlistName}
                      />
                      <PersianTimePicker
                        value={endTime}
                        onChange={(value) => setValue("end_time", value)}
                        placeholder="زمان موردنظر خود را انتخاب کنید."
                        error={errors.end_time?.message}
                        disabled={!!playlistName}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size={"lg"}
                  disabled={isPendingStorePlaylist || !!playlistName}
                  className={`h-11 w-[200px] ${isPendingStorePlaylist ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
                    }`}
                >
                  {isPendingStorePlaylist ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره و اضافه"}
                </Button>

              </form>
            </div>
          </div>
          {playlistName && <AddMusicToPlayList playlistName={playlistName} />}
        </>
      }

    </div>

  )
}
