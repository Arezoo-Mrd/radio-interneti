import { getCookie } from "@/lib/cookies";
import { StoreMusicRequestType } from "./api.types";
import { fetchInstance } from "@/lib/fetch";
import { STORE_MUSICS } from "./constants";
import { useMutation } from "@tanstack/react-query";

const postStoreMusic = async (body: StoreMusicRequestType) => {
 const formData = new FormData();

 body.music.forEach((file) => {
  formData.append("music", file);
 });

 const currentToken = await getCookie("token");
 const response = await fetchInstance<{ message: string }>({
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

export const useStoreMusicMutation = () => {
 return useMutation({
  mutationKey: ["store-music"],
  mutationFn: postStoreMusic,
 });
};
