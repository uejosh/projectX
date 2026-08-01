import { cx, displayHeading, focusRing } from "@/lib/styles";

export const siteHeader =
  "relative z-20 flex h-[76px] items-center justify-between border-b border-[#14342c1a] bg-paper px-[max(24px,calc((100vw-1180px)/2))] max-[560px]:h-[66px] max-[560px]:px-4";

export const brandButton = cx(
  focusRing,
  "flex cursor-pointer items-center gap-[11px] border-0 bg-transparent p-0 text-left",
);

export const counter =
  "flex items-center gap-1.5 rounded-full px-[11px] py-[7px] text-xs max-[560px]:px-2 max-[560px]:py-1.5 [&_.reward-art-icon]:scale-[1.18] [&_strong]:max-[560px]:text-[11px]";

export const pathHero =
  "relative isolate grid min-h-[540px] grid-cols-[minmax(0,1fr)_auto] items-center overflow-hidden bg-[url('/images/genesis/solar-system-sun.jpg')] bg-cover bg-[center_48%] px-[max(30px,calc((100vw-1080px)/2))] py-16 text-white max-[900px]:px-[30px] max-[720px]:min-h-[650px] max-[720px]:grid-cols-1 max-[720px]:bg-[61%_center] max-[720px]:py-[42px] max-[560px]:min-h-[610px] max-[560px]:bg-[64%_center] max-[560px]:px-[17px] max-[560px]:py-[34px]";

export const heroCopy =
  "hero-copy relative z-[2] max-w-[560px] bg-transparent text-shadow-[0_3px_22px_#020b12,0_1px_4px_#020b12]";

export const heroTitle = cx(
  displayHeading,
  "mb-[25px] text-[clamp(48px,6vw,76px)] leading-[.98] max-[560px]:text-[46px] max-[360px]:text-[40px] [&_em]:font-normal [&_em]:text-[#f5d986]",
);

export const heroAccent =
  "hero-image-accent z-[2] ml-[42px] flex h-[215px] w-[180px] flex-col items-center justify-center rounded-[34px] border border-[#bde8ff42] bg-[linear-gradient(145deg,#0c2737d9,#0923338a)] p-6 text-[#f7d777] shadow-[0_24px_80px_#0008,inset_0_0_35px_#58c8ff18] max-[900px]:ml-6 max-[900px]:h-[180px] max-[900px]:w-[145px] max-[720px]:ml-0 max-[720px]:mt-[18px] max-[720px]:grid max-[720px]:h-auto max-[720px]:w-auto max-[720px]:grid-cols-[auto_auto_auto] max-[720px]:gap-[9px] max-[720px]:justify-self-start max-[720px]:rounded-[20px] max-[720px]:p-4 max-[360px]:hidden";

export const unitCard =
  "unit-card relative grid min-h-[138px] grid-cols-[86px_1fr_auto] items-center gap-[22px] rounded-[22px] border border-[#e0dfd6] bg-[#fffdf7d1] py-6 pr-7 pl-[18px] shadow-[0_8px_25px_#2336300a] max-[800px]:grid-cols-[70px_1fr_auto] max-[560px]:min-h-[130px] max-[560px]:grid-cols-[52px_1fr_auto] max-[560px]:gap-3 max-[560px]:py-[18px] max-[560px]:pr-3.5 max-[560px]:pl-[9px]";

export const unitNumber =
  "relative z-[2] flex h-16 w-[52px] flex-col items-center justify-center rounded-2xl bg-forest text-white max-[560px]:h-[57px] max-[560px]:w-[46px] [&_span]:text-[8px] [&_span]:tracking-[0.12em] [&_span]:text-[#bcd1c9] [&_strong]:font-display [&_strong]:text-[29px] [&_strong]:font-normal";

export const unitTopline =
  "flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6c7d76]";

export const unitTitle = cx(
  displayHeading,
  "mb-2 mt-[5px] text-[25px] max-[560px]:text-xl",
);

export const roundControl =
  "grid size-[42px] place-items-center rounded-full max-[560px]:size-[34px]";

export const sectionCard =
  "activity-card grid min-h-[132px] cursor-pointer grid-cols-[auto_1fr_auto] gap-4 rounded-[18px] border border-line bg-paper p-5 text-left transition-all duration-200 hover:-translate-y-[3px] hover:border-[#9cb6ac] hover:shadow-[0_15px_35px_#15362d14] max-[560px]:p-[17px]";

export const storyCard =
  "story-game-card grid cursor-pointer grid-cols-[150px_1fr] overflow-hidden rounded-[22px] border border-line bg-paper p-0 text-left transition-all duration-200 hover:-translate-y-[3px] hover:border-[#9cb6ac] hover:shadow-[0_15px_35px_#15362d14] max-[800px]:grid-cols-[130px_1fr] max-[560px]:grid-cols-[105px_1fr]";

export const understandingCard =
  "understanding-card grid min-h-[220px] cursor-pointer grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-[23px] border border-line bg-paper p-0 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#91afa4] hover:shadow-[0_18px_42px_#15362d1a] max-[900px]:grid-cols-[115px_1fr] max-[720px]:min-h-[190px] max-[720px]:grid-cols-[120px_1fr] max-[560px]:min-h-[180px] max-[560px]:grid-cols-[94px_1fr] max-[360px]:grid-cols-1";

export const storyCta =
  "mt-[25px] flex items-center gap-[7px] text-[11px] font-extrabold text-[#2c6256]";
