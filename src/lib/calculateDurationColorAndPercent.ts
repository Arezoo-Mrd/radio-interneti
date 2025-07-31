export function calculateDurationColorAndPercent(
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string
) {
    const start = new Date(`${start_date}T${start_time}`);
    const end = new Date(`${end_date}T${end_time}`);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = durationMs / (1000 * 60);


    const MAX_DURATION = 150;
    const percent = Math.min((durationMinutes / MAX_DURATION) * 100, 100);

    let color = 'text-green-500 border-green-500';
    if (durationMinutes >= 90 && durationMinutes < 150)
        color = 'text-yellow-500 border-yellow-500';
    else if (durationMinutes >= 150)
        color = 'text-red-500 border-red-500';


    return { percent: Math.round(percent), color, durationMinutes };
}
