"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CoinIcon, SparkleIcon } from "@/components/Icons";
import { cx, displayHeading, eyebrow, primaryButton } from "@/lib/styles";

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
      .from(".quest-celebration-card > .eyebrow, .quest-celebration-card > h2, .quest-celebration-card > p, .quest-celebration-card > .reward-pill", {
        opacity: 0,
        y: 14,
        duration: 0.35,
        stagger: 0.055,
        ease: "power2.out",
        clearProps: "opacity,transform",
      }, "-=0.42");
  }, { dependencies: [open], scope: overlayRef, revertOnUpdate: true });

  if (!open) return null;
  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-[#08221de8] p-[22px] backdrop-blur-lg max-[560px]:p-3 max-[700px]:p-3" role="dialog" aria-modal="true" aria-labelledby="quest-celebration-title" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
        <span className="balloon left-[8%] bg-[#ef8c7e] [animation-delay:-1s]" />
        <span className="balloon left-[74%] bg-[#f0c85b] [animation-delay:-2.6s]" />
        <span className="balloon left-[88%] bg-[#73b4a0] [animation-delay:-0.3s]" />
      </div>
      <div className="celebration-card quest-celebration-card relative max-h-[calc(100svh-32px)] w-[min(470px,100%)] overflow-y-auto rounded-[30px] border border-[#f6dc9359] bg-[radial-gradient(circle_at_50%_0,#8a6c26,#1a4d40_55%,#0b2d27_100%)] px-11 pb-[38px] pt-12 text-center text-white shadow-[0_35px_100px_#00000080] max-[560px]:rounded-3xl max-[560px]:px-5 max-[560px]:pb-[22px] max-[560px]:pt-7 max-[700px]:rounded-3xl max-[700px]:px-5 max-[700px]:pb-[22px] max-[700px]:pt-7">
        <button type="button" className="absolute top-[13px] right-[13px] z-[4] grid size-11 cursor-pointer place-items-center rounded-full border border-[#ffffff42] bg-[#061d18a8] text-[27px] leading-none text-white hover:bg-[#ffffff24]" aria-label="Close reward popup" onClick={onClose}>×</button>
        <SparkleIcon size={22} className="celebration-spark absolute top-[20%] left-[13%] text-[#f8d97d]" />
        <SparkleIcon size={18} className="celebration-spark absolute top-[29%] right-[15%] text-[#f8d97d]" />
        <div className="coin-pedestal"><CoinIcon size={66} /></div>
        <p className={cx("eyebrow", eyebrow)}>Quest complete</p>
        <h2 className={cx(displayHeading, "my-2 text-[38px] leading-[1.08] max-[560px]:my-1.5 max-[560px]:text-[28px] max-[700px]:my-1.5 max-[700px]:text-[28px]")} id="quest-celebration-title">Beautifully remembered!</h2>
        <p className="text-[13px] leading-[1.6] text-[#d0ded9] max-[560px]:mb-0 max-[560px]:text-xs max-[560px]:leading-[1.45] max-[700px]:mb-0 max-[700px]:text-xs max-[700px]:leading-[1.45]">{questTitle}</p>
        <div className="reward-pill mx-auto my-[23px] flex w-fit items-center gap-[7px] rounded-full border border-[#f7db8959] bg-[#5f4a1647] px-[13px] py-[9px] text-xs font-extrabold text-[#ffe28a] max-[560px]:my-3.5 max-[700px]:my-3.5"><CoinIcon size={18} /> +1 gold coin</div>
        <button ref={closeRef} className={cx("primary-button relative z-[2] min-w-[180px]", primaryButton, "bg-[#f5d986] text-[#30270e] shadow-none")} onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}
