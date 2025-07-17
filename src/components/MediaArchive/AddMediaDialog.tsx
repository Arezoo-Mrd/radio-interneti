"use client";

import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { usePutAssignBulkMediasToPlaylistMutation } from "@/app/(protected)/media-archive/api";
import { FilterOptionsType } from "@/app/(protected)/media-archive/api/api.types";
import {
    addMediasToPlaylistSchema,
    AddMediasToPlaylistSchemaType,
} from "@/schema/media.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AddMediaDialog({
    closeBtnRef,
    open,
    setOpen,
    playlists,
    musicId
}: {
    closeBtnRef: React.RefObject<HTMLButtonElement | null>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    playlists: FilterOptionsType["playlists"];
    musicId: number;
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] px-8 py-6">
                    <DialogTrigger ref={closeBtnRef}></DialogTrigger>
                    <DialogHeader className=" flex justify-start w-full text-right border-b! border-[#EDEDED] pb-4">
                        <DialogTitle>افزودن به پلی‌لیست</DialogTitle>
                        <DialogDescription>
                            پلی‌لیست مورد نظر خود را انتخاب کنید.
                        </DialogDescription>
                    </DialogHeader>
                    <MediaContainer ref={closeBtnRef} playlists={playlists} musicId={musicId} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger></DrawerTrigger>
            <DrawerContent className="text-right">
                <DrawerHeader className="text-left border-b! border-[#EDEDED] pb-4">
                    <DrawerTitle>افزودن به پلی‌لیست</DrawerTitle>
                    <DrawerDescription>
                        پلی‌لیست مورد نظر خود را انتخاب کنید.
                    </DrawerDescription>
                </DrawerHeader>
                <MediaContainer className="px-4" ref={closeBtnRef} playlists={playlists} musicId={musicId} />
                <DrawerFooter className="pt-2">
                    <DrawerClose ref={closeBtnRef}></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function MediaContainer({

    className,
    ref,
    playlists,
    musicId
}: {

    className?: string;
    ref: React.RefObject<HTMLButtonElement | null>;
    playlists: FilterOptionsType["playlists"];
    musicId: number;
}) {

    const { mutate: assignBulkMediasToPlaylist, isPending } = usePutAssignBulkMediasToPlaylistMutation();

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
                ref.current?.click();
            },
            onError: () => {
                toast.error("موزیک با موفقیت افزوده شد");
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
                    onClick={() => ref.current?.click()}
                    type="button"
                >
                    انصراف
                </Button>
            </div>
        </form>
    );
}
