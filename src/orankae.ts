import { randInt, randNorm, sampleByWeights } from "./random";

export function sampleHangul(prng: () => number) {
  const cheot = sampleByWeights(prng, [
    /* ㄱ */ [0, 1],
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
    /* ㅊ */ [14, 1],
    /* ㅋ */ [15, 1],
    /* ㅌ */ [16, 1],
    /* ㅍ */ [17, 1],
    /* ㅎ */ [18, 1],
  ]);

  const ggeut = sampleByWeights(prng, [
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
  ]);

  let ga: number;
  if (cheot === 11 && !ggeut) {
    ga = randInt(prng, 0, 20);
  } else {
    ga = sampleByWeights(prng, [
      /* ㅏ */ [0, 1],
      /* ㅐ */ [1, 1],
      /* ㅑ */ [2, 0],
      /* ㅒ */ [3, 0],
      /* ㅓ */ [4, 1],
      /* ㅔ */ [5, 1],
      /* ㅕ */ [6, 0],
      /* ㅖ */ [7, 0],
      /* ㅗ */ [8, 1],
      /* ㅘ */ [9, 0],
      /* ㅙ */ [10, 0],
      /* ㅚ */ [11, 0],
      /* ㅛ */ [12, 0],
      /* ㅜ */ [13, 1],
      /* ㅝ */ [14, 0],
      /* ㅞ */ [15, 0],
      /* ㅟ */ [16, 0],
      /* ㅠ */ [17, 0],
      /* ㅡ */ [18, 1],
      /* ㅢ */ [19, 0],
      /* ㅣ */ [20, 1],
    ]);
  }
  return String.fromCodePoint(0xac00 + cheot * 21 * 28 + ga * 28 + ggeut);
}

export const randomOrankaeWord = (prng: () => number) => {
  const length = Math.min(Math.max(1, Math.round(randNorm(prng, 2, 2))), 5);
  return Array.from({ length }, () => sampleHangul(prng)).join("");
};
