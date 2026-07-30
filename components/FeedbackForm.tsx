"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, MessageIcon } from "@/components/Icons";
import { cx, displayHeading, eyebrow, focusRing, secondaryButton } from "@/lib/styles";

type Props = {
  anonymousId: string;
  submitted: boolean;
  onSubmitted: () => void;
};

const cardClass =
  "mt-[70px] flex items-start gap-[25px] rounded-[25px] border border-[#c9d8ce] bg-[#e8efe9] px-[38px] py-8 max-[560px]:flex-wrap max-[560px]:px-[22px] max-[560px]:py-[27px]";

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

  const icon = <div className="grid size-[52px] shrink-0 place-items-center rounded-2xl bg-white text-forest"><CheckIcon size={24} /></div>;

  if (submitted) {
    return (
      <section className={cx(cardClass, "items-center")}>
        {icon}
        <div>
          <p className={eyebrow}>Private feedback received</p>
          <h2 className={cx(displayHeading, "mb-1.5 mt-[3px] text-[29px]")}>Thank you for shaping the next unit.</h2>
          <p className="mb-0 text-xs text-[#5f706a]">Your note is only available to the product team.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={cardClass} aria-labelledby="feedback-heading">
      <div className="grid size-[52px] shrink-0 place-items-center rounded-2xl bg-white text-forest"><MessageIcon size={24} /></div>
      <div className="flex-1 max-[560px]:w-full max-[560px]:basis-full">
        <p className={eyebrow}>One last thing</p>
        <h2 className={cx(displayHeading, "mb-1.5 mt-[3px] text-[29px]")} id="feedback-heading">How did this journey feel?</h2>
        <p className="mb-0 text-xs text-[#5f706a]">This feedback is private. It will never appear on your profile or a public feed.</p>
        <form className="mt-6" onSubmit={submit}>
          <fieldset className="mb-5 border-0 p-0">
            <legend className="mb-[9px] block text-[11px] font-extrabold">Choose a rating</legend>
            <div className="flex gap-2 max-[560px]:justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={cx(
                    focusRing,
                    "h-[43px] w-[51px] cursor-pointer rounded-[11px] border border-[#c8d3cc] bg-white font-extrabold max-[560px]:w-[18%] [&_span]:ml-[3px] [&_span]:text-[#d2a23b]",
                    rating === value && "border-forest bg-forest text-white",
                  )}
                  onClick={() => setRating(value)}
                  aria-label={`${value} out of 5`}
                  aria-pressed={rating === value}
                >
                  {value}<span>✦</span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mb-[9px] block text-[11px] font-extrabold" htmlFor="feedback-comment">What should we keep or improve? <span className="font-medium text-[#7f8e88]">optional</span></label>
          <textarea className={cx(focusRing, "min-h-[110px] w-full resize-y rounded-[13px] border border-[#c5d2ca] bg-[#fffefa] p-3.5")} id="feedback-comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={800} placeholder="A short note for the product team…" />
          <div className="mt-2 flex items-center justify-between"><span className="text-[10px] text-[#83918c]">{comment.length}/800</span><button className={secondaryButton} type="submit" disabled={!rating || state === "sending"}>{state === "sending" ? "Sending…" : "Send private feedback"}</button></div>
          {state === "error" && <p className="mt-[9px] text-[#9c392d]" role="alert">Your feedback did not send. Please try once more.</p>}
        </form>
      </div>
    </section>
  );
}
