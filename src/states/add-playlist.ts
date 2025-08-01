import { SinglePlaylistResponseType } from "@/app/(protected)/channels/[slug]/new-playlist/api/api.types";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { atom } from "jotai";

export const ADD_PLAYLIST_STATE = atom<{
    showChangePosition: boolean;
    musics: SinglePlaylistResponseType["musics"] | (MusicType & { position: number })[]
    playListId: number
    start_date: string
    start_time: string
    end_date: string
    end_time: string
}>({
    showChangePosition: false,
    musics: [],
    playListId: -1,
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: ""
});


