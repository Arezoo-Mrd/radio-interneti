"use client";

import { useMultiAudio } from "@/hooks/use-multi-audio";

import { useStoreMusicMutation } from "@/app/(protected)/media-archive/add-media/api";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AddNewMusic from "./Add";
import EditMusics, { EditableAudioType } from "./ModifyMusic";
import Header from "./Header";

const AddMedia = () => {
 const { audioFiles, audioStates, addAudioFile, removeAudioFile } =
  useMultiAudio();

 const { mutate, isPending } = useStoreMusicMutation();

 const [showEditMode, setShowEditMode] = useState(false);

 const [editableAudios, setEditableAudios] = useState<EditableAudioType[]>([]);

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
     console.log("data", data);
     setShowEditMode(true);
     toast.success("عملیات با موفقیت انجام شد!");
     //  const newEditableAudios = audioFiles.map((file) => ({
     //   id: file.id,
     //   artist: "",
     //   title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
     //   duration: audioStates[file.id]?.duration || 0,
     //   cover: null,
     //  }));
     //  setEditableAudios(newEditableAudios);
    },
    onError() {
     toast.error("خطایی رخ داده است مجددا تلاش کنید.");
    },
   }
  );
 };

 const updateMusics = () => {};

 const saveChanges = () => {
  if (showEditMode) {
   updateMusics();
  } else {
   saveNewMusic();
  }
 };

 return (
  <div className="w-full h-fit px-6 py-11">
   <Header
    disabled={audioFiles.length === 0 || isPending}
    saveChanges={saveChanges}
    isEditMode={showEditMode}
   />
   {showEditMode ? (
    <EditMusics editableAudios={editableAudios} />
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
