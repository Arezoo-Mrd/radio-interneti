import { redirect } from "next/navigation";
import { deleteCookie, getCookie } from "./cookies";

export type SuccessResponse<T> = {
 message: string;
 status: string;
 code: number;
 paginate: {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
 };
 data: T;
};

const convertToFormData = (body: string) => {
 const formData = new FormData();
 const data = JSON.parse(body);
 Object.entries(data).forEach(([key, value]) => {
  formData.append(key, value as string);
 });
 return formData;
};

export const fetchInstance = async <T>(opt: {
 path: string | URL;
 options: RequestInit;
 isRetry?: boolean;
 baseUrl?: string;
 token?: string;
 isFormData?: boolean;
}): Promise<SuccessResponse<T> | undefined> => {
 const token = opt.token || (await getCookie("token"));

 const body = opt.isFormData
  ? convertToFormData(opt.options.body as string)
  : opt.options.body;

 const modifiedOptions: RequestInit = {
  ...opt.options,
  body,
  headers: {
   ...(opt.options.headers || {}),
   Accept: "application/json",
   ...(opt.isFormData ? {} : { "Content-Type": "application/json" }),
   Authorization: `Bearer ${token}`,
  },
 };

 const baseUrl = opt.baseUrl || process.env.NEXT_PUBLIC_BASE_URL;

 try {
  if (!baseUrl) throw new Error("Base URL is not defined");

  const response = await fetch(`${baseUrl}${opt.path}`, modifiedOptions);
  const contentType = response.headers.get("Content-Type");
  const isJson = contentType?.includes("application/json");

  if (response.status === 401) {
   deleteCookie("token");
   deleteCookie("user_info");
   redirect("/login");
  }

  const responseData: SuccessResponse<T> | string = isJson
   ? ((await response.json()) as SuccessResponse<T>)
   : ((await response.text()) as string);

  if (typeof responseData === "string") {
   throw new Error(responseData);
  }

  return responseData;
 } catch (error: any) {
  console.log("error", error);
  throw error;
 }
};
