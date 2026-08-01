"use client";

import { useMemo, useState } from "react";
import type { StoryCard, StorySequenceData } from "@/data/content";
import { CheckIcon, DownIcon, LayersIcon, RotateIcon, UpIcon } from "@/components/Icons";
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
  story: StorySequenceData;
  completed: boolean;
  onComplete: () => void;
  onBackToUnit: () => void;
  onContinue: () => void;
  continueLabel: string;
};

const toneClasses: Record<StoryCard["tone"], string> = {
  warning: "bg-[#8a533c]",
  choice: "bg-[#8a533c]",
  stars: "bg-[#90742d]",
  light: "bg-[#90742d]",
  sky: "bg-[#447a8f]",
  earth: "bg-[#5b744b]",
  life: "bg-[#5b744b]",
  people: "bg-[#47796d]",
  garden: "bg-[#5b744b]",
  rest: "bg-[#4e596b]",
  mercy: "bg-[#796a8f]",
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
    <div className={cx(activityShell, "bg-[linear-gradient(180deg,#fff2d6_0,#edf4e7_48%,#dfece6_100%)]")}>
      <CreationBackdrop variant="sequence" imageSource={story.backdropImage} />
      <header className={activityHeader}>
        <button className={textButton} onClick={onBackToUnit}>← Back to unit</button>
        <span className={activityKind}><LayersIcon size={16} /> Story sequence</span>
      </header>

      <main className={activityMain}>
        <div className={activityIntro}>
          <p className={eyebrow}>{story.reference}</p>
          <h1 className={activityIntroTitle}>{story.prompt}</h1>
          <p className="mb-0 leading-[1.6] text-muted">Move each scene until the story reads from beginning to end.</p>
        </div>

        <div className="mb-[11px] flex items-center justify-between text-[11px] text-muted">
          <span>{cards.length} story moments</span>
          <button className={iconTextButton} onClick={() => { setCards(shuffle(story.cards)); setStatus("idle"); }} disabled={status === "right"}><RotateIcon size={15} /> Shuffle</button>
        </div>

        <ol className="m-0 grid list-none gap-2.5 p-0">
          {cards.map((card, index) => (
            <li
              className={cx(
                "sequence-card grid min-h-[105px] grid-cols-[34px_65px_1fr_auto] items-center gap-3.5 rounded-[17px] border border-line bg-[#fffdf8e8] px-3.5 py-[13px] shadow-[0_12px_35px_#19362e10]",
                "[&:nth-child(4n+1)]:border-l-[5px] [&:nth-child(4n+1)]:border-l-[#e6b945] [&:nth-child(4n+2)]:border-l-[5px] [&:nth-child(4n+2)]:border-l-[#64a3b7]",
                "[&:nth-child(4n+3)]:border-l-[5px] [&:nth-child(4n+3)]:border-l-[#70a85c] [&:nth-child(4n)]:border-l-[5px] [&:nth-child(4n)]:border-l-[#b1788d]",
                "max-[560px]:grid-cols-[28px_51px_1fr_auto] max-[560px]:gap-2 max-[560px]:px-2 max-[560px]:py-2.5",
                status === "right" && "border-[#a9c6b9] bg-[#f7fbf8]",
              )}
              key={card.id}
            >
              <span className="grid size-[27px] place-items-center rounded-full bg-[#dcebe2] text-[10px] font-extrabold text-[#31584d]">{index + 1}</span>
              <div className={cx("grid h-[70px] w-[62px] place-items-center rounded-[14px] font-display text-[29px] font-medium text-white max-[560px]:h-[59px] max-[560px]:w-[49px]", toneClasses[card.tone])}>{card.symbol}</div>
              <div>
                <span className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#7d8984]">{card.eyebrow}</span>
                <h3 className="my-[3px] font-display text-[19px] font-medium max-[560px]:text-base">{card.title}</h3>
                <p className="m-0 text-[10px] leading-[1.45] text-muted max-[560px]:hidden">{card.description}</p>
              </div>
              <div className="grid gap-[5px]">
                <button className="grid size-11 min-w-11 cursor-pointer place-items-center rounded-[9px] border border-[#d2d5cf] bg-white disabled:opacity-25" onClick={() => move(index, -1)} disabled={index === 0 || status === "right"} aria-label={`Move ${card.title} earlier`}><UpIcon size={17} /></button>
                <button className="grid size-11 min-w-11 cursor-pointer place-items-center rounded-[9px] border border-[#d2d5cf] bg-white disabled:opacity-25" onClick={() => move(index, 1)} disabled={index === cards.length - 1 || status === "right"} aria-label={`Move ${card.title} later`}><DownIcon size={17} /></button>
              </div>
            </li>
          ))}
        </ol>

        {status === "wrong" && <div className={cx(activityMessage, "flex-col items-start gap-1 border-[#dda89f] bg-[#fae7e3] text-[#7d352c]")} role="alert"><strong>Not quite yet.</strong><span>Look for what God creates first and what comes after.</span></div>}
        {status === "right" && <div className={cx(activityMessage, "border-[#91bda7] bg-[#e2f3e7] text-[#15533f]")} role="status"><CheckIcon size={26} /><div className="grid"><strong>The whole story is in place!</strong><span>{story.title} is complete.</span></div></div>}

        <div className={cx(activityActions, status === "right" && completionActions)}>
          {status === "right" ? (
            <>
              <button className={cx("secondary-button", secondaryButton)} onClick={onBackToUnit}>← Back to unit</button>
              <button className={cx("primary-button", primaryButton)} onClick={onContinue}>{continueLabel}</button>
            </>
          ) : (
            <button className={cx("primary-button", primaryButton)} onClick={check}>Check my sequence</button>
          )}
        </div>
      </main>
    </div>
  );
}
