"use client";

import { useMemo, useState } from "react";
import type { StoryCard, StorySequenceData } from "@/data/content";
import { CheckIcon, DownIcon, LayersIcon, RotateIcon, UpIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";

type Props = {
  story: StorySequenceData;
  completed: boolean;
  onComplete: () => void;
  onBackToUnit: () => void;
  onContinue: () => void;
  continueLabel: string;
};

function shuffle(cards: StoryCard[]) {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapWith]] = [result[swapWith], result[index]];
  }
  if (result.every((card, index) => card.id === cards[index].id)) result.reverse();
  return result;
}

export function StorySequence({ story, completed, onComplete, onBackToUnit, onContinue, continueLabel }: Props) {
  const initial = useMemo(() => completed ? [...story.cards] : shuffle(story.cards), [completed, story]);
  const [cards, setCards] = useState(initial);
  const [status, setStatus] = useState<"idle" | "wrong" | "right">(completed ? "right" : "idle");

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= cards.length || status === "right") return;
    setCards((items) => {
      const next = [...items];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setStatus("idle");
  }

  function check() {
    const correct = cards.every((card, index) => card.id === story.cards[index].id);
    if (correct) {
      setStatus("right");
      onComplete();
    } else {
      setStatus("wrong");
    }
  }

  return (
    <div className="activity-shell sequence-theme">
      <CreationBackdrop variant="sequence" imageSource={story.backdropImage} />
      <header className="activity-header">
        <button className="text-button" onClick={onBackToUnit}>← Back to unit</button>
        <span className="activity-kind"><LayersIcon size={16} /> Story sequence</span>
      </header>

      <main className="activity-main story-activity">
        <div className="activity-intro">
          <p className="eyebrow">{story.reference}</p>
          <h1>{story.prompt}</h1>
          <p>Move each scene until the story reads from beginning to end.</p>
        </div>

        <div className="sequence-toolbar">
          <span>{cards.length} story moments</span>
          <button className="icon-text-button" onClick={() => { setCards(shuffle(story.cards)); setStatus("idle"); }} disabled={status === "right"}><RotateIcon size={15} /> Shuffle</button>
        </div>

        <ol className={`sequence-list ${status}`}>
          {cards.map((card, index) => (
            <li className="sequence-card" key={card.id}>
              <span className="sequence-position">{index + 1}</span>
              <div className={`story-symbol tone-${card.tone}`}>{card.symbol}</div>
              <div className="sequence-copy"><span>{card.eyebrow}</span><h3>{card.title}</h3><p>{card.description}</p></div>
              <div className="reorder-controls">
                <button onClick={() => move(index, -1)} disabled={index === 0 || status === "right"} aria-label={`Move ${card.title} earlier`}><UpIcon size={17} /></button>
                <button onClick={() => move(index, 1)} disabled={index === cards.length - 1 || status === "right"} aria-label={`Move ${card.title} later`}><DownIcon size={17} /></button>
              </div>
            </li>
          ))}
        </ol>

        {status === "wrong" && <div className="activity-message error" role="alert"><strong>Not quite yet.</strong><span>Look for what God creates first and what comes after.</span></div>}
        {status === "right" && <div className="activity-message success" role="status"><CheckIcon size={26} /><div><strong>The whole story is in place!</strong><span>{story.title} is complete.</span></div></div>}

        <div className={`activity-actions ${status === "right" ? "completion-actions" : ""}`}>
          {status === "right" ? <><button className="secondary-button" onClick={onBackToUnit}>← Back to unit</button><button className="primary-button" onClick={onContinue}>{continueLabel}</button></> : <button className="primary-button" onClick={check}>Check my sequence</button>}
        </div>
      </main>
    </div>
  );
}
