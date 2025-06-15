export function setCookie(name: string, value: string, days = 1) {
 const expires = new Date(Date.now() + days * 864e5).toUTCString();
 document.cookie = `${name}=${value}; path=/; expires=${expires}; secure; samesite=lax`;
}

export async function getCookie(name: string) {
 if (typeof window === "undefined") return null;
 const cookieStr = document?.cookie
  .split("; ")
  .find((row) => row.startsWith(`${name}=`))
  ?.split("=")[1];

 return cookieStr ? decodeURIComponent(cookieStr) : null;
}

export function deleteCookie(name: string) {
 document.cookie = `${name}=; Max-Age=0; path=/;`;
}
