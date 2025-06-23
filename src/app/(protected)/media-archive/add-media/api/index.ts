import { getCookie } from "@/lib/cookies";
import { StoreMusicRequestType } from "./api.types";
import { fetchInstance } from "@/lib/fetch";
import { STORE_MUSICS } from "./constants";
import { useMutation } from "@tanstack/react-query";

const postStoreMusic = async (body: StoreMusicRequestType) => {
 const currentToken = await getCookie("token");
 const response = await fetchInstance<{ message: string }>({
  path: STORE_MUSICS,
  options: { method: "POST", body: JSON.stringify(body) },
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
