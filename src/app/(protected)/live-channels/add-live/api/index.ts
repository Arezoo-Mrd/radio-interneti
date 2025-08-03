import { STORE_LIVE } from "./constants";

import { fetchInstance } from "@/lib/fetch";
import { ALL_MUSIC } from "@/app/(protected)/media-archive/api/constants";
import { getCookie } from "@/lib/cookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateLiveSchemaType } from "@/schema/live.schema";
import { getAllLive } from "../../api";

const postStoreLive = async (data: CreateLiveSchemaType) => {
    const currentToken = (await getCookie("token"));
    data.start_date = new Date(data.start_date).toISOString().split("T")[0] as unknown as Date
    data.end_date = new Date(data.end_date).toISOString().split("T")[0] as unknown as Date

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
        mutationFn: postStoreLive,
        mutationKey: ["store-live"],
        onSuccess: () => {
            getAllLive({})
        }

    });
}

