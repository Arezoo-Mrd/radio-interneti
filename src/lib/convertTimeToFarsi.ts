import { convertToFaNum } from "./convertToFaNum";
export const convertTimeToFarsi = (seconds: number) => {
    if (isNaN(seconds)) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = Math.floor(remainingSeconds % 60);

    return `${convertToFaNum(hours.toString().padStart(2, "0"))}:${convertToFaNum(
        mins.toString().padStart(2, "0")
    )}:${convertToFaNum(secs.toString().padStart(2, "0"))}`;
};