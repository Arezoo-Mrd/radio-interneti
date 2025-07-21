import { getCookie } from "@/lib/cookies";
import { StoreMusicRequestType, StoreMusicResponseType, UpdateMusicRequestType } from "./api.types";
import { fetchInstance } from "@/lib/fetch";
import { STORE_MUSICS, UPDATE_MUSICS } from "./constants";
import { useMutation } from "@tanstack/react-query";

const postStoreMusic = async (body: StoreMusicRequestType) => {
    const formData = new FormData();


    body.music.forEach((file) => {
        formData.append("music", file);
    });

    const currentToken = await getCookie("token");
    const response = await fetchInstance<StoreMusicResponseType>({
        path: STORE_MUSICS,
        options: {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/octet-stream",
            },
        },
        token: currentToken!,
    });

    return response;
};


const postUpdateMusic = async (body: UpdateMusicRequestType) => {


    const currentToken = await getCookie("token");
    const response = await fetchInstance({
        path: UPDATE_MUSICS(body.musicId.toString()),
        options: {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/octet-stream",
            },
        },
        token: currentToken!,
    });

    return response;
}

export const useStoreMusicMutation = () => {
    return useMutation({
        mutationKey: ["store-music"],
        mutationFn: postStoreMusic,
    });
};

export const useUpdateMusicMutation = () => {
    return useMutation({
        mutationKey: ["update-music"],
        mutationFn: postUpdateMusic,
    });
};