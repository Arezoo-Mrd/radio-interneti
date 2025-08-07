"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { usePutAssignBulkMediasToPlaylistMutation } from "@/app/(protected)/media-archive/api";
import { FilterOptionsType } from "@/app/(protected)/media-archive/api/api.types";
import { Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

import { useError } from "@/hooks/use-error";

export function AddMediaDialog({
    playlists,
    musicId,
    closeBtnRef,
    className
}: {
    closeBtnRef: React.RefObject<HTMLButtonElement | null>;
    playlists: FilterOptionsType["playlists"];
    musicId: number;
    className?: string;
}) {


    const { mutate: assignBulkMediasToPlaylist, isPending } = usePutAssignBulkMediasToPlaylistMutation();
    const { errorHandler } = useError()
    const {
        handleSubmit,
        control,
    } = useForm<{
        playlistId: number;
    }>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "playlistId" as never,
    });


    const addMusic = (playlistId: number) => {
        append({ playlistId });
    };


    const onSubmit = (data: any) => {
        if (data.playlistId.length === 0) {
            toast.error("لطفا پلی لیست مورد نظر خود را انتخاب کنید");
            return;
        }
        const assign = (fields as unknown as {
            playlistId: number;
            id: number;
        }[]).map((field) => ({
            music_id: musicId,
            playlist_id: field?.playlistId,
        }));



        assignBulkMediasToPlaylist({
            assign
        }, {
            onSuccess: () => {
                toast.success("موزیک با موفقیت افزوده شد");
                closeBtnRef.current?.click();
            },
            onError: (error) => {
                errorHandler(error)

            },
        });
    };



    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("grid items-start gap-6", className)}
        >
            <div className="flex flex-col gap-1">
                {playlists
                    .map((playlist) => {
                        return (
                            <div
                                className="flex items-center w-full min-h-12 justify-between"
                                key={playlist.id}
                            >
                                <span className="text-[15px] font-PeydaMedium">{playlist.name}</span>
                                <Checkbox
                                    onClick={() => {
                                        if (fields.some((field) => field.id === playlist.id)) {
                                            remove(fields.findIndex((field) => field.id === playlist.id));
                                        } else {
                                            addMusic(playlist.id as number);
                                        }
                                    }}
                                    id={playlist.id.toString()}
                                    value={playlist.id}
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
                    onClick={() => closeBtnRef.current?.click()}
                    type="button"
                >
                    انصراف
                </Button>
            </div>
        </form>
    );



}
