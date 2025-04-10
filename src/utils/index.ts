export function formatDate(timestamp: string) {
  const d = new Date(timestamp);
  return d.toLocaleString(undefined, { hourCycle: "h24" });
}
