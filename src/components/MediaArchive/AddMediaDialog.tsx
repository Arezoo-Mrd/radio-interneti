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

import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "../ui/checkbox";
import { Drawer, DrawerClose } from "../ui/drawer";
import { DialogTrigger } from "../ui/dialog";
import { DrawerTrigger } from "../ui/drawer";
import { Dialog } from "../ui/dialog";
import { DrawerContent } from "../ui/drawer";
import { DrawerHeader } from "../ui/drawer";
import { DrawerTitle } from "../ui/drawer";
import { DrawerDescription } from "../ui/drawer";
import { DrawerFooter } from "../ui/drawer";
import { FilterOptionsType } from "@/app/(protected)/media-archive/api/api.types";
import { useAddMediasToPlaylistMutation } from "@/app/(protected)/media-archive/api";
import { useFieldArray, useForm } from "react-hook-form";
import {
 addMediasToPlaylistSchema,
 AddMediasToPlaylistSchemaType,
} from "@/schema/media.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function AddMediaDialog({
 closeBtnRef,
 open,
 setOpen,
 playlists,
}: {
 closeBtnRef: React.RefObject<HTMLButtonElement | null>;
 open: boolean;
 setOpen: Dispatch<SetStateAction<boolean>>;
 playlists: FilterOptionsType["playlists"];
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
     <MediaContainer ref={closeBtnRef} playlists={playlists} />
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
    <MediaContainer className="px-4" ref={closeBtnRef} playlists={playlists} />
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
}: {
 className?: string;
 ref: React.RefObject<HTMLButtonElement | null>;
 playlists: FilterOptionsType["playlists"];
}) {
 const {
  handleSubmit,
  formState: { errors },
  control,
 } = useForm<AddMediasToPlaylistSchemaType>({
  resolver: zodResolver(addMediasToPlaylistSchema),
 });
 const { mutate: addMediasToPlaylist } = useAddMediasToPlaylistMutation();
 const { fields, append, remove } = useFieldArray({
  control,
  name: "musics",
 });

 const addMusic = (musicId: number) => {
  append({ music_id: musicId });
 };

 const onSubmit = (data: AddMediasToPlaylistSchemaType) => {
  addMediasToPlaylist(data, {
   onSuccess: () => {
    console.log("success");
   },
   onError: () => {
    console.log("error");
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
     .filter((playlist) => playlist.id !== 0)
     .map((playlist) => (
      <div
       className="flex items-center w-full min-h-12 justify-between"
       key={playlist.id}
      >
       <span className="text-[15px] font-PeydaMedium">{playlist.name}</span>
       <Checkbox
        onClick={() => {
         if (fields.some((field) => field.music_id === playlist.id)) {
          remove(fields.findIndex((field) => field.music_id === playlist.id));
         } else {
          addMusic(playlist.id as number);
         }
        }}
        id={playlist.id.toString()}
        value={playlist.id}
       />
      </div>
     ))}
    {errors.musics && (
     <span className="text-red-500 text-[10px]">{errors.musics.message}</span>
    )}
   </div>

   <div className="flex gap-2 w-full  items-center justify-between">
    <Button className="bg-primary-button w-1/2" type="submit">
     افزودن
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
