"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GemIcon, SparkleIcon } from "@/components/Icons";
import { cx, displayHeading, eyebrow, primaryButton } from "@/lib/styles";

type Props = { open: boolean; onClose: () => void };

gsap.registerPlugin(useGSAP);

export function Celebration({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.timeline({ defaults: { ease: "back.out(1.5)" } })
      .from(".celebration-card", { opacity: 0, y: 45, scale: 0.72, rotationX: -12, duration: 0.65 })
      .from(".gem-pedestal", { opacity: 0, scale: 0, rotation: -120, duration: 0.75 }, "-=0.42")
      .from(".celebration-card > .eyebrow, .celebration-card > h2, .celebration-card > p, .celebration-card > .reward-pill", {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.065,
        ease: "power2.out",
        clearProps: "opacity,transform",
      }, "-=0.4")
      .from(".celebration-spark", { opacity: 0, scale: 0, rotation: -90, duration: 0.45, stagger: 0.12 }, "-=0.45");
  }, { dependencies: [open], scope: overlayRef, revertOnUpdate: true });

  if (!open) return null;
  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-[#031714db] p-[22px] max-[560px]:p-3 max-[700px]:p-3" role="dialog" aria-modal="true" aria-labelledby="celebration-title" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>
      <div className="celebration-card relative max-h-[calc(100svh-32px)] w-[min(470px,100%)] overflow-y-auto rounded-[30px] border border-[#f6dc9359] bg-[radial-gradient(circle_at_50%_5%,#356e61,#0d342d_65%)] px-11 pb-[38px] pt-12 text-center text-white shadow-[0_35px_100px_#00000080] max-[560px]:rounded-3xl max-[560px]:px-5 max-[560px]:pb-[22px] max-[560px]:pt-7 max-[700px]:rounded-3xl max-[700px]:px-5 max-[700px]:pb-[22px] max-[700px]:pt-7">
        <button type="button" className="absolute top-[13px] right-[13px] z-[4] grid size-11 cursor-pointer place-items-center rounded-full border border-[#ffffff42] bg-[#061d18a8] text-[27px] leading-none text-white hover:bg-[#ffffff24]" aria-label="Close reward popup" onClick={onClose}>×</button>
        <SparkleIcon size={24} className="celebration-spark absolute top-[20%] left-[13%] text-[#f8d97d]" />
        <SparkleIcon size={18} className="celebration-spark absolute top-[29%] right-[15%] text-[#f8d97d]" />
        <div className="gem-pedestal"><GemIcon size={72} /></div>
        <p className={cx("eyebrow", eyebrow)}>Unit 1 complete</p>
        <h2 className={cx(displayHeading, "my-2 text-[38px] leading-[1.08] max-[560px]:my-1.5 max-[560px]:text-[28px] max-[700px]:my-1.5 max-[700px]:text-[28px]")} id="celebration-title">You earned the Creation Badge</h2>
        <p className="text-[13px] leading-[1.6] text-[#d0ded9] max-[560px]:mb-0 max-[560px]:text-xs max-[560px]:leading-[1.45] max-[700px]:mb-0 max-[700px]:text-xs max-[700px]:leading-[1.45]">You listened, remembered, understood, and connected all ten Genesis 1–3 quests.</p>
        <div className="reward-pill mx-auto my-[23px] flex w-fit items-center gap-[7px] rounded-full border border-[#f7db8959] px-[13px] py-[9px] text-[10px] font-extrabold text-[#f8dc8b] max-[560px]:my-3.5 max-[700px]:my-3.5"><GemIcon size={18} /> 1 Creation Badge added to your collection</div>
        <button className={cx("primary-button relative z-[2] min-w-[180px]", primaryButton, "bg-[#f5d986] text-[#30270e] shadow-none")} onClick={onClose} autoFocus>Claim my badge</button>
      </div>
    </div>
  );
}
