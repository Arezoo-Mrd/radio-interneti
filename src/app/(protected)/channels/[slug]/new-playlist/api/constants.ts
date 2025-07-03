import { API_PREFIX } from "@/app/(auth)/login/api/constants";

export const ALL_PLAYLIST = `${API_PREFIX}/playlist/all`;
export const DELETE_PLAYLIST = (id: string) => `${API_PREFIX}/playlist/delete/${id}`;