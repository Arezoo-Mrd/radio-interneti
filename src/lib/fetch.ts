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



class FetchError extends Error {
  response: object;
  constructor(message: string, response: object) {
    super(message);
    this.name = "FetchError";
    this.response = response;
  }
}



export const fetchInstance = async <T>(opt: {
  path: string | URL;
  options: RequestInit;
  isRetry?: boolean;
  baseUrl?: string;
  token?: string;
}): Promise<SuccessResponse<T> | undefined> => {
  const token = opt.token || (await getCookie("token"));

  const isFormData = opt.options.body instanceof FormData;

  const modifiedOptions: RequestInit = {
    ...opt.options,
    headers: {
      ...(opt.options.headers || {}),
      Accept: "application/json",

      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
  };

  const baseUrl = opt.baseUrl || process.env.NEXT_PUBLIC_BASE_URL;

  try {
    if (!baseUrl) throw new Error("Base URL is not defined");

    const response = await fetch(`${baseUrl}${opt.path}`, modifiedOptions);
    const contentType = response.headers.get("Content-Type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const error = await response.json();

      throw new FetchError(error.message, error.errors
      );
    }

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
    throw error;
  }
};