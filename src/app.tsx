import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import {
  HutsoriOutput,
  HutsoriType,
  createHutosri,
  generateSeed,
} from "./hutsori";

type HistoryItem = { type: HutsoriType; seed: string };

export default function App() {
  const [cursor, setCursor] = useState(-1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPlaying, setPlaying] = useState(false);
  const [type, setType] = useState<HutsoriType>("paragraph");
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

  const generate = useCallback(() => {
    setCursor(-1);
    const seed = isSeedFix ? fixedSeed ?? generateSeed() : generateSeed();
    setFixedSeed(seed);
    setHistory((prev) => [...prev, { type, seed }]);
  }, [type, isSeedFix, fixedSeed]);

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

  const shown = history.at(cursor);
  let output: HutsoriOutput | null = null;
  try {
    if (shown) output = createHutosri(shown.type, shown.seed);
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
