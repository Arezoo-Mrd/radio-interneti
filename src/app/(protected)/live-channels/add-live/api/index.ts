import { STORE_LIVE } from "./constants";

import { fetchInstance } from "@/lib/fetch";
import { ALL_MUSIC } from "@/app/(protected)/media-archive/api/constants";
import { getCookie } from "@/lib/cookies";
import { useMutation } from "@tanstack/react-query";
import { CreateLiveSchemaType } from "@/schema/live.schema";

const getStoreLive = async (data: CreateLiveSchemaType) => {
    const currentToken = (await getCookie("token"));

    const response = await fetchInstance({
        path: STORE_LIVE,
        options: {
            method: "POST",
            body: JSON.stringify(data),
        },
        token: currentToken!,
    });

    return response;
}


export const useStoreLiveMutation = () => {
    return useMutation({
        mutationFn: getStoreLive,
        mutationKey: ["store-live"],

    });
}

