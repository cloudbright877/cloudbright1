var filter = require("leo-profanity");
const words = [
  "admin",
  "scum",
  "scam",
  "scammer",
  "scamming",
  "scams",
  "emvios"
];

export default function getBadWords(word: string) {
  const arr = [word];
  const search = (query : string) => arr.filter((s) => s.toLowerCase().includes(query));
  let data = false;

  words.forEach((item) => {
    const res = search(item);

    if (res.length > 0) {
      data = true;
    }
  });

  if (data) {
    return true;
  } else {
    filter.add(words);

    return filter.check(word);
  }
}
