import { API_PREFIX } from "@/app/(auth)/login/api/constants";

export const ALL_LIVE = `${API_PREFIX}/live/all`;
export const DELETE_LIVE = (id: string) => `${API_PREFIX}/live/delete/${id}`;
