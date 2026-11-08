export const TIME_ZONE = "America/Sao_Paulo";

const datePartsFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function todayInSaoPaulo(now = new Date()) {
  const parts = datePartsFormat.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const offsetFormats = new Map<string, Intl.DateTimeFormat>();

function offsetFormat(timeZone: string) {
  let format = offsetFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    });
    offsetFormats.set(timeZone, format);
  }
  return format;
}

function offsetMinutes(instant: Date, timeZone: string) {
  const name = offsetFormat(timeZone)
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? "");
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

export function zonedDateTimeToUtc(
  date: string,
  time: string,
  timeZone = TIME_ZONE,
) {
  const asUtc = new Date(`${date}T${time}:00Z`);
  const guess = asUtc.getTime() - offsetMinutes(asUtc, timeZone) * 60_000;
  return new Date(
    asUtc.getTime() - offsetMinutes(new Date(guess), timeZone) * 60_000,
  );
}

export function addDays(date: string, days: number) {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h${String(rest).padStart(2, "0")}`;
}

const clockFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function saoPauloClock(instant: Date) {
  const parts = clockFormat.formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: WEEKDAYS.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}
