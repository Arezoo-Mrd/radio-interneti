"use client";

import { useMultiAudio } from "@/hooks/use-multi-audio";

import { useStoreMusicMutation } from "@/app/(protected)/media-archive/add-media/api";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { useAtom } from "jotai";
import { useRef } from "react";
import { toast } from "sonner";
import AddNewMusic from "./Add";
import Header from "./Header";
import EditMusics from "./ModifyMusic";
import { useGetFilterOptions } from "@/app/(protected)/media-archive/api";


const AddMedia = () => {
    const { audioFiles, audioStates, addAudioFile, removeAudioFile } =
        useMultiAudio();

    const { mutate, isPending } = useStoreMusicMutation();
    const { data: filterOptions } = useGetFilterOptions();

    const [addMediaState, setAddMediaState] = useAtom(ADD_MEDIA_STATE);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const saveNewMusic = () => {
        mutate(
            {
                music: audioFiles,
            },
            {
                onSuccess(data) {
                    toast.success("عملیات با موفقیت انجام شد!");
                    const newEditableAudios = audioFiles.map((file) => ({
                        id: file.id,
                        artist: "",
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        duration: audioStates[file.id]?.duration || 0,
                        cover: null,
                        musicId: data?.data.id,
                        is_ads: false
                        // genreId: data?.data.genre_id,

                    }));
                    setAddMediaState({
                        editableAudios: newEditableAudios,
                        showEditMode: true,
                    })
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
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
                isLoading={isPending}
            />
            {addMediaState.showEditMode ? (
                <EditMusics editableAudios={addMediaState.editableAudios} filterOptions={filterOptions?.data} />
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
