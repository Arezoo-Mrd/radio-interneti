import { fetchInstance } from "@/utils/fetch";
import { LOGIN } from "./constants";
import { LoginRequest } from "./api.types";
import { useMutation } from "@tanstack/react-query";

export const postLogin = async (request: LoginRequest) => {
 const formData = new FormData();
 formData.append("email", request.email);
 formData.append("password", request.password);
 const data = fetchInstance({
  path: LOGIN,
  options: {
   method: "POST",
   body: formData,
  },
  isFormData: true,
 });

 return data;
};

export const useLoginMutation = () => {
 return useMutation({
  mutationFn: postLogin,
  mutationKey: ["login"],
 });
};
