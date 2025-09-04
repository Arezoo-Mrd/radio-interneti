import { useAddMediasToPlaylistMutation, useGetAllMusicQuery } from "@/app/(protected)/media-archive/api";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";


const MediaContent = ({ ref, playlistId }: { ref: React.RefObject<HTMLButtonElement | null>, playlistId: number }) => {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");


    const queryClient = useQueryClient()


    const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)
    const [selectedMusics, setSelectedMusics] = useState<any[]>(addPlaylistState.musics)




    const {
        handleSubmit,
        control,
    } = useForm<{
        musicId: number;
    }>();


    const [page, setPage] = useState(1)




    const { isPending, mutate: addMediasToPlaylist } = useAddMediasToPlaylistMutation()
    const { data: allMusics, isLoading } = useGetAllMusicQuery({ page, per_page: 100, title: search }, true)


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);

        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);






    const onSubmit = () => {
        if (selectedMusics.length === 0) {
            toast.error("لطفا موزیک مورد نظر خود را انتخاب کنید");
            return;
        }

        const musics = selectedMusics.map((music: any) => {
            return {
                music_id: music.id as number,
            }
        })


        addMediasToPlaylist({
            playlist_id: Number(playlistId),
            musics,
        }, {
            onSuccess: () => {
                ref.current?.click()
                queryClient.invalidateQueries({ queryKey: ["single-music"] })
                toast.success("موزیک با موفقیت افزوده شد");
                setAddPlaylistState({
                    showChangePosition: true,
                    musics: selectedMusics || [],
                    playListId: playlistId,
                    start_date: addPlaylistState.start_date,
                    start_time: addPlaylistState.start_time,
                    end_date: addPlaylistState.end_date,
                    end_time: addPlaylistState.end_time,
                })
            },
        });


    };



    const addOrRemoveMusic = (music: MusicType) => {

        const currentMusics = selectedMusics
        if (currentMusics.find((item: any) => item.id === music.id)) {
            const newMusics = currentMusics.filter((item: any) => item.id !== music.id)
            setSelectedMusics(newMusics)

        } else {
            const newMusics = [...currentMusics, { ...music, position: currentMusics.length + 1 }]
            setSelectedMusics(newMusics)
        }
    }







    return (
        isLoading ? <div className="flex items-center justify-center h-full" >
            <Loader2 className="w-11 h-11 text-primary-main animate-spin" />
        </div > :
            <div>
                <Input
                    placeholder="جستجو."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="w-full pr-10 h-10 shadow-none"
                />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={("grid items-start gap-6")}
                >
                    <div className="flex flex-col gap-1 "  >
                        {allMusics?.data?.length ? allMusics.data
                            .map((music: MusicType) => {
                                return (
                                    <div
                                        className="flex items-center w-full min-h-12 justify-between"
                                        key={music.id}
                                    >
                                        <span className="text-[15px] font-PeydaMedium">{music.title}</span>
                                        <Checkbox
                                            onClick={() => {
                                                addOrRemoveMusic(music)
                                            }}

                                            defaultChecked={addPlaylistState.musics.some((field: any) => field?.id! === music.id)}
                                            id={music.id.toString()}
                                            value={music.id.toString()}
                                        />
                                    </div>
                                )
                            }) : <div className="flex items-center justify-center h-full">
                            <p className="text-[15px] font-PeydaMedium">موزیکی یافت نشد</p>
                        </div>}

                    </div>


                    <div className="flex gap-2 w-full  items-center justify-between">
                        <Button disabled={isPending} className="bg-primary-button w-1/2" type="submit">
                            {isPending ? <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div> : "افزودن"}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-1/2"
                            onClick={() => ref.current?.click()}
                            type="button"
                        >
                            انصراف
                        </Button>
                    </div>
                </form>
            </div>
    );

}

export default MediaContent