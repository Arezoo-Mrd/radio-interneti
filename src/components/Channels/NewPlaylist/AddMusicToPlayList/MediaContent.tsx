import { useAddMediasToPlaylistMutation, useGetAllMusicQuery } from "@/app/(protected)/media-archive/api";
import { MediaArchiveType, MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ClockFading, Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const MediaContent = ({ ref, playlistId }: { ref: React.RefObject<HTMLButtonElement | null>, playlistId: string | undefined }) => {
    const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)
    const {
        handleSubmit,
        control,
    } = useForm<{
        musicId: number;
    }>();


    const { isPending, mutate: addMediasToPlaylist } = useAddMediasToPlaylistMutation()
    const { data: musics, isLoading } = useGetAllMusicQuery({}, true)

    const { fields, append, remove } = useFieldArray({
        control,
        name: "musicId" as never,
    });

    const addMusic = (musicId: number) => {
        append({ musicId });
    };


    const onSubmit = (data: any) => {
        if (data.musicId.length === 0) {
            toast.error("لطفا موزیک مورد نظر خود را انتخاب کنید");
            return;
        }

        const musics = data.musicId.map((musicId: { musicId: number }) => {
            return {
                music_id: musicId.musicId,

            }
        })

        addMediasToPlaylist({
            playlist_id: Number(playlistId),
            musics,
        }, {
            onSuccess: () => {
                ref.current?.click()
                toast.success("موزیک با موفقیت افزوده شد");
                setAddPlaylistState({
                    showChangePosition: true,
                    musics,
                })
            },
        });


    };

    return (
        isLoading ? <div className="flex items-center justify-center h-full">
            <Loader2 className="w-11 h-11 text-primary-main animate-spin" />
        </div> :
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={("grid items-start gap-6")}
            >
                <div className="flex flex-col gap-1">
                    {musics?.data
                        .map((music) => {
                            return (
                                <div
                                    className="flex items-center w-full min-h-12 justify-between"
                                    key={music.id}
                                >
                                    <span className="text-[15px] font-PeydaMedium">{music.title}</span>
                                    <Checkbox
                                        onClick={() => {
                                            if (fields.some((field: any) => field?.musicId! === music.id)) {
                                                remove(fields.findIndex((field: any) => field.musicId! === music.id));
                                            } else {
                                                addMusic(music.id as number);
                                            }
                                        }}
                                        id={music.id.toString()}
                                        value={music.id.toString()}
                                    />
                                </div>
                            )
                        })}

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
    );

}

export default MediaContent