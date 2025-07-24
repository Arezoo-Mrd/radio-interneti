"use client";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import { useDeleteMusicMutation, useGetFilterOptions } from "@/app/(protected)/media-archive/api";
import { Input } from "@/components/ui/input";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import {
    modifyMusicSchema,
    ModifyMusicSchemaType,
} from "@/schema/media.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Trash } from "iconsax-react";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditableAudioType } from ".";
import DropDown from "./DropDown";
import ModifyInput from "./ModifyInput";
import { useUpdateMusicMutation } from "@/app/(protected)/media-archive/add-media/api";
import { useAtom, useSetAtom } from "jotai";
import { ADD_MEDIA_STATE } from "@/states/add-media";

type ItemProps = {
    music: EditableAudioType;
    musicId: number | undefined;
};

const Item = ({ music, musicId }: ItemProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const setAddMediaState = useSetAtom(ADD_MEDIA_STATE);


    const { mutate, isPending } = useUpdateMusicMutation()

    const { mutate: deleteMusic, isPending: isDeleting } = useDeleteMusicMutation()

    const [coverPreview, setCoverPreview] = useState<string | null>(
        music.cover || null
    );

    const {
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ModifyMusicSchemaType>({
        resolver: zodResolver(modifyMusicSchema),
        defaultValues: {
            artist: music.artist,
            is_ads: false,
            title: music.title,
        },
        mode: "onChange",
    });



    const isValid = watch("title") && watch("artist") && watch("genre_id");
    const { data: filterOptions } = useGetFilterOptions();

    const handleInputChange = (
        field: "title" | "artist" | "album" | "cover" | "is_ads",
        value: string | boolean
    ) => {
        setValue(field, value);
    };

    const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                setValue("cover", file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    setCoverPreview(result);
                };
                reader.readAsDataURL(file);
            } else {
                toast.error("لطفاً تصویری با فرمت jpg یا jpeg انتخاب کنید");
            }
        }
    };

    const genres = useMemo(() => {
        return (
            filterOptions?.data.genres.map((item) => {
                return {
                    label: item.name,
                    value: item.id.toString(),
                };
            }) || []
        );
    }, [filterOptions?.data.genres]);

    const onSubmitHandler = (data: ModifyMusicSchemaType) => {
        if (!musicId) return;
        mutate({
            ...data,
            musicId: musicId,
        }, {
            onSuccess: () => {
                toast.success("موزیک با موفقیت ویرایش شد")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    };

    const deleteMusicHandler = () => {
        deleteMusic(musicId?.toString() || "", {
            onSuccess: () => {
                setAddMediaState((prev) => {
                    const newEditableAudios = prev.editableAudios.filter((item) => item.musicId !== musicId)
                    return {
                        ...prev,
                        editableAudios: newEditableAudios,
                        showEditMode: newEditableAudios.length > 0,
                    }
                })
                toast.success("موزیک با موفقیت حذف شد")
            }
        })
    }


    console.log('errors', errors)
    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="w-full flex flex-col p-5 rounded-xl items-center bg-[#F6F6F6]"
        >
            <div className="flex w-full items-center gap-7.25 pb-4 border-b">
                <div className="flex flex-col">

                    <div className=" w-[160px] rounded-lg overflow-hidden border  border-[#CECECE] h-[160px]">
                        {coverPreview ? (
                            <>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full relative cursor-pointer group "
                                >
                                    <Image
                                        src={coverPreview || ""}
                                        alt={music.title}
                                        className="object-cover  w-[160px] h-[160px] "
                                        width={160}
                                        height={160}
                                        quality={100}
                                    />
                                    <div className="absolute top-0 right-0 left-0 bottom-0 opacity-0 flex items-center justify-center  bg-black/40 group-hover:opacity-100   transition-opacity">
                                        <Edit2 size="24" color="#FFFFFF" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    type="button"
                                    className="flex flex-col cursor-pointer  items-center justify-center gap-2 group-hover:bg-gray-100 w-full h-full transition-colors"
                                >
                                    <div className="flex w-full flex-col items-center">
                                        <Upload size="20" color="#CECECE" />
                                        <span className="text-xs text-[#CECECE] mt-1">افزودن کاور</span>
                                    </div>
                                </button>
                            </>
                        )}
                        <Input
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleCoverUpload}
                            type="file"
                            accept="image/*"
                        />


                    </div>
                    {errors.cover && <p className=" text-red-500 text-xs">{errors.cover.message}</p>}
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4.5">
                            <ModifyInput
                                wrapperClassName="min-w-[332px]"
                                id="title"
                                label="نام موزیک"
                                value={watch("title") || ""}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                inputClassName="w-full"
                                errorMessage={errors.title?.message}
                            />
                            <ModifyInput
                                wrapperClassName="min-w-[332px]"
                                id="artist"
                                label="نام آرتیست"
                                value={watch("artist") || ""}
                                onChange={(e) => handleInputChange("artist", e.target.value)}
                                inputClassName="w-full"
                                errorMessage={errors.artist?.message}
                            />
                        </div>
                        <div className="flex items-end gap-1 justify-between w-full">
                            <div className="flex items-center  gap-4.5">
                                <ModifyInput
                                    wrapperClassName="min-w-[332px]"
                                    id="duration"
                                    label="مدت زمان موزیک"
                                    value={convertTimeToFarsi(Number(music.duration))}
                                    disabled
                                />
                                <DropDown
                                    onValueChange={(val) => setValue("genre_id", Number(val))}
                                    wrapperClassName="min-w-[332px]"
                                    label="ژانر موزیک"
                                    id="genre"
                                    placeholder="انتخاب کنید"
                                    items={genres}
                                    errorMessage={errors.genre_id?.message}
                                />
                            </div>
                            <div className="flex gap-2 items-center  ">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={deleteMusicHandler}
                                    disabled={isDeleting}
                                    className="bg-[#F11A3B]/20 w-10 h-10 cursor-pointer"
                                >
                                    <Trash size={20} color="#F11A3B" variant="Linear" />
                                </Button>
                                <Button
                                    type="submit"
                                    size={"lg"}
                                    disabled={!isValid || isPending || isDeleting}
                                    className={`h-11 ${!isValid ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
                                        }`}
                                >
                                    {isPending ? <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div> : 'ذخیره تغییرات'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center w-full gap-2 justify-start">
                <Checkbox
                    id="promotional"
                    checked={watch("is_ads")}
                    onCheckedChange={(checked) => handleInputChange("is_ads", !!checked)}
                />
                <label htmlFor="promotional" className="text-right cursor-pointer">
                    این مورد را به عنوان تبلیغاتی ثبت کن
                </label>
            </div>
        </form>
    );
};

export default Item;
