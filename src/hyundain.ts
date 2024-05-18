import { sample } from "./random";

const store = { current: [] as (readonly [string, string])[] };
export const dictP = fetch("kr_korean.csv").then(async (res) => {
  const csv = await res.text();
  const rows = csv.split(/[\r\n]+/);
  const dict = rows.map((r) => {
    const [word, type] = r.split(",");
    return [word.replace(/\^/g, " ").replace(/-/g, ""), type] as const;
  });
  store.current = dict;
});

const possibleTypes = [
  "북한어",
  "",
  "방언",
  "명사",
  "인명",
  "수학",
  "법률",
  "전기",
  "경제",
  "컴퓨터",
  "역사",
  "생물",
  "농업",
  "음악",
  "관형사·명사",
  "물리",
  "건설",
  "화학",
  "공업",
  "의학",
  "교통",
  "군사",
  "수공",
  "명사·부사",
  "지명",
  "문학",
  "언어",
  "철학",
  "광업",
  "식물",
  "연영",
  "수산",
  "운동",
  "예술",
  "해양",
  "항공",
  "기독교",
  "민속",
  "정치",
  "심리",
  "지리",
  "미술",
  "사회",
  "교육",
  "논리",
  "가톨릭",
  "기계",
  "천문",
  "고적",
  "동물",
  "통신",
  "종교",
  "불교",
  "출판",
  "고유",
  "관형사",
  "약학",
  "수사·관형사",
  "한의학",
  "책명",
  "언론",
  "대명사",
  "대명사·감탄사",
  "감탄사·명사",
  "수사",
  "옛말",
  "수사·관형사·명사",
  "대명사·관형사",
];
export const randomWord = (prng: () => number) => {
  let result = "";
  while (!result) {
    const [word, type] = sample(prng, store.current);
    if (possibleTypes.includes(type)) result = word;
    // else if (word.endsWith("다")) result = word.slice(0, -1);
  }
  return result;
};
