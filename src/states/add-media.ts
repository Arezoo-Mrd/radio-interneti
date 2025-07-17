
import { EditableAudioType } from "@/components/MediaArchive/AddMedia/ModifyMusic";
import { atom } from "jotai";

export const ADD_MEDIA_STATE = atom<{
    showEditMode: boolean;
    editableAudios: (EditableAudioType & { musicId: number | undefined })[];
}>({
    showEditMode: false,
    editableAudios: [],
});

