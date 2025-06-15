"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilterParams(onFilterChange?: () => void) {
 const router = useRouter();
 const searchParams = useSearchParams();

 const updateFilter = useCallback(
  (key: string, value: string | number) => {
   const params = new URLSearchParams(searchParams.toString());

   if (value === 0 || value === "0") {
    params.delete(key);
   } else {
    if (key === "title") {
     params.set(key, value.toString());
    } else {
     params.set(key, value.toString());
    }
   }

   router.push(`?${params.toString()}`, { scroll: false });
   onFilterChange?.();
  },
  [router, searchParams, onFilterChange]
 );

 const getFilterValue = useCallback(
  (key: string): number | string => {
   const value = searchParams.get(key);

   if (key === "artist" || key === "title") {
    return value || "";
   }
   return value ? Number.parseInt(value, 10) : 0;
  },
  [searchParams]
 );

 const clearAllFilters = useCallback(() => {
  router.push(window.location.pathname, { scroll: false });
 }, [router]);

 return {
  updateFilter,
  getFilterValue,
  clearAllFilters,
 };
}
