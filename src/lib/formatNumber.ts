export default function formatNumber(str: string) {
  let newstr = Number(str).toFixed(0);
  return newstr
    .split("")
    .reverse()
    .join("")
    .match(/\d{0,3}/g)?.join(" ")
    .split("")
    .reverse()
    .join("")
    .trim();
}
