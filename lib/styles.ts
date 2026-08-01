type ClassValue = string | false | null | undefined;

export function cx(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

export const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold";

export const displayHeading = "font-display font-medium tracking-[-0.035em]";

export const eyebrow =
  "mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#477064]";

export const primaryButton = cx(
  focusRing,
  "min-h-12 cursor-pointer rounded-full border-0 bg-forest px-[22px] font-extrabold text-white",
  "shadow-[0_12px_25px_#082d2833] transition-all duration-200",
  "enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_28px_#082d282d]",
  "disabled:cursor-not-allowed disabled:opacity-45",
);

export const secondaryButton = cx(
  focusRing,
  "min-h-12 cursor-pointer rounded-full border border-[#ced8d1] bg-white px-[22px] font-extrabold text-forest",
  "transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_28px_#082d282d]",
  "disabled:cursor-not-allowed disabled:opacity-45",
);

export const textButton = cx(
  focusRing,
  "cursor-pointer border-0 bg-transparent p-[7px] text-[13px] font-extrabold text-[#45665c]",
);

export const iconTextButton = cx(textButton, "inline-flex items-center gap-[7px]");

export const sectionWrap = "mt-[74px] max-[560px]:mt-14";

export const sectionHeadingRow =
  "mb-6 flex items-center gap-3.5 [&_.eyebrow]:mb-[3px]";

export const sectionIcon =
  "grid size-[46px] place-items-center rounded-[14px] bg-forest text-[#e7cf8e] max-[560px]:size-[41px]";

export const sectionTitle = cx(
  displayHeading,
  "m-0 text-[31px] max-[560px]:text-[26px]",
);

export const sectionCount =
  "ml-auto rounded-full bg-[#e8ede9] px-[11px] py-[7px] text-[11px] font-extrabold text-[#557168]";

export const activityShell =
  "relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f9f3e5_0,#edf3e9_58%,#e7eee4_100%)]";

export const activityHeader =
  "relative z-[2] flex h-[70px] items-center justify-between border-b border-line bg-[#fffdf7e8] px-[max(24px,calc((100vw-900px)/2))] max-[560px]:px-[13px]";

export const activityKind =
  "flex items-center gap-[7px] rounded-full bg-[#e7ede9] px-[11px] py-[7px] text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#49675e]";

export const activityMain =
  "relative z-[2] mx-auto w-full max-w-[900px] px-[25px] pb-[90px] pt-[60px] max-[560px]:px-4 max-[560px]:pb-[70px] max-[560px]:pt-[42px]";

export const activityIntro =
  "mx-auto mb-[38px] max-w-[680px] rounded-3xl bg-[#fffdf7b8] px-6 py-[18px] text-center shadow-[0_12px_40px_#173f3510] max-[560px]:px-3.5 max-[560px]:py-3";

export const activityIntroTitle = cx(
  displayHeading,
  "my-2 text-[clamp(37px,5vw,54px)] leading-[1.08] max-[560px]:text-[37px]",
);

export const activityMessage =
  "mt-[17px] flex min-h-[78px] items-center gap-3.5 rounded-[17px] border-2 border-transparent px-[22px] py-[19px] text-sm shadow-[0_12px_28px_#153b3115] max-[560px]:min-h-[74px] max-[560px]:p-4 [&_strong]:mb-1 [&_strong]:font-display [&_strong]:text-[22px] [&_strong]:font-bold [&_strong]:leading-[1.15] max-[560px]:[&_strong]:text-xl [&_span]:block [&_span]:text-[13px] [&_span]:leading-[1.45]";

export const activityActions =
  "mt-[25px] flex justify-center [&_.primary-button]:min-w-[210px]";

export const completionActions =
  "flex-wrap items-center gap-3 max-[560px]:grid max-[560px]:w-full max-[560px]:grid-cols-1 [&_.primary-button]:min-w-[190px] [&_.secondary-button]:min-w-[190px] max-[560px]:[&_.primary-button]:w-full max-[560px]:[&_.secondary-button]:w-full";

export const replayNote =
  "mt-[18px] text-center text-[11px] text-[#71817b]";
