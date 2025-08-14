"use client";

import { useMultiAudio } from "@/hooks/use-multi-audio";

import { useStoreMusicMutation } from "@/app/(protected)/media-archive/add-media/api";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AddNewMusic from "./Add";
import Header from "./Header";
import EditMusics from "./ModifyMusic";
import { useGetFilterOptions } from "@/app/(protected)/media-archive/api";
import { useError } from "@/hooks/use-error";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";


const AddMedia = () => {
    const { audioFiles, audioStates, addAudioFile, removeAudioFile } =
        useMultiAudio();

    const { mutateAsync, isPending } = useStoreMusicMutation();
    const { data: filterOptions } = useGetFilterOptions();
    const queryClient = useQueryClient();
    const { errorHandler } = useError()
    const router = useRouter();
    const [addMediaState, setAddMediaState] = useAtom(ADD_MEDIA_STATE);

    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioFiles.length === 5) {
            toast.warning("شما فقط میتوانید حداکثر 5  فایل آپلود کنید.");
            return;
        }

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
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const saveNewMusic = async () => {
        setIsProcessing(true);
        const successfulUploads: any[] = [];

        try {
            for (const [index, file] of audioFiles.entries()) {
                try {
                    const data = await mutateAsync({
                        music: file
                    });

                    successfulUploads.push({
                        id: file.id,
                        artist: data?.data.artist || file.artist,
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        duration: audioStates[file.id]?.duration || 0,
                        cover: file.cover || null,
                        musicId: data?.data.id,
                        is_ads: false,
                    });


                    toast.success(`فایل ${index + 1} با موفقیت آپلود شد.`);


                    setAddMediaState(prev => ({
                        ...prev,
                        editableAudios: [...successfulUploads],
                    }));


                    if (index < audioFiles.length - 1) {
                        await delay(400);
                    }
                } catch (error) {
                    errorHandler(error);

                }
            }


            setAddMediaState(prev => ({
                ...prev,
                showEditMode: true,
            }));

            toast.success("عملیات آپلود با موفقیت به اتمام رسید!");
        } finally {
            setIsProcessing(false);
        }
    };


    const saveChanges = () => {
        saveNewMusic();

    };


    return (
        <div className="w-full h-fit px-6 py-11">
            <Header
                disabled={audioFiles.length === 0 || isPending}
                saveChanges={saveChanges}
                isEditMode={addMediaState.showEditMode}
                isLoading={isPending || isProcessing}
            />
            {addMediaState.showEditMode ? (
                <EditMusics filterOptions={filterOptions?.data} />
            ) : (
                <AddNewMusic
                    audioFiles={audioFiles}
                    audioStates={audioStates}
                    handleFileUpload={handleFileUpload}
                    removeAudioFile={removeAudioFile}
                    fileInputRef={fileInputRef}
                />
            )}
        </div>
    );
};

export default AddMedia;
