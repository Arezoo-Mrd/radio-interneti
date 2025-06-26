export const formattedDate = (date: string) => {
 const newDate = new Date(date);

 // Format options

 // Create Persian (Farsi) locale formatter
 const persianFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false, // 24-hour format
 });

 const formattedDate = persianFormatter.format(newDate);

 return formattedDate;
};
