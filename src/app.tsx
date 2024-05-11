import { useCallback, useEffect, useState } from "react";
import { randInt, randomWord, randomWords } from "./hutsori";
import clsx from "clsx";

interface Output {
  title: string;
  cite?: string;
  body?: string[];
}

const str0 = () => "";

export default function App() {
  const [cursor, setCursor] = useState(-1);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [isPlaying, setPlaying] = useState(false);
  const [type, setType] = useState<"post" | "paragraph" | "name">("paragraph");

  const onPrevClick = () => {
    if (outputs.length + cursor <= 0) return;
    setCursor(cursor - 1);
  };
  const onNextClick = () => {
    if (cursor >= -1) return;
    setCursor(cursor + 1);
  };

  const generate = useCallback(() => {
    setCursor(-1);
    setOutputs((prev) => {
      let title: string;
      if (type === "post") title = randomWords(2, 5, str0);
      else if (type === "name") title = randomWords(2, 3, str0, str0);
      else title = randomWords(2, 7);

      return [
        ...prev,
        {
          title,
          ...(type === "paragraph" && {
            cite: randomWords(2, 3, str0, str0),
          }),
          ...(type === "post" && {
            body: Array.from({ length: 10 }, () => {
              return Array.from({ length: randInt(2, 4) }, () =>
                randomWords(5, 20),
              ).join(" ");
            }),
          }),
        },
      ];
    });
  }, [type]);

  const onSubmit = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      generate();
    },
    [generate],
  );

  const toggleAuto = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    if (!isPlaying) return;

    let timerId = window.setTimeout(function iterate() {
      generate();
      timerId = window.setTimeout(iterate, 1000);
    });

    return () => clearTimeout(timerId);
  }, [isPlaying, generate]);

  const output = outputs.at(cursor);
  return (
    <>
      <div className="hutsori-control">
        <h1>헛소리 제조기</h1>
        <form onSubmit={onSubmit}>
          <p>
            <label>
              생성 형태:{" "}
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
              >
                <option value="paragraph">문장 생성</option>
                <option value="name">이름 생성</option>
                <option value="post">글 생성</option>
              </select>
            </label>
          </p>
          <p>
            <button type="button" onClick={toggleAuto}>
              자동 생성 {isPlaying ? "정지" : "시작"}
            </button>{" "}
            <button type="submit">생성</button>
          </p>
        </form>
      </div>
      <div
        className={clsx("output-box", output?.body && "output-box--with-body")}
      >
        <h2>{output?.title}</h2>
        {output?.cite && <div className="citation">{output.cite}</div>}
        {output?.body && (
          <article>
            {output.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </article>
        )}
      </div>
      <div className="cursor-control">
        <button type="button" onClick={onPrevClick}>
          이전
        </button>{" "}
        {outputs.length + cursor + 1} / {outputs.length}{" "}
        <button type="button" onClick={onNextClick}>
          다음
        </button>{" "}
      </div>
    </>
  );
}
