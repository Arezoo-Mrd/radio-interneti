import { API_PREFIX } from "@/app/(auth)/login/api/constants";

export const STORE_MUSICS = `${API_PREFIX}/music/store`;
export const UPDATE_MUSICS = (musicId: string) => `${API_PREFIX}/music/update/${musicId}`;
