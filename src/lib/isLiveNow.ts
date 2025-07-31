export default function isLiveNow(event: {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    activate: boolean;
}) {
    if (!event.activate) return false;

    const now = new Date();

    const startDateTime = new Date(`${event.start_date}T${event.start_time}`);
    const endDateTime = new Date(`${event.end_date}T${event.end_time}`);

    return now >= startDateTime && now <= endDateTime;
}
