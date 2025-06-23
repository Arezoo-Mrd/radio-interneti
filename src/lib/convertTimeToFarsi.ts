import { convertToFaNum } from "./convertToFaNum";
export const convertTimeToFarsi = (seconds: number) => {
 if (isNaN(seconds)) return "0:00";
 const mins = Math.floor(seconds / 60);
 const secs = Math.floor(seconds % 60);
 return `${convertToFaNum(mins)}:${convertToFaNum(
  secs.toString().padStart(2, "0")
 )}`;
};
