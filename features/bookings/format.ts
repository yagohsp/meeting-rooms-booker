import { TIME_ZONE } from "@/lib/time";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (date: Date) => dateFormat.format(date);
export const formatTime = (date: Date) => timeFormat.format(date);

export function formatTimeRange(startsAt: Date, endsAt: Date) {
  return `${formatTime(startsAt)}–${formatTime(endsAt)}`;
}
