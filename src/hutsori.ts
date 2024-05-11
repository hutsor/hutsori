export const preprocessEomi = (str: string) => {
  if (str.includes('/')) return str.split('/');
  const m = str.match(/(.*)\((.+)\)(.*)/);
  if (!m) return [str, str];
  return [`${m[1]}${m[2]}${m[3]}`, `${m[1]}${m[3]}`];
};

export const suffix = [
  '인',
  '한',
  '된',
  '이/가',
  '께서',
  '에서',
  '의',
  '을/를',
  '에',
  '에게',
  '께',
  '한테',
  '에서',
  '에게서',
  '한테서',
  '보다',
  '(으)로',
  '(으)로서',
  '(으)로써',
  '(이)고',
  '(이)라고',
  '과/와',
  '(이)랑',
  '같이',
  '처럼',
  '만큼',
  '만치',
  '하고',
  '(이)며',
  '에다',
  '에다가',
  '은/는',
  '도',
  '만',
  '(으)로부터',
  '까지',
  '마저',
  '조차',
  '일랑',
  '커녕',
  '인들',
  '엔들',
  '만',
  '마는',
  '뿐',
  '따라',
  '토록',
  '치고',
  '밖에',
  '인즉',
  '대로',
  '(이)나',
  '(이)란',
  '(이)든가',
  '(이)든지',
  '(이)나마',
  '(이)야',
  '(이)야말로',
].map(preprocessEomi);

export const endings = [
  '(이)다.',
  '(이)랴.',
  '일쏘냐.',
  '(이)라.',
  '이오./요.',
  '(이)여.',
].map(preprocessEomi);

export const wEndings = [80, 3, 1, 4, 6, 6];

export const speechEndings = [
  '(이)군.',
  '(이)네.',
  '(으)마.',
  '일걸.',
  '(이)게.',
  '(이)냐?',
  '(이)니?',
  '(이)련?',
  '(이)래?',
  '(이)람?',
  '이어요./여요.',
  '(이)옵니다.',
  '인가.',
  '입니다.',
  '아./야.',
].map(preprocessEomi);

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max + 1 - min)) + min;

function sampleIndexByWeights(weights: number[]) {
  const accws = weights.reduce<number[]>(
    (p, r) => [...p, (p.at(-1) ?? 0) + r],
    [],
  );
  const v = Math.random() * weights.reduce((a, b) => a + b);
  return accws.findIndex((w) => v < w);
}

export const sampleIndex = (array: { length: number }): number => {
  return randInt(0, array.length - 1);
};

export const sample = <T>(array: ArrayLike<T>): T => {
  return array[randInt(0, array.length - 1)];
};

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
// ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
// ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ

//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
//   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ

export function sampleHangul() {
  const cheot = sampleIndexByWeights([
    // ㄲㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ   ㅋ     ㅌ   ㅍ   ㅎ
    2, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0.5, 0.5, 0.5, 0.5, 0.5,
  ]);

  const ggeut = sampleIndexByWeights([
    // ㄱㄲ ㄳ ㄴ ㄵ ㄶ ㄷ ㄹ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅁ ㅂ ㅄ ㅅ ㅆ ㅇ ㅈ ㅊ
    7, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0,
    // ㅌㅍ ㅎ
    0, 0, 0, 0,
  ]);

  let ga: number;
  if (ggeut || cheot !== 11) {
    ga = sampleIndexByWeights([
      // ㅐ ㅑ ㅒㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
      1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1,
    ]);
  } else {
    ga = sampleIndexByWeights([
      // ㅐ ㅑ ㅒㅓ ㅔ ㅕ ㅖ ㅗ   ㅘ ㅙ ㅚ ㅛ ㅜ   ㅝ   ㅞ   ㅟ ㅠ ㅡ ㅢ ㅣ
      1, 1, 1, 0, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 0.5, 1, 1, 0, 1,
    ]);
  }
  return String.fromCodePoint(0xac00 + cheot * 21 * 28 + ga * 28 + ggeut);
}

export function sampleHanjaeo(_: unknown, i: number) {
  //  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
  // ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ
  const cheot = i
    ? sampleIndexByWeights([
        1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0.05, 0.05, 0.05, 0.05, 0.05,
      ])
    : sampleIndexByWeights([
        1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0.05, 0, 0, 0, 0.05,
      ]);

  //  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
  //   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ
  let ggeut = 0;

  ggeut = sampleIndexByWeights([
    // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
    6, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0,
    //   26 27
    0, 0, 0, 0,
  ]);

  //  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  // ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
  let ga: number;
  if (ggeut || cheot !== 11) {
    ga = sampleIndexByWeights([
      // ㅐ ㅑ ㅒㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
      1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    ]);
  } else {
    ga = sampleIndexByWeights([
      // ㅐ ㅑ ㅒㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
      1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1,
    ]);
  }

  return String.fromCodePoint(0xac00 + cheot * 21 * 28 + ga * 28 + ggeut);
}

export const randomWord = (min = 1, max = 3) => {
  const length = randInt(min, max);
  return Array.from({ length }, sampleHangul).join('');
};

export const randomWords = (
  min: number,
  max: number,
  getEnding = (j: number) => endings[sampleIndexByWeights(wEndings)][j],
  getSuffix = (j: number) => sample(suffix)[j],
) => {
  const length = randInt(min, max);
  return Array.from({ length }, (_, i) => {
    const word = randomWord();
    const lastChar = word.codePointAt(word.length - 1);
    if (!lastChar) return word;
    const j = (lastChar - 0xac00) % 28 !== 0 ? 0 : 1;
    if (i === length - 1) return `${word}${getEnding(j)}`;
    return `${word}${getSuffix(j)}`;
  }).join(' ');
};
