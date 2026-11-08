export function formatTimeInput(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 0 && Number(digits[0]) > 2) digits = `0${digits}`;
  digits = digits.slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
}

export function completeTimeInput(value: string) {
  const digits = formatTimeInput(value).replace(":", "");
  if (digits.length === 0) return "";
  const padded =
    digits.length <= 2 ? digits.padStart(2, "0") + "00" : digits.padEnd(4, "0");
  const hours = Math.min(Number(padded.slice(0, 2)), 23);
  const minutes = Math.min(Number(padded.slice(2)), 59);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function isCompleteDate(value: string) {
  const match = /^(\d{4})-\d{2}-\d{2}$/.exec(value);
  return match !== null && Number(match[1]) >= 2000;
}
