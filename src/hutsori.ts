export const preprocessEomi = (str: string) => {
  if (str.includes("/")) return str.split("/");
  const m = str.match(/(.*)\((.+)\)(.*)/);
  if (!m) return [str, str];
  return [`${m[1]}${m[2]}${m[3]}`, `${m[1]}${m[3]}`];
};

export const suffix = [
  "은/ㄴ",
  "인",
  "한",
  "된",
  "이/가",
  "께서",
  "에서",
  "의",
  "을/를",
  "에",
  "에게",
  "께",
  "한테",
  "에서",
  "에게서",
  "한테서",
  "보다",
  "(으)로",
  "(으)로서",
  "(으)로써",
  "(이)고",
  "(이)라고",
  "과/와",
  "(이)랑",
  "같이",
  "처럼",
  "만큼",
  "만치",
  "하고",
  "(이)며",
  "에다",
  "에다가",
  "은/는",
  "도",
  "만",
  "(으)로부터",
  "까지",
  "마저",
  "조차",
  "일랑",
  "커녕",
  "인들",
  "엔들",
  "만",
  "마는",
  "뿐",
  "따라",
  "토록",
  "치고",
  "밖에",
  "인즉",
  "대로",
  "(이)나",
  "(이)란",
  "(이)든가",
  "(이)든지",
  "(이)나마",
  "(이)야",
  "(이)야말로",
];

export const endings: [string, number][] = [
  ["(이)다.", 80],
  ["(이)랴.", 3],
  ["일쏘냐.", 1],
  ["(이)라.", 4],
  ["이오./요.", 6],
  ["(이)여.", 6],
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

export const encodeHexLE = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex = `${bytes[i].toString(16).padStart(2, "0")}${hex}`;
  }
  return hex;
};

export const decodeHexLE = (text: string) => {
  const bytes = new Uint8Array(Math.ceil(text.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    const r = bytes.length - i - 1;
    const hex = text.substring(i * 2, (i + 1) * 2);
    if (hex.length !== 2) throw new Error("Malformed Hex");
    const byte = parseInt(hex, 16);
    if (isNaN(byte)) throw new Error("Malformed Hex");
    bytes[r] = parseInt(hex, 16);
  }
  return bytes.buffer;
};

export function generateSeed() {
  const seed = new Uint32Array(4);
  crypto.getRandomValues(seed);
  return encodeHexLE(seed.buffer);
}

export function xoshiro128ss(seed: string) {
  const buffer = decodeHexLE(seed);
  if (buffer.byteLength !== 16) throw new Error("Malformed seed");
  const state = new Uint32Array(buffer);
  return () => {
    const t = state[1] << 9;
    let r = state[1] * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    state[2] ^= state[0];
    state[3] ^= state[1];
    state[1] ^= state[2];
    state[0] ^= state[3];
    state[2] ^= t;
    state[3] = (state[3] << 11) | (state[3] >>> 21);
    return (r >>> 0) / 4294967296;
  };
}

export const randInt = (min: number, max: number, prng: () => number) =>
  Math.floor(prng() * (max + 1 - min)) + min;

export function sampleByWeights<T>(
  weights: ArrayLike<[T, number]>,
  prng: () => number,
) {
  const accws: number[] = [];
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    const r = weights[i][1];
    accws.push((accws.at(-1) ?? 0) + r);
    sum += r;
  }
  const v = prng() * sum;
  for (let i = 0; i < weights.length; i++) {
    if (v < accws[i]) return weights[i][0];
  }
  return weights[0]?.[0];
}

export const sampleIndex = (
  array: { length: number },
  prng: () => number,
): number => {
  return randInt(0, array.length - 1, prng);
};

export const sample = <T>(array: ArrayLike<T>, prng: () => number): T => {
  return array[randInt(0, array.length - 1, prng)];
};

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
// ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
// ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
//   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ

export function sampleHangul(prng: () => number) {
  const cheot = sampleByWeights(
    [
      /* ㄱ */ [0, 2],
      /* ㄲ */ [1, 0],
      /* ㄴ */ [2, 1],
      /* ㄷ */ [3, 1],
      /* ㄸ */ [4, 0],
      /* ㄹ */ [5, 1],
      /* ㅁ */ [6, 1],
      /* ㅂ */ [7, 1],
      /* ㅃ */ [8, 0],
      /* ㅅ */ [9, 1],
      /* ㅆ */ [10, 0],
      /* ㅇ */ [11, 1],
      /* ㅈ */ [12, 1],
      /* ㅉ */ [13, 0],
      /* ㅊ */ [14, 0.5],
      /* ㅋ */ [15, 0.5],
      /* ㅌ */ [16, 0.5],
      /* ㅍ */ [17, 0.5],
      /* ㅎ */ [18, 0.5],
    ],
    prng,
  );

  const ggeut = sampleByWeights(
    [
      /*    */ [0, 7],
      /* ㄱ */ [1, 1],
      /* ㄲ */ [2, 0],
      /* ㄳ */ [3, 0],
      /* ㄴ */ [4, 1],
      /* ㄵ */ [5, 0],
      /* ㄶ */ [6, 0],
      /* ㄷ */ [7, 0],
      /* ㄹ */ [8, 1],
      /* ㄺ */ [9, 0],
      /* ㄻ */ [10, 0],
      /* ㄼ */ [11, 0],
      /* ㄽ */ [12, 0],
      /* ㄾ */ [13, 0],
      /* ㄿ */ [14, 0],
      /* ㅀ */ [15, 0],
      /* ㅁ */ [16, 1],
      /* ㅂ */ [17, 1],
      /* ㅄ */ [18, 0],
      /* ㅅ */ [19, 1],
      /* ㅆ */ [20, 0],
      /* ㅇ */ [21, 1],
      /* ㅈ */ [22, 0],
      /* ㅊ */ [23, 0],
      /* ㅋ */ [24, 0],
      /* ㅌ */ [25, 0],
      /* ㅍ */ [26, 0],
      /* ㅎ */ [27, 0],
    ],
    prng,
  );

  let ga: number;
  if (ggeut || cheot !== 11) {
    ga = sampleByWeights(
      [
        /* ㅏ */ [0, 1],
        /* ㅐ */ [1, 1],
        /* ㅑ */ [2, 0],
        /* ㅒ */ [3, 0],
        /* ㅓ */ [4, 1],
        /* ㅔ */ [5, 1],
        /* ㅕ */ [6, 0],
        /* ㅖ */ [7, 0],
        /* ㅗ */ [8, 1],
        /* ㅘ */ [9, 1],
        /* ㅙ */ [10, 0],
        /* ㅚ */ [11, 1],
        /* ㅛ */ [12, 0],
        /* ㅜ */ [13, 1],
        /* ㅝ */ [14, 0],
        /* ㅞ */ [15, 0],
        /* ㅟ */ [16, 0],
        /* ㅠ */ [17, 0],
        /* ㅡ */ [18, 1],
        /* ㅢ */ [19, 0],
        /* ㅣ */ [20, 1],
      ],
      prng,
    );
  } else {
    ga = sampleByWeights(
      [
        /* ㅏ */ [0, 1],
        /* ㅐ */ [1, 1],
        /* ㅑ */ [2, 1],
        /* ㅒ */ [3, 0],
        /* ㅓ */ [4, 1],
        /* ㅔ */ [5, 1],
        /* ㅕ */ [6, 1],
        /* ㅖ */ [7, 1],
        /* ㅗ */ [8, 1],
        /* ㅘ */ [9, 0.5],
        /* ㅙ */ [10, 1],
        /* ㅚ */ [11, 1],
        /* ㅛ */ [12, 1],
        /* ㅜ */ [13, 1],
        /* ㅝ */ [14, 0.5],
        /* ㅞ */ [15, 0.5],
        /* ㅟ */ [16, 0.5],
        /* ㅠ */ [17, 1],
        /* ㅡ */ [18, 1],
        /* ㅢ */ [19, 0],
        /* ㅣ */ [20, 1],
      ],
      prng,
    );
  }
  return String.fromCodePoint(0xac00 + cheot * 21 * 28 + ga * 28 + ggeut);
}

export const randomWord = (min: number, max: number, prng: () => number) => {
  const length = randInt(min, max, prng);
  return Array.from({ length }, () => sampleHangul(prng)).join("");
};

const ggeuts = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

export const getGgeut = (word: string) => {
  const lcp = word.codePointAt(word.length - 1);
  if (!lcp) return "";
  const i = (lcp - 0xac00) % 28;
  return i ? ggeuts[i - 1] : "";
};

export const appendEomi = (word: string, eomiExp?: string) => {
  if (!eomiExp) return word;
  let cddw = word;
  let cdde = eomiExp;
  const wordGgeut = getGgeut(word);
  const s = eomiExp.includes("/") ? eomiExp.split("/") : null;
  if (s) cdde = wordGgeut ? s[0] : s[1];

  const m = eomiExp.match(/(.*)\((.+)\)(.*)/);
  if (m) {
    const exc = eomiExp.startsWith("(으)") && wordGgeut === "ㄹ";
    cdde = wordGgeut && !exc ? `${m[1]}${m[2]}${m[3]}` : `${m[1]}${m[3]}`;
  }

  const ggeutAdder = ggeuts.indexOf(cdde[0]) + 1;
  if (!wordGgeut && ggeutAdder) {
    const lastCodePoint = word.codePointAt(word.length - 1) as number;
    const modifiedLast = String.fromCodePoint(lastCodePoint + ggeutAdder);
    cddw = `${word.substring(0, word.length - 1)}${modifiedLast}`;
    cdde = cdde.substring(1);
  }

  return `${cddw}${cdde}`;
};

export const randomWords = (
  min: number,
  max: number,
  prng: () => number,
  getEnding = () => sampleByWeights(endings, prng),
  getSuffix = () => sample(suffix, prng),
) => {
  const length = randInt(min, max, prng);
  return Array.from({ length }, (_, i) => {
    const word = randomWord(1, 3, prng);
    if (i === length - 1) return appendEomi(word, getEnding());
    return appendEomi(word, getSuffix());
  }).join(" ");
};

const str0 = () => "";

export type HutsoriType = "post" | "paragraph" | "name" | "speech";

export interface HutsoriOutput {
  title: string;
  cite?: string;
  body?: string[];
}

export const createHutosri = (type: string, seed: string) => {
  let title: string;
  const prng = xoshiro128ss(seed);
  if (type === "post") title = randomWords(2, 7, prng, str0);
  else if (type === "name") title = randomWords(2, 3, prng, str0, str0);
  else if (type === "speech")
    title = randomWords(2, 7, prng, () => sample(speechEndings, prng));
  else title = randomWords(2, 7, prng);

  return {
    title,
    ...((type === "paragraph" || type === "speech") && {
      cite: randomWords(2, 3, prng, str0, str0),
    }),
    ...(type === "post" && {
      body: Array.from({ length: 10 }, () => {
        return Array.from({ length: randInt(2, 4, prng) }, () =>
          randomWords(5, 20, prng),
        ).join(" ");
      }),
    }),
  };
};
