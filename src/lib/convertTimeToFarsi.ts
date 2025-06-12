import { convertToFaNum } from "./convertToFaNum";
export const convertTimeToFarsi = (sec: number) => {
 const minutes = Math.floor(sec / 60) || "00";
 const seconds = sec % 60 || "00";
 return `${convertToFaNum(minutes)}:${convertToFaNum(seconds)}`;
};
