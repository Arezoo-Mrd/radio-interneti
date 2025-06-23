"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 modifyMusicSchema,
 ModifyMusicSchemaType,
} from "@/schema/media.schema";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import ModifyInput from "./ModifyInput";
import DropDown from "./DropDown";
import { Trash } from "iconsax-react";

type ItemProps = {
 // TODO:
 music: {
  artist: string;
  cover?: File;
  title: string;
  duration: string;
  genre_id: number;
  play_list_id: number;
  is_ads: number;
  id: number;
 };
};

const Item = ({ music }: ItemProps) => {
 const {
  register,
  formState: { errors, isValid },
 } = useForm<ModifyMusicSchemaType>({
  resolver: zodResolver(modifyMusicSchema),
  defaultValues: {
   artist: music.artist,
   is_ads: !!music.is_ads,
   cover: music.cover,
   genre_id: music.genre_id,
   title: music.title,
  },
 });

 const handleInputChange = (field: string, value: string | boolean) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
 };

 return (
  <form className="w-full flex flex-col p-5 rounded-xl items-center bg-[#F6F6F6]">
   <div className="flex w-full items-center pb-4 border-b">
    <Image
     src="/images/shahmehr-cover.png"
     alt="SHAHMEHR - EHSAS"
     width={160}
     height={160}
     className="object-cover w-[160px] rounded-lg overflow-hidden h-[160px]"
    />

    <div className="w-full">
     <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4.5">
       <ModifyInput
        wrapperClassName="min-w-[332px]"
        id="title"
        label="نام موزیک"
        value={music.title}
        onChange={(e) => handleInputChange("musicName", e.target.value)}
        inputClassName="w-full"
       />
       <ModifyInput
        wrapperClassName="min-w-[332px]"
        id="artist"
        label="نام آرتیست"
        value={music.artist}
        onChange={(e) => handleInputChange("artist", e.target.value)}
        inputClassName="w-full"
       />
      </div>
      <div className="flex items-end  justify-between w-full">
       <div className="flex items-center  gap-4.5">
        <ModifyInput
         wrapperClassName="min-w-[332px]"
         id="duration"
         label="مدت زمان موزیک"
         value={convertTimeToFarsi(Number(music.duration))}
         onChange={(e) => handleInputChange("duration", e.target.value)}
        />
        <DropDown
         onValueChange={(val) => console.log("val", val)}
         wrapperClassName="min-w-[332px]"
         label="ژانر موزیک"
         id="genre"
         placeholder="انتخاب کنید"
         items={[]}
        />
       </div>
       <div className="flex gap-2 items-center  ">
        <Button
         variant="ghost"
         size="icon"
         className="bg-[#F11A3B]/20 w-10 h-10"
        >
         <Trash size={20} color="#F11A3B" variant="Linear" />
        </Button>
        <Button
         type="submit"
         size={"lg"}
         disabled={!isValid}
         className={`h-11 ${
          !isValid ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
         }`}
        >
         ذخیره تغییرات
        </Button>
       </div>
      </div>
     </div>
    </div>
   </div>
   <div className="mt-6 flex items-center w-full gap-2 justify-start">
    <Checkbox
     id="promotional"
     checked={!!music.is_ads}
     onCheckedChange={(checked) =>
      handleInputChange("isPromotional", !!checked)
     }
    />
    <label htmlFor="promotional" className="text-right cursor-pointer">
     این مورد را به عنوان تبلیغاتی ثبت کن
    </label>
   </div>
  </form>
 );
};

export default Item;
