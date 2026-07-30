"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Ripple } from "@/components/canvasui/Ripple";
import { CheckIcon, LayersIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";
import { classificationOptions, isClassificationAnswer, type ClassificationCategory, type PassageClassificationData } from "@/data/content";
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
  primaryButton,
  replayNote,
  secondaryButton,
  textButton,
} from "@/lib/styles";

type Props = {
  quest: PassageClassificationData;
  completed: boolean;
  onComplete: () => void;
  onBackToUnit: () => void;
  onContinue: () => void;
  continueLabel: string;
};

type Status = "idle" | "wrong" | "right";

export function PassageClassification({ quest, completed, onComplete, onBackToUnit, onContinue, continueLabel }: Props) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [wasCompleted] = useState(completed);
  const [roundIndex, setRoundIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<ClassificationCategory | null>(null);
  const round = quest.rounds[roundIndex];
  const isLastRound = roundIndex === quest.rounds.length - 1;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".classification-passage, .classification-option", {
      opacity: 0,
      y: 18,
      duration: 0.5,
      stagger: 0.055,
      ease: "power3.out",
      clearProps: "opacity,transform",
    });
  }, { dependencies: [roundIndex], scope: scopeRef, revertOnUpdate: true });

  useGSAP(() => {
    if (status !== "wrong" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".classification-options", { x: -7 }, { x: 7, duration: 0.07, repeat: 5, yoyo: true, clearProps: "transform" });
  }, { dependencies: [status, selected], scope: scopeRef });

  useEffect(() => {
    if (roundIndex > 0) headingRef.current?.focus();
  }, [roundIndex]);

  function choose(category: ClassificationCategory) {
    if (status === "right") return;
    setSelected(category);
    const correct = isClassificationAnswer(round, category);
    setStatus(correct ? "right" : "wrong");
    if (correct && isLastRound) onComplete();
  }

  function nextRound() {
    setRoundIndex((index) => index + 1);
    setSelected(null);
    setStatus("idle");
  }

  return (
    <div className={cx(activityShell, "bg-[linear-gradient(180deg,#fbf1d8_0,#e9f1e6_50%,#dbeae2_100%)]")} ref={scopeRef}>
      <CreationBackdrop variant="classification" imageSource="/images/genesis/eden-trees-close.webp" />
      <header className={activityHeader}>
        <button className={textButton} onClick={onBackToUnit}>← Back to unit</button>
        <span className={activityKind}><LayersIcon size={16} /> Passage meaning</span>
      </header>

      <main className={cx(activityMain, "max-w-[860px]")}>
        <div className={activityIntro}>
          <p className={eyebrow}>Promise or Instruction · {roundIndex + 1} of {quest.rounds.length}</p>
          <h1 className={activityIntroTitle} ref={headingRef} tabIndex={-1}>{quest.prompt}</h1>
          <p className="mb-0 leading-[1.6] text-muted">Read carefully, then choose the kind of passage you see.</p>
        </div>

        <Ripple className="mb-7 overflow-hidden rounded-[25px] shadow-[0_20px_50px_#173d321a]" amplitude={0.22} speed={0.5} wavelength={82} rings={2} decay={1.3} refraction={35} dispersion={0.16} shine={0.45} trigger="click" interval={5}>
          <section className="classification-passage grid min-h-[245px] place-content-center bg-[linear-gradient(135deg,#173e36e8,#245f52dd),radial-gradient(circle_at_20%_20%,#f4d16a44,transparent_45%)] px-[50px] py-[38px] text-center text-white max-[560px]:min-h-[235px] max-[560px]:px-5 max-[560px]:py-7" aria-labelledby="passage-reference">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#f6d77e]" id="passage-reference">{round.reference}</span>
            <blockquote className="mx-auto mb-0 mt-[18px] max-w-[710px] font-display text-[clamp(23px,3vw,34px)] font-medium leading-[1.45] max-[560px]:text-2xl">“{round.passage}”</blockquote>
          </section>
        </Ripple>

        <div className="classification-options grid grid-cols-5 gap-2.5 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2 max-[360px]:grid-cols-1 [&>*:last-child]:max-[560px]:col-span-2 [&>*:last-child]:max-[360px]:col-auto" aria-label="Passage categories">
          {classificationOptions(round).map((category) => {
            const chosen = selected === category;
            const correct = status === "right" && category === round.answer;
            return (
              <button
                key={category}
                className={cx(
                  "classification-option flex min-h-[58px] cursor-pointer items-center justify-center gap-[7px] rounded-[15px] border border-[#cbd5ce] bg-[#fffdf8] px-3 py-[9px] text-xs font-extrabold transition-all duration-200",
                  "enabled:hover:-translate-y-0.5 enabled:hover:border-[#557c6e] enabled:hover:shadow-[0_10px_22px_#12382d18] disabled:cursor-default disabled:opacity-62 max-[560px]:min-h-[54px]",
                  chosen && "-translate-y-0.5 border-[#557c6e] bg-[#e4eee8] shadow-[0_10px_22px_#12382d18]",
                  correct && "border-[#276f5f] bg-[#276f5f] text-white disabled:opacity-100",
                )}
                onClick={() => choose(category)}
                disabled={status === "right"}
                aria-pressed={chosen}
              >
                <span>{category}</span>
                {correct && <CheckIcon size={19} />}
              </button>
            );
          })}
        </div>

        <div className="min-h-[102px]" aria-live="polite">
          {status === "wrong" && <div className={cx(activityMessage, "flex-col items-start gap-1 border-[#dda89f] bg-[#fae7e3] text-[#7d352c]")}><strong>Look again.</strong><span>Think about what the words ask, promise, describe, or warn will happen.</span></div>}
          {status === "right" && <div className={cx(activityMessage, "border-[#91bda7] bg-[#e2f3e7] text-[#15533f]")}><CheckIcon size={26} /><div className="grid"><strong>{round.answer} is right.</strong><span>{round.explanation}</span></div></div>}
        </div>

        <div className={cx(activityActions, status === "right" && isLastRound && completionActions)}>
          {status === "right" && !isLastRound && <button className={cx("primary-button", primaryButton)} onClick={nextRound}>Next passage</button>}
          {status === "right" && isLastRound && (
            <>
              <button className={cx("secondary-button", secondaryButton)} onClick={onBackToUnit}>← Back to unit</button>
              <button className={cx("primary-button", primaryButton)} onClick={onContinue}>{continueLabel}</button>
            </>
          )}
        </div>
        {wasCompleted && <p className={replayNote}>You already earned this quest’s coin. Replays are just for practice.</p>}
      </main>
    </div>
  );
}
