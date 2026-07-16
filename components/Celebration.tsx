"use client";

import { GemIcon, SparkleIcon } from "@/components/Icons";

type Props = { open: boolean; onClose: () => void };

export function Celebration({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="celebration-overlay" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>
      <div className="celebration-card">
        <SparkleIcon size={24} className="celebration-spark spark-one" />
        <SparkleIcon size={18} className="celebration-spark spark-two" />
        <div className="gem-pedestal"><GemIcon size={72} /></div>
        <p className="eyebrow">Unit 1 complete</p>
        <h2 id="celebration-title">You earned the Creation Gem</h2>
        <p>You listened, remembered the verses, and put the story of Genesis 1–3 in order.</p>
        <div className="reward-pill"><GemIcon size={18} /> 1 gem added to your collection</div>
        <button className="primary-button" onClick={onClose} autoFocus>Claim my gem</button>
      </div>
    </div>
  );
}
