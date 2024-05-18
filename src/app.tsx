import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import {
  HutsoriInput,
  HutsoriOutput,
  HutsoriType,
  createHutosri,
} from "./hutsori";
import { generateSeed } from "./random";

export default function App() {
  const [cursor, setCursor] = useState(-1);
  const [history, setHistory] = useState<HutsoriInput[]>([]);
  const [isPlaying, setPlaying] = useState(false);
  const [mode, setMode] = useState<"선비" | "오랑캐">("선비");
  const [type, setType] = useState<HutsoriType>("speech");
  const [isSeedFix, setSeedFix] = useState(false);
  const [fixedSeed, setFixedSeed] = useState("");

  const onPrevClick = () => {
    if (history.length + cursor <= 0) return;
    setCursor(cursor - 1);
  };
  const onNextClick = () => {
    if (cursor >= -1) return;
    setCursor(cursor + 1);
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setCursor(-1);
    const seed = isSeedFix ? fixedSeed ?? generateSeed() : generateSeed();
    setFixedSeed(seed);
    setHistory((prev) => [...prev, { type, mode, seed }]);
  };

  const toggleAuto = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    if (!isPlaying) return;
    setSeedFix(false);

    let timerId = window.setTimeout(function iterate() {
      setCursor(-1);
      const seed = generateSeed();
      setFixedSeed(seed);
      setHistory((prev) => [...prev, { type, mode, seed }]);
      timerId = window.setTimeout(iterate, 1000);
    });

    return () => clearTimeout(timerId);
  }, [isPlaying]);

  const shown = history.at(cursor);
  let output: HutsoriOutput | null = null;
  try {
    if (shown) output = createHutosri(shown);
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <div className="hutsori-control">
        <h1>헛소리 제조기</h1>
        <form onSubmit={onSubmit}>
          <p>
            <label>
              모드:{" "}
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
              >
                <option value="오랑캐">오랑캐</option>
                <option value="선비">선비</option>
              </select>
            </label>
          </p>
          <p>
            <label>
              생성 형태:{" "}
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
              >
                <option value="paragraph">문장 생성</option>
                <option value="speech">말 문장 생성</option>
                <option value="name">이름 생성</option>
                <option value="post">글 생성</option>
              </select>
            </label>
          </p>
          <p>
            <label>
              <input
                type="checkbox"
                checked={isSeedFix}
                onChange={(e) => setSeedFix(e.target.checked)}
              />
              시드 고정
            </label>
          </p>
          <p style={{ maxWidth: "100%" }}>
            <input
              type="text"
              value={isSeedFix ? fixedSeed : shown?.seed ?? ""}
              onChange={(e) => setFixedSeed(e.target.value)}
              readOnly={!isSeedFix}
              size={32}
              style={{ width: "100%", boxSizing: "border-box" }}
            />{" "}
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
        <div>{shown?.seed}</div>
        <button type="button" onClick={onPrevClick}>
          이전
        </button>{" "}
        {history.length + cursor + 1} / {history.length}{" "}
        <button type="button" onClick={onNextClick}>
          다음
        </button>{" "}
      </div>
    </>
  );
}
