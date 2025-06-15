import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { SuccessResponse } from "./fetch";

export const generatePageNumbers = (
 pagination: SuccessResponse<MusicType>["paginate"] | undefined
) => {
 if (!pagination) return [];

 const { current_page, last_page } = pagination;
 const pages = [];
 const maxVisiblePages = 5;

 if (last_page <= maxVisiblePages) {
  for (let i = 1; i <= last_page; i++) {
   pages.push(i);
  }
 } else {
  // Show pages with ellipsis
  if (current_page <= 3) {
   // Show first pages
   for (let i = 1; i <= 4; i++) {
    pages.push(i);
   }
   pages.push("ellipsis");
   pages.push(last_page);
  } else if (current_page >= last_page - 2) {
   // Show last pages
   pages.push(1);
   pages.push("ellipsis");
   for (let i = last_page - 3; i <= last_page; i++) {
    pages.push(i);
   }
  } else {
   // Show middle pages
   pages.push(1);
   pages.push("ellipsis");
   for (let i = current_page - 1; i <= current_page + 1; i++) {
    pages.push(i);
   }
   pages.push("ellipsis");
   pages.push(last_page);
  }
 }

 return pages;
};
