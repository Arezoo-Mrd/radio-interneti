import React from "react";
import AddAudioInput, { AddAudioInputProps } from "./AddAudioInput";

import AddMediaIcon from "./AddMediaIcon";

interface AddNewMusicProps extends AddAudioInputProps {}

const AddNewMusic = ({
 audioFiles,
 audioStates,
 fileInputRef,
 handleFileUpload,
 removeAudioFile,
}: AddNewMusicProps) => {
 return (
  <div className="flex w-full pt-18 h-full items-center justify-center">
   <div className="border-dashed border flex pt-11 flex-col items-center justify-center rounded-xl border-[#8261E6] bg-[#DFDCF11F] min-h-[290px] w-[482px]">
    <AddMediaIcon />
    <div className="px-16 flex items-center justify-center flex-col space-y-4">
     <p className="text-sm text-center">
      برای بارگذاری موزیک جدید، می‌توانید فایل را با دکمه انتخاب کنید یا آن را
      بکشید و رها کنید.
     </p>

     <AddAudioInput
      audioFiles={audioFiles}
      audioStates={audioStates}
      handleFileUpload={handleFileUpload}
      removeAudioFile={removeAudioFile}
      fileInputRef={fileInputRef}
     />
    </div>
   </div>
  </div>
 );
};

export default AddNewMusic;
