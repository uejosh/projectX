"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GemIcon, SparkleIcon } from "@/components/Icons";

type Props = { open: boolean; onClose: () => void };

gsap.registerPlugin(useGSAP);

export function Celebration({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.timeline({ defaults: { ease: "back.out(1.5)" } })
      .from(".celebration-card", { opacity: 0, y: 45, scale: 0.72, rotationX: -12, duration: 0.65 })
      .from(".gem-pedestal", { opacity: 0, scale: 0, rotation: -120, duration: 0.75 }, "-=0.42")
      .from(".celebration-card > .eyebrow, .celebration-card > h2, .celebration-card > p, .celebration-card > .reward-pill, .celebration-card > button", {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.065,
        ease: "power2.out",
      }, "-=0.4")
      .from(".celebration-spark", { opacity: 0, scale: 0, rotation: -90, duration: 0.45, stagger: 0.12 }, "-=0.45");
  }, { dependencies: [open], scope: overlayRef, revertOnUpdate: true });

  if (!open) return null;
  return (
    <div ref={overlayRef} className="celebration-overlay" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>
      <div className="celebration-card">
        <SparkleIcon size={24} className="celebration-spark spark-one" />
        <SparkleIcon size={18} className="celebration-spark spark-two" />
        <div className="gem-pedestal"><GemIcon size={72} /></div>
        <p className="eyebrow">Unit 1 complete</p>
        <h2 id="celebration-title">You earned the Creation Badge</h2>
        <p>You listened, remembered, understood, and connected all ten Genesis 1–3 quests.</p>
        <div className="reward-pill"><GemIcon size={18} /> 1 Creation Badge added to your collection</div>
        <button className="primary-button" onClick={onClose} autoFocus>Claim my badge</button>
      </div>
    </div>
  );
}
