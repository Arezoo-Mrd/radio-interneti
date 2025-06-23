import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioFileWithId, AudioState } from "@/hooks/use-multi-audio";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import { Add, Trash } from "iconsax-react";
import { RefObject } from "react";

export interface AddAudioInputProps {
 fileInputRef: RefObject<HTMLInputElement | null>;
 handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
 audioFiles: AudioFileWithId[];
 removeAudioFile: (id: string) => any;
 audioStates: Record<string, AudioState>;
}

const AddAudioInput = ({
 fileInputRef,
 handleFileUpload,
 audioFiles,
 removeAudioFile,
 audioStates,
}: AddAudioInputProps) => {
 return (
  <div className="w-full ">
   <div className="flex items-center justify-center">
    <Button
     className="bg-primary-main cursor-pointer flex items-center"
     onClick={() => fileInputRef.current?.click()}
    >
     <span className="bg-white w-4 h-4 flex items-center justify-center rounded-sm ">
      <Add color="#7367F0" />
     </span>
     <span>انتخاب موزیک</span>
    </Button>
   </div>
   <Input
    ref={fileInputRef}
    type="file"
    accept="audio/mp3,audio/mpeg3;capture=microphone"
    multiple
    onChange={handleFileUpload}
    className="hidden"
   />

   {/* Audio Files List */}
   <div className="flex flex-col max-h-[200px] overflow-y-auto py-4  w-full gap-2">
    {audioFiles.map((file) => {
     const state = audioStates[file.id];

     return (
      <div
       key={file.id}
       className={
        "w-full flex justify-between items-center bg-[#F7F7F7] text-[#212529] rounded-md"
       }
      >
       <div className="px-4 py-2 w-full">
        <div className="space-y-2">
         <div className="flex items-center justify-between">
          <div>
           <h3 className="font-medium text-sm truncate">{file.name}</h3>
           <p className="text-xs text-[#212529]">
            {convertTimeToFarsi(state?.duration || 0)}
           </p>
          </div>
          <div className="flex items-center  gap-2">
           <Button
            onClick={() => removeAudioFile(file.id)}
            variant="destructive"
            className="w-10 h-10 bg-[#F11A3B1F] hover:bg-[#d2717f48] cursor-pointer rounded-sm"
           >
            <Trash className="w-5 h-5 " color="#F11A3B" />
           </Button>
          </div>
         </div>

         {/* Progress Bar */}

         {/* Error Display */}
         {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
         )}

         {/* Loading State */}
         {state?.isLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
         )}
        </div>
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
};

export default AddAudioInput;
