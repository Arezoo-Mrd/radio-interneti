import { API_PREFIX } from "@/app/(auth)/login/api/constants";

export const ALL_PLAYLIST = `${API_PREFIX}/playlist/all`;
export const DELETE_PLAYLIST = (id: string) => `${API_PREFIX}/playlist/delete/${id}`;
export const UPDATE_PLAYLIST = (id: string) => `${API_PREFIX}/playlist/update/${id}`;
export const UPDATE_PLAYLIST_POSITION = `${API_PREFIX}/playlist/update-position`;
export const STORE_PLAYLIST = `${API_PREFIX}/playlist/store`;

export const SHOW_PLAYLIST = (id: string) => `${API_PREFIX}/playlist/show/${id}`;

export const UPDATE_MUSIC_POSITION = `${API_PREFIX}/playlist/update-position`
export const DETACH_MUSIC_FROM_PLAYLIST = `${API_PREFIX}/music/detach`;
