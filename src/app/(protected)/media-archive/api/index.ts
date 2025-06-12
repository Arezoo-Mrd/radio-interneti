import { fetchInstance } from "@/lib/fetch";
import { ALL_MUSIC } from "./constants";
import { getCookie } from "@/lib/cookies";
import { cookies } from "next/headers";
import { MediaArchiveType } from "./api.types";

export const getAllMusic = async ({
 isServer = false,
}: {
 isServer?: boolean;
}) => {
 const token = isServer
  ? (await cookies()).get("token")?.value
  : await getCookie("token");
 const response = (await fetchInstance)<MediaArchiveType>({
  path: ALL_MUSIC,
  options: {
   method: "GET",
  },
  token: token!,
 });
 return response;
};
