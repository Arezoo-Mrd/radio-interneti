import { cookies } from "next/headers";

export const auth = async () => {
 const cookieStore = await cookies();
 const token = cookieStore.get("token")?.value;

 return !!token;
};
