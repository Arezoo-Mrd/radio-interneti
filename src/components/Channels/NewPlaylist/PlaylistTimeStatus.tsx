import { calculateDurationColorAndPercent } from "@/lib/calculateDurationColorAndPercent";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";

export default function PlaylistTimeStatus({
    start_date,
    start_time,
    end_date,
    end_time,
    musicsDuration,
}: {
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    musicsDuration: number;
}) {
    const { percent, color, durationSeconds } = calculateDurationColorAndPercent(
        start_date,
        start_time,
        end_date,
        end_time,
        musicsDuration
    );


    const formatTime = (d: string, t: string) =>
        new Date(`${d}T${t}`).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
        });



    return (
        <div className="flex justify-between items-center border rounded-md p-4 gap-5">
            <div
                className={`w-20 h-20 border-[6px] rounded-full flex items-center justify-center text-sm font-bold ${color} flex-shrink-0`}
            >
                ٪{percent}
            </div>
            <div className="text-right w-full">
                <h3 className={`font-bold mb-1 ${color}`}>مدیریت زمان پلی لیست</h3>
                <p className="text-sm text-gray-600 mb-2">
                    توجه داشته باشید: مجموع مدت زمان موزیک‌های پلی‌لیست نمی‌تواند از {convertTimeToFarsi(durationSeconds)} دقیقه بیشتر باشد.
                </p>
                <button className={`border rounded px-3 py-1 text-sm ${color}`}>
                    {formatTime(start_date, start_time)} الی {formatTime(end_date, end_time)}
                </button>
            </div>


        </div>
    );
}
