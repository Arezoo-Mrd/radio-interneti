export type MusicType = {
    id: number;
    genre_id: number;
    title: string;
    artist: string;
    cover: string;
    music: string;
    duration: number;
    is_ads: boolean;
    guest_like: number;
    playlists: [
        {
            id: number;
            name: string;
            pivot: {
                music_id: number;
                playlist_id: number;
            };
        }
    ];
    genre: {
        id: number;
        name: string;
    };
};

export type MediaArchiveType = MusicType[];

export type GetAllMusicQueryParams = {
    title?: string;
    artist?: string;
    is_ads?: 0 | 1;
    genre_id?: number;
    media_type?: number;
    playlist_id?: number;
    channel_id?: number;
    page?: number;
    per_page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

export type GenreType = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

export type BaseFilterOptionType = {
    id: number | string;
    name: string;
};

export type GetFilterOptionsResponse = {
    playlists: BaseFilterOptionType[];
    artists: string[];
    genres: BaseFilterOptionType[];
};

export type FilterOptionsType = {
    playlists: BaseFilterOptionType[];
    artists: BaseFilterOptionType[];
    genres: BaseFilterOptionType[];
};


export type AssignBulkMediasToPlaylistRequestType = {
    assign: {
        music_id: number;
        playlist_id: number;
    }[];
};