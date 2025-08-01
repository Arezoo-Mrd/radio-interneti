export function calculateDurationColorAndPercent(
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string,
    musicsDuration: number
) {
    const start = new Date(`${start_date}T${start_time}`);
    const end = new Date(`${end_date}T${end_time}`);
    const durationMs = end.getTime() - start.getTime();
    const durationSeconds = durationMs / (1000);



    const percent = Math.min((musicsDuration / durationSeconds) * 100);

    let color = 'text-green-500 border-green-500';
    if (percent >= 90 && percent < 100)
        color = 'text-yellow-500 border-yellow-500';
    else if (percent >= 100)
        color = 'text-red-500 border-red-500';


    return { percent: Math.round(percent), color, durationSeconds };
}
