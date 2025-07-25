import { CreatePlaylistSchemaType } from "@/schema/playlist.schema"

export type StorePlaylistType = CreatePlaylistSchemaType & {
    channel_playlist: number,

}

export type StorePlaylistResponseType = {
    channel_playlist: number,
    playlist_type: string,
    name: string,
    description: string,
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string,
    activate: boolean,
    updated_at: string,
    created_at: string,
    id: number
}

export type PlaylistResponseType = {
    id: number,
    channel_playlist: number,
    playlist_type: string,
    playlist_options: null,
    name: string,
    description: string,
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string,
    activate: boolean,
    created_at: string,
    updated_at: string,
    music_count: number,
    channel: {
        id: number,
        name: string,
        description: string,
        activate: boolean,
    }[]
}[]



export type UpdateMusicPositionType = {
    playlist_id: number,
    musics: {
        music_id: number,
        position: number,
    }[]
}


