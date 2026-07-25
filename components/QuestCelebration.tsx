"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CoinIcon, SparkleIcon } from "@/components/Icons";

type Props = {
  open: boolean;
  questTitle: string;
  soundEnabled: boolean;
  onClose: () => void;
};

function playSuccessChime() {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.72);
  gain.connect(context.destination);

  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.11);
    oscillator.stop(context.currentTime + 0.45 + index * 0.11);
  });
  window.setTimeout(() => void context.close(), 900);
}

gsap.registerPlugin(useGSAP);

export function QuestCelebration({ open, questTitle, soundEnabled, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    if (soundEnabled) playSuccessChime();
    return () => previousFocusRef.current?.focus();
  }, [open, soundEnabled]);

  useGSAP(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.timeline({ defaults: { ease: "back.out(1.6)" } })
      .from(".quest-celebration-card", { opacity: 0, y: 38, scale: 0.76, duration: 0.58 })
      .from(".coin-pedestal", { opacity: 0, scale: 0, rotationY: -180, duration: 0.7 }, "-=0.38")
      .from(".balloon", { opacity: 0, y: 100, scale: 0.5, duration: 0.7, stagger: 0.1 }, "-=0.62")
      .from(".quest-celebration-card > .eyebrow, .quest-celebration-card > h2, .quest-celebration-card > p, .quest-celebration-card > .reward-pill, .quest-celebration-card > button", {
        opacity: 0,
        y: 14,
        duration: 0.35,
        stagger: 0.055,
        ease: "power2.out",
      }, "-=0.42");
  }, { dependencies: [open], scope: overlayRef, revertOnUpdate: true });

  if (!open) return null;
  return (
    <div ref={overlayRef} className="celebration-overlay quest-celebration-overlay" role="dialog" aria-modal="true" aria-labelledby="quest-celebration-title" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className="confetti quest-confetti" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
        <span className="balloon balloon-one" /><span className="balloon balloon-two" /><span className="balloon balloon-three" />
      </div>
      <div className="celebration-card quest-celebration-card">
        <SparkleIcon size={22} className="celebration-spark spark-one" />
        <SparkleIcon size={18} className="celebration-spark spark-two" />
        <div className="coin-pedestal"><CoinIcon size={66} /></div>
        <p className="eyebrow">Quest complete</p>
        <h2 id="quest-celebration-title">Beautifully remembered!</h2>
        <p>{questTitle}</p>
        <div className="reward-pill coin-reward-pill"><CoinIcon size={18} /> +1 gold coin</div>
        <button ref={closeRef} className="primary-button" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}
