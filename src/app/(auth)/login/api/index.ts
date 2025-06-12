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
  isFormData: true,
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
    router.push("/dashboard");
   }
  },
 });
};
