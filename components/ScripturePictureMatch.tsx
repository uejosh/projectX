"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Ripple } from "@/components/canvasui/Ripple";
import { CheckIcon, PuzzleIcon } from "@/components/Icons";
import { CreationBackdrop } from "@/components/CreationBackdrop";
import { scorePictureMatches, type PictureMatchData } from "@/data/content";

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
    <div className="activity-shell picture-match-theme" ref={scopeRef}>
      <CreationBackdrop variant="picture-match" imageSource="/images/genesis/creation-stars.webp" />
      <header className="activity-header">
        <button className="text-button" onClick={onBackToUnit}>← Back to unit</button>
        <span className="activity-kind"><PuzzleIcon size={16} /> Picture match</span>
      </header>

      <main className="activity-main picture-match-activity">
        <div className="activity-intro">
          <p className="eyebrow">Three scenes · three passages</p>
          <h1>{quest.prompt}</h1>
          <p>Select a picture or a passage first, then choose its match. You can change any pair before checking.</p>
        </div>

        <section className="picture-match-board" aria-label="Picture cards">
          {quest.pairs.map((pair, index) => {
            const selected = selectedPicture === pair.id;
            const pairedReference = quest.pairs.find((item) => item.id === pairings[pair.id]);
            const check = checks[pair.id];
            return (
              <button
                key={pair.id}
                className={`picture-card ${selected ? "selected" : ""} ${check === "right" ? "is-right" : ""} ${check === "wrong" ? "needs-work" : ""}`}
                onClick={() => choosePicture(pair.id)}
                aria-pressed={selected}
                disabled={complete}
              >
                <Ripple className="picture-ripple" amplitude={0.18} speed={0.48} wavelength={70} rings={2} decay={1.45} refraction={28} dispersion={0.2} shine={0.42} trigger="hover" interval={6 + index}>
                  <span className="picture-frame"><Image src={pair.imageSource} alt={pair.alt} width={900} height={600} sizes="(max-width: 720px) 92vw, 30vw" /></span>
                </Ripple>
                <span className="picture-card-copy"><small>Scene {index + 1}</small><strong>{pair.sceneLabel}</strong><span>{pairedReference ? pairedReference.reference : selected ? "Now choose a passage" : selectedReference ? "Pair with selected passage" : "Select this picture"}</span></span>
                {check === "right" && <span className="match-check"><CheckIcon size={19} /> Matched</span>}
              </button>
            );
          })}
        </section>

        <section className="reference-list" aria-label="Genesis passages">
          <div className="board-label"><span>Passage cards</span><span>{assignedCount}/3 paired</span></div>
          {references.map((pair) => {
            const assignedPicture = Object.entries(pairings).find(([, referenceId]) => referenceId === pair.id)?.[0];
            const assignedScene = quest.pairs.findIndex((item) => item.id === assignedPicture) + 1;
            const selected = selectedReference === pair.id;
            return (
              <button key={pair.id} className={`reference-card ${assignedPicture ? "assigned" : ""} ${selected ? "selected" : ""}`} onClick={() => chooseReference(pair.id)} disabled={complete} aria-pressed={selected}>
                <span><strong>{pair.reference}</strong><small>{assignedPicture ? `Paired with scene ${assignedScene}` : selected ? "Selected—choose a scene" : selectedPicture ? "Choose this passage" : "Select this passage"}</small></span>
                <p>“{pair.passage}”</p>
              </button>
            );
          })}
        </section>

        <div aria-live="polite">
          {Object.values(checks).includes("wrong") && <div className="activity-message error"><strong>Some pairs need another look.</strong><span>Correct pairs are marked. Select any other picture to change its passage.</span></div>}
          {complete && <div className="activity-message success"><CheckIcon size={26} /><div><strong>All three scenes match!</strong><span>You connected the pictures with Genesis 1, 2, and 3.</span></div></div>}
        </div>

        <div className={`activity-actions ${complete ? "completion-actions" : ""}`}>
          {complete ? <><button className="secondary-button" onClick={onBackToUnit}>← Back to unit</button><button className="primary-button" onClick={onContinue}>{continueLabel}</button></> : <button className="primary-button" onClick={checkMatches} disabled={assignedCount !== quest.pairs.length}>Check matches</button>}
        </div>
        {wasCompleted && <p className="replay-note">You already earned this quest’s coin.</p>}
      </main>
    </div>
  );
}
