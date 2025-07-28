"use client"

import { PlaylistResponseType } from "@/app/(protected)/channels/[slug]/api/api.types"
import { useStorePlaylistMutation, useUpdatePlaylistMutation } from "@/app/(protected)/channels/[slug]/new-playlist/api"
import { Button } from "@/components/ui/button"
import { PersianDatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import TimePicker from "@/components/ui/time-picker"
import { createPlaylistSchema, CreatePlaylistSchemaType } from "@/schema/playlist.schema"
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { Loader2 } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import AddMusicToPlayList from "./AddMusicToPlayList"
import Header from "./Header"
import PlaylistManager from "./PlayListManager"
import { toast } from "sonner"

export function NewPlaylist({ playlist: initialPlaylistData }: { playlist: PlaylistResponseType[0] | null | undefined }) {
  const { slug } = useParams()
  const { mutate: storePlaylist, isPending: isPendingStorePlaylist } = useStorePlaylistMutation()
  const { mutate: updatePlaylist, isPending: isPendingUpdatePlaylist } = useUpdatePlaylistMutation()
  const [playlistData, setPlaylistData] = useState<{ name: string, id: number } | null>(null)

  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "true"




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
      name: initialPlaylistData?.name || "",
      description: initialPlaylistData?.description || "",
      start_date: initialPlaylistData?.start_date || new Date(),
      end_date: initialPlaylistData?.end_date || new Date(),
      start_time: initialPlaylistData?.start_time || "",
      end_time: initialPlaylistData?.end_time || "",
      activate: initialPlaylistData?.activate || true,
    },
  })



  const startDate = watch("start_date")
  const startTime = watch("start_time")
  const endDate = watch("end_date")
  const endTime = watch("end_time")






  const storePlaylistHandler = (data: CreatePlaylistSchemaType) => {
    if (initialPlaylistData) {
      updatePlaylist({
        id: initialPlaylistData.id.toString(),
        data: {
          ...data,
          channel_playlist: Number(slug),
        },
      }, {
        onSuccess: (data) => {
          data && setPlaylistData({
            name: data.data.name,
            id: data.data.id,
          })
          toast.success("پلی‌لیست با موفقیت به روز شد");
        },
        onError(error) {
          toast.error(error.message);
        },
      })
    } else
      storePlaylist({
        ...data,
        channel_playlist: Number(slug),
      }, {
        onSuccess: (data) => {
          data && setPlaylistData({
            name: data.data.name,
            id: data.data.id,
          })

        }
      })
  }
  const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)

  useEffect(() => {
    return () => {
      setAddPlaylistState((prev) => ({
        ...prev,
        showChangePosition: false,
        musics: [],
        playListId: -1
      }))
    }
  }, [setAddPlaylistState])


  return (
    <div className="w-full p-6">
      <Header
        isEdit={isEdit}
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
                    disabled={!!playlistData?.name}
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
                        disabled={!!playlistData?.name}
                        value={startDate}
                        setValue={(value) => setValue("start_date", value)}
                        placeholder="تاریخ موردنظر خود را انتخاب کنید."

                      />
                      <TimePicker
                        disabled={!!playlistData?.name}
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

                        disabled={!!playlistData?.name}
                      />
                      <TimePicker
                        value={endTime}
                        onChange={(value) => setValue("end_time", value)}
                        placeholder="زمان موردنظر خود را انتخاب کنید."
                        error={errors.end_time?.message}
                        disabled={!!playlistData?.name}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size={"lg"}
                  disabled={isPendingStorePlaylist || !!playlistData?.name}
                  className={`h-11 w-[200px] ${isPendingStorePlaylist ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
                    }`}
                >
                  {isPendingStorePlaylist ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره و اضافه"}
                </Button>

              </form>
            </div>
          </div>
          {playlistData?.name && <AddMusicToPlayList playlistName={playlistData.name} playlistId={playlistData.id} />}
        </>
      }

    </div>

  )
}
