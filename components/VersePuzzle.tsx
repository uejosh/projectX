"use client";

import { useMemo, useState } from "react";
import type { VersePuzzleData } from "@/data/content";
import { CheckIcon, PuzzleIcon, RotateIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";
import {
  activityActions,
  activityHeader,
  activityIntro,
  activityIntroTitle,
  activityKind,
  activityMain,
  activityMessage,
  activityShell,
  completionActions,
  cx,
  eyebrow,
  iconTextButton,
  primaryButton,
  secondaryButton,
  textButton,
} from "@/lib/styles";

type Props = {
  puzzle: VersePuzzleData;
  completed: boolean;
  onComplete: () => void;
  onBackToUnit: () => void;
  onContinue: () => void;
  continueLabel: string;
};

type Piece = { key: string; text: string };

function orderedPieces(puzzle: VersePuzzleData): Piece[] {
  return puzzle.pieces.map((text, index) => ({ key: `${puzzle.id}-${index}`, text }));
}

function shuffledPieces(puzzle: VersePuzzleData): Piece[] {
  const pieces = orderedPieces(puzzle);
  for (let index = pieces.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [pieces[index], pieces[swapWith]] = [pieces[swapWith], pieces[index]];
  }
  if (pieces.every((piece, index) => piece.text === puzzle.pieces[index])) pieces.reverse();
  return pieces;
}

export function VersePuzzle({ puzzle, completed, onComplete, onBackToUnit, onContinue, continueLabel }: Props) {
  const initial = useMemo(() => shuffledPieces(puzzle), [puzzle]);
  const completedAnswer = useMemo(() => orderedPieces(puzzle), [puzzle]);
  const [bank, setBank] = useState<Piece[]>(completed ? [] : initial);
  const [answer, setAnswer] = useState<Piece[]>(completed ? completedAnswer : []);
  const [status, setStatus] = useState<"idle" | "wrong" | "right">(completed ? "right" : "idle");

  function choose(piece: Piece) {
    if (status === "right") return;
    setBank((items) => items.filter((item) => item.key !== piece.key));
    setAnswer((items) => [...items, piece]);
    setStatus("idle");
  }

  function remove(piece: Piece) {
    if (status === "right") return;
    setAnswer((items) => items.filter((item) => item.key !== piece.key));
    setBank((items) => [...items, piece]);
    setStatus("idle");
  }

  function reset() {
    setBank(shuffledPieces(puzzle));
    setAnswer([]);
    setStatus("idle");
  }

  function check() {
    const isCorrect = answer.every((piece, index) => piece.text === puzzle.pieces[index]);
    if (answer.length === puzzle.pieces.length && isCorrect) {
      setStatus("right");
      onComplete();
    } else {
      setStatus("wrong");
    }
  }

  const boardClass = cx(
    "answer-board min-h-40 rounded-[20px] border border-line bg-paper p-[22px] shadow-[0_14px_40px_#19362e12] max-[560px]:p-[17px]",
    status === "wrong" && "border-[#d79e94]",
    status === "right" && "border-[#72a18f] bg-[#f4faf6]",
  );
  const chipClass = cx(
    "min-h-[45px] cursor-pointer rounded-xl border border-[#d0d3cb] bg-[#fffefa] px-[15px] py-2.5 font-display text-base font-medium",
    "shadow-[0_3px_0_#d7d5cc] transition hover:-translate-y-px hover:border-[#759c8f]",
  );

  return (
    <div className={activityShell}>
      <CreationBackdrop variant="verse" />
      <header className={activityHeader}>
        <button className={textButton} onClick={onBackToUnit}>← Back to unit</button>
        <span className={activityKind}><PuzzleIcon size={16} /> Verse order</span>
      </header>

      <main className={activityMain}>
        <div className={activityIntro}>
          <p className={eyebrow}>{puzzle.reference}</p>
          <h1 className={activityIntroTitle}>{puzzle.prompt}</h1>
          <p className="mb-0 leading-[1.6] text-muted">Tap the phrases in the order they belong. Tap an answer phrase to return it.</p>
        </div>

        <section className={boardClass} aria-labelledby="answer-title">
          <div className="mb-[18px] flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#6b7b75]">
            <span id="answer-title">Your verse</span>
            <span>{answer.length}/{puzzle.pieces.length}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5" aria-live="polite">
            {answer.length === 0 && <p className="w-full py-[25px] text-center font-display text-[17px] italic text-[#a3aaa7]">Your first phrase goes here…</p>}
            {answer.map((piece, index) => (
              <button
                key={piece.key}
                className={cx(chipClass, "inline-flex items-center gap-2 border-[#a8c3b8] bg-[#eff6f1] shadow-none")}
                onClick={() => remove(piece)}
                aria-label={`Remove phrase ${index + 1}: ${piece.text}`}
              >
                <span className="grid size-5 place-items-center rounded-full bg-forest font-sans text-[9px] font-bold text-white">{index + 1}</span>
                {piece.text}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[20px] border border-transparent bg-[#ebe8de] p-[22px] max-[560px]:p-[17px]" aria-labelledby="pieces-title">
          <div className="mb-[18px] flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#6b7b75]">
            <span id="pieces-title">Available phrases</span>
            <button className={cx(iconTextButton, "p-0.5 text-[10px] normal-case tracking-normal")} onClick={reset}><RotateIcon size={15} /> Shuffle</button>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {bank.map((piece) => <button key={piece.key} className={chipClass} onClick={() => choose(piece)}>{piece.text}</button>)}
          </div>
        </section>

        {status === "wrong" && <div className={cx(activityMessage, "flex-col items-start gap-1 border-[#dda89f] bg-[#fae7e3] text-[#7d352c]")} role="alert"><strong>Nearly there.</strong><span>The phrases are all useful—try a different order.</span></div>}
        {status === "right" && <div className={cx(activityMessage, "border-[#91bda7] bg-[#e2f3e7] text-[#15533f]")} role="status"><CheckIcon size={26} /><div className="grid"><strong>Beautifully remembered!</strong><span>{puzzle.reference} is complete.</span></div></div>}

        <div className={cx(activityActions, status === "right" && completionActions)}>
          {status === "right" ? (
            <>
              <button className={cx("secondary-button", secondaryButton)} onClick={onBackToUnit}>← Back to unit</button>
              <button className={cx("primary-button", primaryButton)} onClick={onContinue}>{continueLabel}</button>
            </>
          ) : (
            <button className={cx("primary-button", primaryButton)} onClick={check} disabled={answer.length !== puzzle.pieces.length}>Check my order</button>
          )}
        </div>
      </main>
    </div>
  );
}
