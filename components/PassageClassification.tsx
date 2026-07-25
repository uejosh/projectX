"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Ripple } from "@/components/canvasui/Ripple";
import { CheckIcon, LayersIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";
import { isClassificationAnswer, type ClassificationCategory, type PassageClassificationData } from "@/data/content";

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
      clearProps: "transform",
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
    <div className="activity-shell classification-theme" ref={scopeRef}>
      <CreationBackdrop variant="classification" />
      <header className="activity-header">
        <button className="text-button" onClick={onBackToUnit}>← Back to unit</button>
        <span className="activity-kind"><LayersIcon size={16} /> Passage meaning</span>
      </header>

      <main className="activity-main classification-activity">
        <div className="activity-intro">
          <p className="eyebrow">Promise or Instruction · {roundIndex + 1} of {quest.rounds.length}</p>
          <h1 ref={headingRef} tabIndex={-1}>{quest.prompt}</h1>
          <p>Read carefully, then choose the kind of passage you see.</p>
        </div>

        <Ripple className="classification-ripple" amplitude={0.22} speed={0.5} wavelength={82} rings={2} decay={1.3} refraction={35} dispersion={0.16} shine={0.45} trigger="click" interval={5}>
          <section className="classification-passage" aria-labelledby="passage-reference">
            <span id="passage-reference">{round.reference}</span>
            <blockquote>“{round.passage}”</blockquote>
          </section>
        </Ripple>

        <div className="classification-options" aria-label="Passage categories">
          {round.allowedCategories.map((category) => {
            const chosen = selected === category;
            const correct = status === "right" && category === round.answer;
            return (
              <button
                key={category}
                className={`classification-option ${chosen ? "selected" : ""} ${correct ? "correct" : ""}`}
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

        <div className="classification-feedback" aria-live="polite">
          {status === "wrong" && <div className="activity-message error"><strong>Look again.</strong><span>Think about what the words ask, promise, describe, or warn will happen.</span></div>}
          {status === "right" && <div className="activity-message success"><CheckIcon size={26} /><div><strong>{round.answer} is right.</strong><span>{round.explanation}</span></div></div>}
        </div>

        <div className={`activity-actions ${status === "right" && isLastRound ? "completion-actions" : ""}`}>
          {status === "right" && !isLastRound && <button className="primary-button" onClick={nextRound}>Next passage</button>}
          {status === "right" && isLastRound && <><button className="secondary-button" onClick={onBackToUnit}>← Back to unit</button><button className="primary-button" onClick={onContinue}>{continueLabel}</button></>}
        </div>
        {wasCompleted && <p className="replay-note">You already earned this quest’s coin. Replays are just for practice.</p>}
      </main>
    </div>
  );
}
