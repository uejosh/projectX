"use client";

import { useMemo, useState } from "react";
import type { VersePuzzleData } from "@/data/content";
import { CheckIcon, PuzzleIcon, RotateIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";

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

  return (
    <div className="activity-shell verse-theme">
      <CreationBackdrop variant="verse" />
      <header className="activity-header">
        <button className="text-button" onClick={onBackToUnit}>← Back to unit</button>
        <span className="activity-kind"><PuzzleIcon size={16} /> Verse order</span>
      </header>

      <main className="activity-main">
        <div className="activity-intro">
          <p className="eyebrow">{puzzle.reference}</p>
          <h1>{puzzle.prompt}</h1>
          <p>Tap the phrases in the order they belong. Tap an answer phrase to return it.</p>
        </div>

        <section className={`answer-board ${status}`} aria-labelledby="answer-title">
          <div className="board-label"><span id="answer-title">Your verse</span><span>{answer.length}/{puzzle.pieces.length}</span></div>
          <div className="answer-flow" aria-live="polite">
            {answer.length === 0 && <p className="empty-answer">Your first phrase goes here…</p>}
            {answer.map((piece, index) => (
              <button key={piece.key} className="phrase-chip chosen" onClick={() => remove(piece)} aria-label={`Remove phrase ${index + 1}: ${piece.text}`}>
                <span className="chip-index">{index + 1}</span>{piece.text}
              </button>
            ))}
          </div>
        </section>

        <section className="piece-bank" aria-labelledby="pieces-title">
          <div className="board-label"><span id="pieces-title">Available phrases</span><button className="icon-text-button" onClick={reset}><RotateIcon size={15} /> Shuffle</button></div>
          <div className="piece-grid">
            {bank.map((piece) => <button key={piece.key} className="phrase-chip" onClick={() => choose(piece)}>{piece.text}</button>)}
          </div>
        </section>

        {status === "wrong" && <div className="activity-message error" role="alert"><strong>Nearly there.</strong><span>The phrases are all useful—try a different order.</span></div>}
        {status === "right" && <div className="activity-message success" role="status"><CheckIcon size={26} /><div><strong>Beautifully remembered!</strong><span>{puzzle.reference} is complete.</span></div></div>}

        <div className={`activity-actions ${status === "right" ? "completion-actions" : ""}`}>
          {status === "right" ? <><button className="secondary-button" onClick={onBackToUnit}>← Back to unit</button><button className="primary-button" onClick={onContinue}>{continueLabel}</button></> : <button className="primary-button" onClick={check} disabled={answer.length !== puzzle.pieces.length}>Check my order</button>}
        </div>
      </main>
    </div>
  );
}
