import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { atom } from "jotai";

export const ADD_PLAYLIST_STATE = atom<{
    showChangePosition: boolean;
    musics: {
        music_id: number,

    }[]
}>({
    showChangePosition: false,
    musics: [],
});