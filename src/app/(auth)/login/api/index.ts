import { fetchInstance } from "@/lib/fetch";
import { LOGIN } from "./constants";
import { LoginRequest, LoginResponse } from "./api.types";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";

export const postLogin = async (request: LoginRequest) => {
    const data = await fetchInstance<LoginResponse>({
        path: LOGIN,
        options: {
            method: "POST",
            body: JSON.stringify(request),
        },
    });

    return data;
};

export const useLoginMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: postLogin,
        mutationKey: ["login"],
        onSuccess: (data) => {
            if (data) {
                setCookie("token", data.data.access.token);
                setCookie("user_info", JSON.stringify(data.data.user));

                router.push("/dashboard");
            }
        },
    });
};
