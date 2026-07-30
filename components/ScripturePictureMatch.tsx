"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Ripple } from "@/components/canvasui/Ripple";
import { CheckIcon, PuzzleIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";
import { scorePictureMatches, type PictureMatchData } from "@/data/content";
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
  quest: PictureMatchData;
  completed: boolean;
  onComplete: () => void;
  onBackToUnit: () => void;
  onContinue: () => void;
  continueLabel: string;
};

type Pairings = Record<string, string>;
type CheckState = Record<string, "right" | "wrong">;

function solvedPairs(quest: PictureMatchData): Pairings {
  return Object.fromEntries(quest.pairs.map((pair) => [pair.id, pair.id]));
}

export function ScripturePictureMatch({ quest, completed, onComplete, onBackToUnit, onContinue, continueLabel }: Props) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [wasCompleted] = useState(completed);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [pairings, setPairings] = useState<Pairings>(completed ? solvedPairs(quest) : {});
  const [checks, setChecks] = useState<CheckState>(completed ? Object.fromEntries(quest.pairs.map((pair) => [pair.id, "right"])) : {});
  const [complete, setComplete] = useState(completed);
  const references = [...quest.pairs].reverse();

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".picture-card, .reference-card", {
      opacity: 0,
      y: 24,
      scale: 0.97,
      duration: 0.55,
      stagger: 0.07,
      ease: "power3.out",
      clearProps: "opacity,transform",
    });
  }, { scope: scopeRef });

  useGSAP(() => {
    if (!Object.values(checks).includes("wrong") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".picture-card.needs-work", { x: -6 }, { x: 6, duration: 0.08, repeat: 5, yoyo: true, clearProps: "transform" });
  }, { dependencies: [checks], scope: scopeRef });

  function assignPair(pictureId: string, referenceId: string) {
    setPairings((current) => {
      const next = Object.fromEntries(Object.entries(current).filter(([, value]) => value !== referenceId));
      next[pictureId] = referenceId;
      return next;
    });
    setChecks({});
  }

  function choosePicture(id: string) {
    if (complete) return;
    if (selectedReference) {
      assignPair(id, selectedReference);
      setSelectedPicture(null);
      setSelectedReference(null);
      return;
    }
    setSelectedPicture(id === selectedPicture ? null : id);
  }

  function chooseReference(referenceId: string) {
    if (complete) return;
    if (selectedPicture) {
      assignPair(selectedPicture, referenceId);
      setSelectedPicture(null);
      setSelectedReference(null);
      return;
    }
    setSelectedReference(referenceId === selectedReference ? null : referenceId);
  }

  function checkMatches() {
    const scored = scorePictureMatches(quest, pairings);
    const nextChecks = Object.fromEntries(scored.map((pair) => [pair.id, pair.correct ? "right" : "wrong"])) as CheckState;
    setChecks(nextChecks);
    const allRight = scored.every((pair) => pair.correct);
    if (allRight) {
      setComplete(true);
      onComplete();
    }
  }

  const assignedCount = Object.keys(pairings).length;

  return (
    <div className={cx(activityShell, "bg-[linear-gradient(180deg,#e9f5f5_0,#f8f1df_55%,#e4eee2_100%)]")} ref={scopeRef}>
      <CreationBackdrop variant="picture-match" imageSource="/images/genesis/creation-stars.webp" />
      <header className={activityHeader}>
        <button className={textButton} onClick={onBackToUnit}>← Back to unit</button>
        <span className={activityKind}><PuzzleIcon size={16} /> Picture match</span>
      </header>

      <main className={cx(activityMain, "max-w-[1060px]")}>
        <div className={activityIntro}>
          <p className={eyebrow}>Three scenes · three passages</p>
          <h1 className={activityIntroTitle}>{quest.prompt}</h1>
          <p className="mb-0 leading-[1.6] text-muted">Select a picture or a passage first, then choose its match. You can change any pair before checking.</p>
        </div>

        <section className="mb-6 grid grid-cols-3 gap-[15px] max-[720px]:grid-cols-1 max-[720px]:gap-[18px]" aria-label="Picture cards">
          {quest.pairs.map((pair, index) => {
            const selected = selectedPicture === pair.id;
            const pairedReference = quest.pairs.find((item) => item.id === pairings[pair.id]);
            const check = checks[pair.id];
            return (
              <button
                key={pair.id}
                className={cx(
                  "picture-card relative cursor-pointer overflow-hidden rounded-[22px] border-2 border-[#ffffff80] bg-[#fffdf8] pb-[18px] text-left shadow-[0_13px_35px_#15382e17] transition-all duration-200",
                  "enabled:hover:-translate-y-1 enabled:hover:border-[#2e7464] enabled:hover:shadow-[0_20px_45px_#15382e2b] disabled:cursor-default disabled:text-inherit",
                  "max-[720px]:grid max-[720px]:min-h-[180px] max-[720px]:grid-cols-[minmax(135px,42%)_1fr] max-[720px]:p-0 max-[560px]:grid-cols-1",
                  selected && "-translate-y-1 border-[#2e7464] shadow-[0_20px_45px_#15382e2b]",
                  check === "right" && "border-[#4d9a79] bg-[#f1faf4]",
                  check === "wrong" && "needs-work border-[#c98477] bg-[#fff8f5]",
                )}
                onClick={() => choosePicture(pair.id)}
                aria-pressed={selected}
                disabled={complete}
              >
                <Ripple className="h-[190px] overflow-hidden bg-[#0d2a33] max-[720px]:h-full max-[720px]:min-h-[180px] max-[560px]:h-[210px] max-[560px]:min-h-[210px] max-[360px]:h-[185px] max-[360px]:min-h-[185px]" amplitude={0.18} speed={0.48} wavelength={70} rings={2} decay={1.45} refraction={28} dispersion={0.2} shine={0.42} trigger="hover" interval={6 + index}>
                  <span className="block h-[190px] max-[720px]:h-full max-[720px]:min-h-[180px] max-[560px]:h-[210px] max-[560px]:min-h-[210px] max-[360px]:h-[185px] max-[360px]:min-h-[185px]">
                    <Image className="block size-full object-cover" src={pair.imageSource} alt={pair.alt} width={900} height={600} sizes="(max-width: 720px) 92vw, 30vw" />
                  </span>
                </Ripple>
                <span className="grid px-[18px] pt-[18px] max-[720px]:content-center max-[720px]:p-[18px] max-[560px]:px-[18px] max-[560px]:pb-5 max-[560px]:pt-[17px]">
                  <small className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#92742c]">Scene {index + 1}</small>
                  <strong className="my-[5px] font-display text-[21px] font-medium">{pair.sceneLabel}</strong>
                  <span className="text-[10px] text-[#687871]">{pairedReference ? pairedReference.reference : selected ? "Now choose a passage" : selectedReference ? "Pair with selected passage" : "Select this picture"}</span>
                </span>
                {check === "right" && <span className="mt-[13px] ml-[18px] inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#276b52] max-[720px]:absolute max-[720px]:right-3 max-[720px]:bottom-3 max-[720px]:m-0 max-[720px]:rounded-full max-[720px]:bg-[#e7f5eb] max-[720px]:px-[9px] max-[720px]:py-1.5"><CheckIcon size={19} /> Matched</span>}
              </button>
            );
          })}
        </section>

        <section className="my-[25px] grid gap-2.5" aria-label="Genesis passages">
          <div className="mb-2 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#6b7b75]"><span>Passage cards</span><span>{assignedCount}/3 paired</span></div>
          {references.map((pair) => {
            const assignedPicture = Object.entries(pairings).find(([, referenceId]) => referenceId === pair.id)?.[0];
            const assignedScene = quest.pairs.findIndex((item) => item.id === assignedPicture) + 1;
            const selected = selectedReference === pair.id;
            return (
              <button
                key={pair.id}
                className={cx(
                  "reference-card grid min-h-[94px] w-full cursor-pointer grid-cols-[190px_minmax(0,1fr)] items-center gap-5 rounded-[17px] border border-[#d3d8d1] bg-[#fffefa] px-5 py-[17px] text-left transition-all duration-200",
                  "enabled:hover:translate-x-[3px] enabled:hover:border-[#5d8979] disabled:cursor-not-allowed disabled:text-inherit max-[720px]:grid-cols-1 max-[720px]:gap-2 max-[560px]:min-h-28 max-[560px]:p-4",
                  assignedPicture && "border-[#a5bfb5] bg-[#f0f6f2]",
                  selected && "border-[#2e7464] bg-[#e5f1ec] shadow-[0_0_0_3px_#2e746426]",
                )}
                onClick={() => chooseReference(pair.id)}
                disabled={complete}
                aria-pressed={selected}
              >
                <span className="grid">
                  <strong className="font-display text-xl font-medium max-[560px]:text-lg">{pair.reference}</strong>
                  <small className="mt-[5px] text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#537467]">{assignedPicture ? `Paired with scene ${assignedScene}` : selected ? "Selected—choose a scene" : selectedPicture ? "Choose this passage" : "Select this passage"}</small>
                </span>
                <p className="m-0 font-display text-[15px] font-medium leading-[1.45] text-[#52645d] max-[720px]:text-sm">“{pair.passage}”</p>
              </button>
            );
          })}
        </section>

        <div aria-live="polite">
          {Object.values(checks).includes("wrong") && <div className={cx(activityMessage, "flex-col items-start gap-1 border-[#dda89f] bg-[#fae7e3] text-[#7d352c]")}><strong>Some pairs need another look.</strong><span>Correct pairs are marked. Select any other picture to change its passage.</span></div>}
          {complete && <div className={cx(activityMessage, "border-[#91bda7] bg-[#e2f3e7] text-[#15533f]")}><CheckIcon size={26} /><div className="grid"><strong>All three scenes match!</strong><span>You connected the pictures with Genesis 1, 2, and 3.</span></div></div>}
        </div>

        <div className={cx(activityActions, complete && completionActions)}>
          {complete ? (
            <>
              <button className={cx("secondary-button", secondaryButton)} onClick={onBackToUnit}>← Back to unit</button>
              <button className={cx("primary-button", primaryButton)} onClick={onContinue}>{continueLabel}</button>
            </>
          ) : (
            <button className={cx("primary-button", primaryButton)} onClick={checkMatches} disabled={assignedCount !== quest.pairs.length}>Check matches</button>
          )}
        </div>
        {wasCompleted && <p className={replayNote}>You already earned this quest’s coin.</p>}
      </main>
    </div>
  );
}
