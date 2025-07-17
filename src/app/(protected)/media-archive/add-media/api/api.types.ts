import { AddMediasToPlaylistSchemaType, ModifyMusicSchemaType } from "@/schema/media.schema";

export type StoreMusicRequestType = {
    music: File[];
};


export type StoreMusicResponseType = {
    title: string;
    artist: string;
    album: string;
    cover: string | null;
    music: string;
    duration: number;
    updated_at: string;
    created_at: string;
    id: number;
}

export type UpdateMusicRequestType = ModifyMusicSchemaType & {
    musicId: number;
}