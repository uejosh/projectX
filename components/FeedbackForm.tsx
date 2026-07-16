"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, MessageIcon } from "@/components/Icons";

type Props = {
  anonymousId: string;
  submitted: boolean;
  onSubmitted: () => void;
};

export function FeedbackForm({ anonymousId, submitted, onSubmitted }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!rating) return;
    setState("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ anonymousId, rating, comment, unit: "genesis-1-3" }),
      });
      if (!response.ok) throw new Error("Could not send feedback");
      onSubmitted();
    } catch {
      setState("error");
    }
  }

  if (submitted) {
    return <section className="feedback-card feedback-thanks"><div className="feedback-icon"><CheckIcon size={24} /></div><div><p className="eyebrow">Private feedback received</p><h2>Thank you for shaping the next unit.</h2><p>Your note is only available to the product team.</p></div></section>;
  }

  return (
    <section className="feedback-card" aria-labelledby="feedback-heading">
      <div className="feedback-icon"><MessageIcon size={24} /></div>
      <div className="feedback-content">
        <p className="eyebrow">One last thing</p>
        <h2 id="feedback-heading">How did this journey feel?</h2>
        <p>This feedback is private. It will never appear on your profile or a public feed.</p>
        <form onSubmit={submit}>
          <fieldset>
            <legend>Choose a rating</legend>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={rating === value ? "selected" : ""} onClick={() => setRating(value)} aria-label={`${value} out of 5`} aria-pressed={rating === value}>{value}<span>✦</span></button>)}
            </div>
          </fieldset>
          <label htmlFor="feedback-comment">What should we keep or improve? <span>optional</span></label>
          <textarea id="feedback-comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={800} placeholder="A short note for the product team…" />
          <div className="feedback-footer"><span>{comment.length}/800</span><button className="secondary-button" type="submit" disabled={!rating || state === "sending"}>{state === "sending" ? "Sending…" : "Send private feedback"}</button></div>
          {state === "error" && <p className="form-error" role="alert">Your feedback did not send. Please try once more.</p>}
        </form>
      </div>
    </section>
  );
}
