import { randomOrankaeWord } from "./orankae";
import { randInt, sample, sampleByWeights, xoshiro128ss } from "./random";
import { randomHanjaeo } from "./seonbi";

export const suffix: [string, number][] = [
  ["", 10],
  ["인", 1],
  ["한", 1],
  ["된", 1],
  ["이/가", 1],
  ["께서", 1],
  ["에서", 1],
  ["의", 1],
  ["을/를", 1],
  ["에", 1],
  ["에게", 1],
  ["께", 1],
  ["한테", 1],
  ["에서", 1],
  ["에게서", 1],
  ["한테서", 1],
  ["보다", 1],
  ["(으)로", 1],
  ["(으)로서", 1],
  ["(으)로써", 1],
  ["(이)고", 1],
  ["(이)라고", 1],
  ["과/와", 1],
  ["(이)랑", 1],
  ["같이", 1],
  ["처럼", 1],
  ["만큼", 1],
  ["만치", 1],
  ["하고", 1],
  ["(이)며", 1],
  ["에다", 1],
  ["에다가", 1],
  ["은/는", 1],
  ["도", 1],
  ["만", 1],
  ["(으)로부터", 1],
  ["까지", 1],
  ["마저", 1],
  ["조차", 1],
  ["일랑", 1],
  ["커녕", 1],
  ["인들", 1],
  ["엔들", 1],
  ["만", 1],
  ["마는", 1],
  ["뿐", 1],
  ["따라", 1],
  ["토록", 1],
  ["치고", 1],
  ["밖에", 1],
  ["인즉", 1],
  ["대로", 1],
  ["(이)나", 1],
  ["(이)란", 1],
  ["(이)든가", 1],
  ["(이)든지", 1],
  ["(이)나마", 1],
  ["(이)야", 1],
  ["(이)야말로", 1],
];

export const endings: [string, number][] = [
  ["(이)다.", 80],
  ["하다.", 80],
  ["되다.", 80],
  ["(이)랴.", 3],
  ["하랴.", 3],
  ["되랴.", 3],
  ["일쏘냐.", 1],
  ["할쏘냐.", 1],
  ["될쏘냐.", 1],
  ["(이)리라.", 4],
  ["되리라.", 4],
  ["하리라.", 4],
  ["이오./요.", 6],
  ["하오.", 6],
  ["되오.", 6],
];

export const speechEndings = [
  ...endings.map(([e]) => e),
  "(이)군.",
  "(이)네.",
  "(으)마.",
  "일걸.",
  "(이)게.",
  "(이)냐?",
  "(이)니?",
  "(이)련?",
  "(이)래?",
  "(이)람?",
  "이어요./여요.",
  "(이)옵니다.",
  "인가.",
  "입니다.",
  "아./야.",
];

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
// ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
// ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
//   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ

export const appendEomi = (word: string, eomiExp?: string) => {
  if (!eomiExp) return word;
  let cddw = word;
  let cdde = eomiExp;

  const ggeut = ((word.codePointAt(word.length - 1) as number) - 0xac00) % 28;
  const s = eomiExp.includes("/") ? eomiExp.split("/") : null;
  if (s) cdde = ggeut ? s[0] : s[1];

  const m = eomiExp.match(/(.*)\((.+)\)(.*)/);
  if (m) {
    const exc = eomiExp.startsWith("(으)") && ggeut === 8;
    cdde = ggeut && !exc ? `${m[1]}${m[2]}${m[3]}` : `${m[1]}${m[3]}`;
  }

  const ggeuts = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
  const ggeutAdder = ggeuts.indexOf(cdde[0]) + 1;
  if (!ggeut && ggeutAdder) {
    const lastCodePoint = word.codePointAt(word.length - 1) as number;
    const modifiedLast = String.fromCodePoint(lastCodePoint + ggeutAdder);
    cddw = `${word.substring(0, word.length - 1)}${modifiedLast}`;
    cdde = cdde.substring(1);
  }

  return `${cddw}${cdde}`;
};

export type StringGenerator = () => string;

export const randomWords = (
  min: number,
  max: number,
  prng: () => number,
  getWord: StringGenerator,
  getEnding: StringGenerator | null = () => sampleByWeights(endings, prng),
  getSuffix: StringGenerator | null = () => sampleByWeights(suffix, prng),
) => {
  const length = randInt(min, max, prng);
  return Array.from({ length }, (_, i) => {
    const word = getWord();
    if (i === length - 1) return appendEomi(word, getEnding?.() ?? "");
    return appendEomi(word, getSuffix?.() ?? "");
  }).join(" ");
};

export type HutsoriMode = "선비" | "오랑캐";
export type HutsoriType = "post" | "paragraph" | "name" | "speech";

export interface HutsoriInput {
  mode: HutsoriMode;
  type: HutsoriType;
  seed: string;
}

export interface HutsoriOutput {
  title: string;
  cite?: string;
  body?: string[];
}

export const createHutosri = ({ mode, type, seed }: HutsoriInput) => {
  let title: string;
  const prng = xoshiro128ss(seed);
  const wordgen =
    mode === "선비" ? () => randomHanjaeo(prng) : () => randomOrankaeWord(prng);
  if (type === "post") title = randomWords(2, 7, prng, wordgen, null);
  else if (type === "name")
    title = randomWords(2, 3, prng, wordgen, null, null);
  else if (type === "speech")
    title = randomWords(2, 7, prng, wordgen, () => sample(speechEndings, prng));
  else title = randomWords(2, 7, prng, wordgen);

  return {
    title,
    ...((type === "paragraph" || type === "speech") && {
      cite: randomWords(2, 3, prng, wordgen, null, null),
    }),
    ...(type === "post" && {
      body: Array.from({ length: 10 }, () => {
        return Array.from({ length: randInt(2, 4, prng) }, () =>
          randomWords(5, 20, prng, wordgen),
        ).join(" ");
      }),
    }),
  };
};
