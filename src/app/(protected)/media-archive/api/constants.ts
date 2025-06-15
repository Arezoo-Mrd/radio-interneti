import { PREFIX_API } from "@/constants/api.constants";

export const ALL_MUSIC = `${PREFIX_API}/music/all`;
export const GET_ALL_GENRES = `${PREFIX_API}/music/genre/all`;
export const GET_FILTER_OPTIONS = `${PREFIX_API}/music/properties`;
export const DELETE_MUSIC = (id: string) => `${PREFIX_API}/music/delete/${id}`;
export const ADD_MEDIAS_TO_PLAYLIST = `${PREFIX_API}/music/assign`;
