export const fetchInstance = async ({
 path,
 options,
 isFormData = false,
}: {
 path: string | URL;
 options: RequestInit;
 isFormData?: boolean;
}) => {
 const modifiedOptions: RequestInit = {
  ...options,
  headers: {
   ...(options.headers || {}),
   Accept: "application/json",
   "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  },
 };

 try {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("Base URL is not defined");

  const response = await fetch(`${baseUrl}${path}`, modifiedOptions);
  const contentType = response.headers.get("Content-Type");
  const isJson = contentType?.includes("application/json");

  const responseData = isJson ? await response.json() : await response.text();

  if (!response.ok) {
   throw new Error("Fetch error");
  }

  return responseData;
 } catch (error: any) {
  console.error("☢️ Unexpected error:", error);
 }
};
