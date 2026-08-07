"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AudioLibrary } from "@/components/AudioLibrary";
import { Celebration } from "@/components/Celebration";
import { Ripple } from "@/components/canvasui/Ripple";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FloatingCreationSvgs } from "@/components/FloatingCreationSvgs";
import { QuestCelebration } from "@/components/QuestCelebration";
import { PassageClassification } from "@/components/PassageClassification";
import { ScripturePictureMatch } from "@/components/ScripturePictureMatch";
import { StorySequence } from "@/components/StorySequence";
import { VersePuzzle } from "@/components/VersePuzzle";
import { ArrowIcon, BackIcon, BookIcon, CheckIcon, CoinIcon, GemIcon, LayersIcon, LockIcon, PuzzleIcon, SparkleIcon, VolumeIcon, VolumeOffIcon } from "@/components/Icons";
import { nextQuest, passageClassifications, pictureMatches, quests, questsOfType, storySequences, upcomingUnits, versePuzzles, type QuestRef } from "@/data/content";
import { awardQuestCompletion, coinCount, completedActivityCount, isQuestComplete, progressPercent } from "@/lib/progress";
import { useProgress } from "@/components/useProgress";
import {
  brandButton,
  counter,
  heroAccent,
  heroCopy,
  heroTitle,
  pathHero,
  roundControl,
  sectionCard,
  siteHeader,
  storyCard,
  storyCta,
  understandingCard,
  unitCard,
  unitNumber,
  unitTitle,
  unitTopline,
} from "@/lib/genesisStyles";
import {
  cx,
  displayHeading,
  eyebrow,
  focusRing,
  iconTextButton,
  sectionCount,
  sectionHeadingRow,
  sectionIcon,
  sectionTitle,
  sectionWrap,
  secondaryButton,
  textButton,
} from "@/lib/styles";

type Activity = QuestRef | null;
type QuestCelebrationState = { title: string; earnsGem: boolean } | null;

const journeyCardArtwork = (imageSource: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(90deg,#fffdf7 0%,#fffdf7 48%,#fffdf7f7 56%,#fffdf7b8 68%,#fffdf72e 82%,#fffdf700 100%),url("${imageSource}")`,
  backgroundPosition: "center, right center",
  backgroundSize: "cover, 58% auto",
  backgroundRepeat: "no-repeat",
});

gsap.registerPlugin(useGSAP);

export function GenesisApp() {
  const shellRef = useRef<HTMLDivElement>(null);
  const { progress, hydrated, updateProgress, resetProgress } = useProgress();
  const [view, setView] = useState<"path" | "unit">("path");
  const [activity, setActivity] = useState<Activity>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [questCelebration, setQuestCelebration] = useState<QuestCelebrationState>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [activity, view]);

  useGSAP(() => {
    if (!hydrated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (view === "path") {
      timeline
        .from(".hero-copy > *", { y: 28, duration: 0.7, stagger: 0.09, clearProps: "transform" })
        .from(".hero-image-accent", { opacity: 0, scale: 0.82, rotation: -6, duration: 1, clearProps: "transform" }, "-=0.65")
        .from(".unit-card", { y: 24, duration: 0.55, stagger: 0.08, clearProps: "transform" }, "-=0.45");
    } else {
      timeline
        .from(".unit-hero-copy > *", { y: 24, duration: 0.65, stagger: 0.08, clearProps: "transform" })
        .from(".unit-progress-card", { scale: 0.9, duration: 0.65, clearProps: "transform" }, "-=0.45")
        .from(".audio-card, .activity-card, .story-game-card, .understanding-card, .reward-card", {
          y: 22,
          duration: 0.5,
          stagger: 0.055,
          clearProps: "transform",
        }, "-=0.25");
    }
  }, { dependencies: [hydrated, view], scope: shellRef, revertOnUpdate: true });

  function completeQuest(id: string, title: string) {
    const result = awardQuestCompletion(progress, id);
    if (!result.newlyCompleted) return;
    updateProgress((current) => awardQuestCompletion(current, id).progress);
    setQuestCelebration({ title, earnsGem: result.badgeAwardedNow });
  }

  function continueFromQuest(current: QuestRef) {
    const next = nextQuest(current);
    if (next) {
      setActivity(next);
      return;
    }
    setActivity(null);
    setView("unit");
  }

  function closeQuestCelebration() {
    const shouldCelebrateGem = questCelebration?.earnsGem;
    setQuestCelebration(null);
    if (shouldCelebrateGem) setCelebrating(true);
  }

  if (activity?.type === "verse") {
    const puzzle = versePuzzles.find((item) => item.id === activity.id)!;
    const followingQuest = nextQuest(activity);
    return <><VersePuzzle key={puzzle.id} puzzle={puzzle} completed={isQuestComplete(progress, puzzle.id)} onComplete={() => completeQuest(puzzle.id, puzzle.reference)} onBackToUnit={() => setActivity(null)} onContinue={() => continueFromQuest(activity)} continueLabel={followingQuest ? "Continue your quest" : progress.gemAwarded ? "View your unit reward" : "Return to your unit"} /><QuestCelebration open={Boolean(questCelebration)} questTitle={questCelebration?.title ?? puzzle.reference} soundEnabled={progress.soundEnabled} onClose={closeQuestCelebration} /><Celebration open={celebrating} onClose={() => setCelebrating(false)} /></>;
  }

  if (activity?.type === "story") {
    const story = storySequences.find((item) => item.id === activity.id)!;
    const followingQuest = nextQuest(activity);
    return <><StorySequence key={story.id} story={story} completed={isQuestComplete(progress, story.id)} onComplete={() => completeQuest(story.id, story.title)} onBackToUnit={() => setActivity(null)} onContinue={() => continueFromQuest(activity)} continueLabel={followingQuest ? "Continue your quest" : progress.gemAwarded ? "View your unit reward" : "Return to your unit"} /><QuestCelebration open={Boolean(questCelebration)} questTitle={questCelebration?.title ?? story.title} soundEnabled={progress.soundEnabled} onClose={closeQuestCelebration} /><Celebration open={celebrating} onClose={() => setCelebrating(false)} /></>;
  }

  if (activity?.type === "classification") {
    const quest = passageClassifications.find((item) => item.id === activity.id)!;
    const followingQuest = nextQuest(activity);
    return <><PassageClassification key={quest.id} quest={quest} completed={isQuestComplete(progress, quest.id)} onComplete={() => completeQuest(quest.id, quest.title)} onBackToUnit={() => setActivity(null)} onContinue={() => continueFromQuest(activity)} continueLabel={followingQuest ? "Continue your quest" : progress.gemAwarded ? "View your unit reward" : "Return to your unit"} /><QuestCelebration open={Boolean(questCelebration)} questTitle={questCelebration?.title ?? quest.title} soundEnabled={progress.soundEnabled} onClose={closeQuestCelebration} /><Celebration open={celebrating} onClose={() => setCelebrating(false)} /></>;
  }

  if (activity?.type === "picture-match") {
    const quest = pictureMatches.find((item) => item.id === activity.id)!;
    const followingQuest = nextQuest(activity);
    return <><ScripturePictureMatch key={quest.id} quest={quest} completed={isQuestComplete(progress, quest.id)} onComplete={() => completeQuest(quest.id, quest.title)} onBackToUnit={() => setActivity(null)} onContinue={() => continueFromQuest(activity)} continueLabel={followingQuest ? "Continue your quest" : progress.gemAwarded ? "View your unit reward" : "Return to your unit"} /><QuestCelebration open={Boolean(questCelebration)} questTitle={questCelebration?.title ?? quest.title} soundEnabled={progress.soundEnabled} onClose={closeQuestCelebration} /><Celebration open={celebrating} onClose={() => setCelebrating(false)} /></>;
  }

  const completeCount = completedActivityCount(progress);
  const percent = progressPercent(progress);
  const coins = coinCount(progress);
  const verseQuests = questsOfType("verse");
  const storyQuests = questsOfType("story");
  const understandingQuests = quests.filter((quest) => quest.type === "classification" || quest.type === "picture-match");
  const completedFor = (ids: string[]) => ids.filter((id) => isQuestComplete(progress, id)).length;

  return (
    <div className="min-h-screen" ref={shellRef}>
      <header className={siteHeader}>
        <button className={brandButton} onClick={() => { setView("path"); setActivity(null); }} aria-label="JX Bible journey home">
          <span className="grid size-10 place-items-center rounded-xl bg-forest text-[#f7e7ba] shadow-[0_8px_20px_#082d2833] max-[560px]:size-9"><BookIcon size={21} /></span>
          <span className="grid leading-none">
            <strong className="font-display text-[21px] font-medium">JX</strong>
            <small className="mt-[5px] text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted max-[560px]:hidden">Bible Journey</small>
          </span>
        </button>
        <div className="flex items-center gap-3 max-[560px]:gap-1.5">
          <button className={cx(focusRing, "grid size-[35px] cursor-pointer place-items-center rounded-full border border-[#d7ddd8] bg-[#f7f5ed] text-[#536b63] max-[560px]:size-8")} onClick={() => updateProgress((current) => ({ ...current, soundEnabled: !current.soundEnabled }))} aria-label={progress.soundEnabled ? "Mute celebration sounds" : "Turn on celebration sounds"} aria-pressed={!progress.soundEnabled}>{progress.soundEnabled ? <VolumeIcon size={17} /> : <VolumeOffIcon size={17} />}</button>
          <div className={cx(counter, "border border-[#c8d9d2] bg-pale text-forest")} aria-label={`${coins} gold coins earned`}><CoinIcon size={18} /><strong>{coins}</strong></div>
          <div className={cx(counter, "border border-[#c8d9d2] bg-pale text-forest")} aria-label={`${progress.gemAwarded ? 1 : 0} Creation badges earned`}><GemIcon size={18} /><strong>{progress.gemAwarded ? 1 : 0}</strong></div>
          <span className="rounded-full bg-[#f0eee6] px-[13px] py-[9px] text-xs font-bold text-muted max-[560px]:hidden">Guest journey</span>
        </div>
      </header>

      {!hydrated ? (
        <main className="grid min-h-[calc(100vh-146px)] place-content-center justify-items-center text-[#6f7d77]">
          <div className="motion-safe:animate-pulse text-[#b78b2b]"><GemIcon size={36} /></div>
          <p>Opening your journey…</p>
        </main>
      ) : view === "path" ? (
        <main>
          <Ripple className="overflow-hidden bg-[#071726]" amplitude={0.38} speed={0.55} wavelength={95} rings={2} decay={1.2} refraction={65} dispersion={0.25} shine={0.7} trigger="hover" interval={4.5}>
            <section className={pathHero}>
              <div className="absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_70%_18%,#76dcff_0_1px,transparent_2px),radial-gradient(circle_at_85%_72%,#fff_0_1px,transparent_2px)] bg-[length:120px_90px,170px_140px] opacity-30 motion-safe:animate-pulse" />
              <div className="absolute inset-x-0 bottom-0 -z-[1] h-[155px] bg-[linear-gradient(transparent,#061923b8)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_73%_50%,#28b5ff24,transparent_35%)]" />
              <div className={heroCopy}>
                <p className={cx(eyebrow, "text-[#c1d7ce]")}>English Bible · World English Bible</p>
                <h1 className={heroTitle}>Begin at the<br /><em>beginning.</em></h1>
                <p className="max-w-[510px] text-base leading-[1.8] text-[#e0eef2] text-shadow-[0_2px_12px_#020b12] max-[560px]:text-[13px] max-[560px]:leading-[1.65]">Explore Genesis through sound, story, word puzzles, passage meaning, and vivid scene matching.</p>
                <button className={cx(focusRing, "mt-3 inline-flex min-h-12 cursor-pointer items-center gap-[26px] rounded-full border-0 bg-[#f5d986] px-[22px] font-extrabold text-[#31280f] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_#082d282d]")} onClick={() => setView("unit")}>{completeCount ? "Continue Unit 1" : "Start Unit 1"}<ArrowIcon size={18} /></button>
              </div>
              <div className={heroAccent} aria-hidden="true">
                <SparkleIcon className="max-[720px]:hidden" size={24}/>
                <span className="mt-[18px] text-[9px] font-extrabold tracking-[0.28em] text-[#bfe9f7] max-[720px]:m-0">GENESIS</span>
                <strong className="font-display text-[68px] font-normal leading-none max-[900px]:text-[55px] max-[720px]:text-[34px]">01</strong>
                <small className="mt-2.5 font-display text-sm italic text-[#e7f6fa] max-[720px]:hidden">In the beginning</small>
              </div>
            </section>
          </Ripple>

          <section className="mx-auto max-w-[1080px] px-[30px] pb-[90px] pt-[72px] max-[560px]:px-[17px] max-[560px]:pt-[50px]" aria-labelledby="journey-heading">
            <div className="mb-[30px] flex items-end justify-between">
              <div><p className={eyebrow}>The book of beginnings</p><h2 className={cx(displayHeading, "m-0 text-[42px] max-[560px]:text-[34px]")} id="journey-heading">Genesis journey</h2></div>
              <p className="text-[13px] text-muted max-[560px]:hidden">6 units · 50 chapters</p>
            </div>
            <div className="relative grid gap-3.5 before:absolute before:top-[70px] before:bottom-[70px] before:left-[43px] before:border-l-2 before:border-dashed before:border-[#cad3cc] max-[560px]:before:left-8">
              <article
                className={cx(unitCard, "border-[#9eb9ae] bg-cover bg-[center_right] shadow-soft")}
                style={journeyCardArtwork("/images/genesis/creation-and-fall.png")}
              >
                <div className={unitNumber}><span>UNIT</span><strong>1</strong></div>
                <div>
                  <div className={unitTopline}><span>Genesis 1–3</span>{progress.gemAwarded && <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3ce] px-[7px] py-1 text-[#8c650c] max-[560px]:hidden"><GemIcon size={14}/> Badge earned</span>}</div>
                  <h3 className={unitTitle}>Creation and the Fall</h3>
                  <p className="m-0 text-[13px] leading-[1.55] text-muted max-[560px]:hidden">From the first light to the garden, the choice, and the promise beyond it.</p>
                  <div className="mt-[17px] flex items-center gap-3">
                    <div className="h-[5px] w-[190px] overflow-hidden rounded-full bg-[#e7e9e4] max-[560px]:w-[100px]"><span className="block h-full rounded-[inherit] bg-[linear-gradient(90deg,#1d6759,#d6ac45)]" style={{ width: `${percent}%` }} /></div>
                    <small className="text-[#708079] max-[560px]:text-[9px]">{completeCount} of {quests.length} quests</small>
                  </div>
                </div>
                <button className={cx(focusRing, roundControl, "cursor-pointer border-0 bg-forest text-white")} onClick={() => setView("unit")} aria-label="Open Unit 1"><ArrowIcon size={20}/></button>
              </article>
              {upcomingUnits.map((unit) => (
                <article
                  className={cx(unitCard, "locked-unit", unit.imageSource && "bg-cover bg-[center_right]")}
                  style={unit.imageSource ? journeyCardArtwork(unit.imageSource) : undefined}
                  key={unit.number}
                >
                  <div className={cx(unitNumber, "bg-[#e5e7e1] text-[#6f7d77] [&_span]:text-[#84908b]")}><span>UNIT</span><strong>{unit.number}</strong></div>
                  <div>
                    <div className={unitTopline}><span>{unit.chapters}</span></div>
                    <h3 className={unitTitle}>{unit.title}</h3>
                    <p className="m-0 text-[13px] leading-[1.55] text-muted max-[560px]:hidden">Continue the Genesis story after completing the proof-of-concept unit.</p>
                  </div>
                  <div className={cx(roundControl, "bg-[#ecece7] text-[#87918d]", unit.imageSource && "bg-[#fffdf7dd]")}><LockIcon size={17}/></div>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="relative isolate mx-auto max-w-[1080px] overflow-clip px-[30px] pb-[90px] pt-7 max-[560px]:px-[17px]">
          <FloatingCreationSvgs variant="unit" />
          <button className={cx(iconTextButton, "relative z-[1]")} onClick={() => setView("path")}><BackIcon size={17}/> Genesis journey</button>
          <section className="relative z-[1] mt-[18px] grid min-h-[330px] grid-cols-[1fr_auto] items-center gap-[50px] overflow-hidden rounded-[28px] bg-[linear-gradient(90deg,#072f2bf2_0%,#125246d9_58%,#133d337d_100%),url('/images/genesis/creation-and-fall.png')] bg-cover bg-center px-[60px] py-[55px] text-white shadow-soft after:absolute after:-top-1/4 after:right-[8%] after:text-[330px] after:leading-none after:text-[#f6da8914] after:content-['✦'] max-[800px]:grid-cols-1 max-[800px]:px-10 max-[560px]:rounded-[22px] max-[560px]:px-[25px] max-[560px]:py-9">
            <div className="unit-hero-copy relative z-[1]">
              <p className={cx(eyebrow, "text-[#c1d7ce]")}>Unit 1 · Genesis 1–3</p>
              <h1 className={cx(displayHeading, "mb-[22px] text-[clamp(47px,6vw,69px)] leading-[.97] max-[560px]:text-5xl")}>Creation<br />and the Fall</h1>
              <p className="m-0 max-w-[580px] leading-[1.7] text-[#d0ded9]">Listen closely. Rebuild the words. Trace the story from a world without form to the gates of Eden.</p>
            </div>
            <div className="unit-progress-card relative z-[2] w-[220px] rounded-[22px] border border-[#ffffff24] bg-[#ffffff17] p-6 text-center backdrop-blur-lg max-[800px]:m-0 max-[800px]:flex max-[800px]:w-full max-[800px]:items-center max-[800px]:gap-5 max-[800px]:text-left max-[560px]:p-4">
              <div className="mx-auto mb-[18px] grid size-[118px] place-items-center rounded-full bg-[conic-gradient(#f5d986_var(--progress),#ffffff21_0)] p-2 max-[800px]:m-0 max-[800px]:size-[100px] max-[800px]:shrink-0 max-[560px]:size-[82px]" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}>
                <div className="grid size-full place-content-center rounded-full bg-[#174b42]"><strong className="font-display text-[25px] font-medium">{percent}%</strong><span className="text-[9px] uppercase tracking-[0.12em] text-[#b7ccc5]">complete</span></div>
              </div>
              <div><p className="mb-[5px] font-extrabold">{completeCount} of {quests.length} quests</p><small className="block text-[10px] leading-[1.5] text-[#b9ccc5]">Your progress is saved on this device.</small></div>
            </div>
          </section>

          <div className="relative z-[1]">
            <AudioLibrary started={progress.audioStarted} onStarted={(chapter) => updateProgress((current) => current.audioStarted.includes(chapter) ? current : { ...current, audioStarted: [...current.audioStarted, chapter] })} />

            <section className={sectionWrap} aria-labelledby="verse-heading">
              <div className={sectionHeadingRow}><div className={sectionIcon}><PuzzleIcon size={22}/></div><div><p className={cx("eyebrow", eyebrow, "mb-[3px]")}>Remember the words</p><h2 className={sectionTitle} id="verse-heading">Verse-order puzzles</h2></div><span className={sectionCount}>{completedFor(verseQuests.map((quest) => quest.id))}/{verseQuests.length}</span></div>
              <div className="grid grid-cols-2 gap-3 max-[800px]:grid-cols-1">
                {versePuzzles.map((puzzle, index) => {
                  const done = isQuestComplete(progress, puzzle.id);
                  return (
                    <button className={cx(sectionCard, done && "border-[#bbd0c5] bg-[#f6faf6]")} key={puzzle.id} onClick={() => setActivity({ type: "verse", id: puzzle.id })}>
                      <span className="font-display text-[22px] text-[#af8d43]">{String(index + 1).padStart(2,"0")}</span>
                      <div><span className="text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#71817b]">Verse puzzle</span><h3 className="my-[5px] font-display text-[21px] font-medium">{puzzle.reference}</h3><p className="m-0 text-[11px] leading-[1.45] text-muted">{puzzle.prompt}</p></div>
                      <span className={cx("grid size-8 place-items-center self-center rounded-full bg-[#edf0ed] text-[#5b7169]", done && "bg-[#2b7162] text-white")}>{done ? <CheckIcon size={17}/> : <ArrowIcon size={17}/>}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={sectionWrap} aria-labelledby="story-heading">
              <div className={sectionHeadingRow}><div className={sectionIcon}><LayersIcon size={22}/></div><div><p className={cx("eyebrow", eyebrow, "mb-[3px]")}>See the whole arc</p><h2 className={sectionTitle} id="story-heading">Story-sequencing games</h2></div><span className={sectionCount}>{completedFor(storyQuests.map((quest) => quest.id))}/{storyQuests.length}</span></div>
              <div className="grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
                {storySequences.map((story) => {
                  const done = isQuestComplete(progress, story.id);
                  return (
                    <button className={storyCard} key={story.id} onClick={() => setActivity({ type: "story", id: story.id })}>
                      <div className="relative flex min-h-[190px] flex-col items-center justify-end bg-cover bg-center p-4 text-[#f4dea1] max-[560px]:min-h-[175px]" role="img" aria-label={story.imageAlt} style={{ backgroundImage: `linear-gradient(180deg,#0a2b2412 20%,#071f1bcf 100%),url("${story.previewImage}")` }}><small className="relative m-0 rounded-full bg-[#06251fc7] px-2.5 py-[7px] text-[9px] uppercase tracking-[0.1em] text-white">{story.cards.length} moments</small></div>
                      <div className="p-[25px] max-[560px]:px-4 max-[560px]:py-5"><span className="text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#71817b]">Story sequence</span><h3 className="my-[7px] font-display text-2xl font-medium">{story.title}</h3><p className="text-[11px] text-muted">{story.reference}</p><span className={storyCta}>{done ? <><CheckIcon size={16}/> Completed</> : <>Begin sequence <ArrowIcon size={16}/></>}</span></div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={sectionWrap} aria-labelledby="understanding-heading">
              <div className={sectionHeadingRow}><div className={sectionIcon}><SparkleIcon size={22}/></div><div><p className={cx("eyebrow", eyebrow, "mb-[3px]")}>Understand the passage</p><h2 className={sectionTitle} id="understanding-heading">Meaning and picture quests</h2></div><span className={sectionCount}>{completedFor(understandingQuests.map((quest) => quest.id))}/{understandingQuests.length}</span></div>
              <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                {passageClassifications.map((quest) => {
                  const done = isQuestComplete(progress, quest.id);
                  return (
                    <button className={cx(understandingCard, done && "border-[#a6c6b7] bg-[#f7fbf8]")} key={quest.id} onClick={() => setActivity({ type: "classification", id: quest.id })}>
                      <div className="flex min-h-[220px] flex-col items-center justify-center bg-[linear-gradient(#123e32a3,#123e32d9),url('/images/genesis/eden-trees-close.webp')] bg-cover bg-center text-[#f6e5aa] max-[900px]:min-h-[210px] max-[720px]:min-h-[190px] max-[560px]:min-h-[180px] max-[360px]:min-h-[110px]"><span className="font-display text-[62px] font-medium">?</span><small className="mt-[18px] text-[8px] uppercase tracking-[0.1em] text-[#fffbd0]">{quest.rounds.length} passages</small></div>
                      <div className="px-6 py-[26px] max-[560px]:px-4 max-[560px]:py-5 max-[360px]:p-[18px]"><span className="text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#71817b]">Passage meaning</span><h3 className="my-[7px] font-display text-2xl font-medium max-[560px]:text-xl">{quest.title}</h3><p className="m-0 text-[11px] leading-[1.55] text-muted max-[560px]:hidden">Classify each passage and learn why the answer fits.</p><span className={storyCta}>{done ? <><CheckIcon size={16}/> Completed</> : <>Explore meaning <ArrowIcon size={16}/></>}</span></div>
                    </button>
                  );
                })}
                {pictureMatches.map((quest) => {
                  const done = isQuestComplete(progress, quest.id);
                  return (
                    <button className={cx(understandingCard, done && "border-[#a6c6b7] bg-[#f7fbf8]")} key={quest.id} onClick={() => setActivity({ type: "picture-match", id: quest.id })}>
                      <div className="flex min-h-[220px] flex-col items-center justify-center bg-[linear-gradient(#061c2c52,#061c2cb8),url('/images/genesis/creation-stars.webp')] bg-cover bg-center text-[#f6e5aa] max-[900px]:min-h-[210px] max-[720px]:min-h-[190px] max-[560px]:min-h-[180px] max-[360px]:min-h-[110px]"><span className="font-display text-[62px] font-medium">✦</span><small className="mt-[18px] text-[8px] uppercase tracking-[0.1em] text-[#fffbd0]">{quest.pairs.length} scenes</small></div>
                      <div className="px-6 py-[26px] max-[560px]:px-4 max-[560px]:py-5 max-[360px]:p-[18px]"><span className="text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#71817b]">Visual connection</span><h3 className="my-[7px] font-display text-2xl font-medium max-[560px]:text-xl">{quest.title}</h3><p className="m-0 text-[11px] leading-[1.55] text-muted max-[560px]:hidden">Connect creation, the first human, and Eden to Scripture.</p><span className={storyCta}>{done ? <><CheckIcon size={16}/> Completed</> : <>Match scenes <ArrowIcon size={16}/></>}</span></div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={cx("reward-card mt-[70px] flex items-center gap-[25px] rounded-[25px] border border-[#355b52] bg-[linear-gradient(120deg,#173c35,#0a2c27)] px-[38px] py-8 text-white max-[560px]:flex-wrap max-[560px]:items-start max-[560px]:px-[22px] max-[560px]:py-[27px]", progress.gemAwarded && "border-[#a5843b] bg-[linear-gradient(120deg,#3d321b,#6f561e)]")}>
              <div className="grid size-[84px] shrink-0 place-items-center overflow-visible rounded-full bg-[radial-gradient(circle,#fff1a42e,transparent_67%)] text-[#f5d986] max-[560px]:size-[58px] [&_.reward-art-icon]:drop-shadow-[0_10px_14px_#0006]"><GemIcon size={66}/></div>
              <div><p className={eyebrow}>Unit reward</p><h2 className={cx(displayHeading, "mb-[7px] mt-[3px] text-[28px]")}>{progress.gemAwarded ? "Creation Badge collected" : "The Creation Badge awaits"}</h2><p className={cx("m-0 text-xs text-[#c9d7d2]", progress.gemAwarded && "text-[#eee0b8]")}>{progress.gemAwarded ? (progress.legacyGemAwarded && completeCount < quests.length ? `Creation Badge collected · ${quests.length - completeCount} new quests available.` : "A reminder that you completed Genesis 1–3.") : `${quests.length - completeCount} quests remain. Complete all ten quests to earn it.`}</p></div>
              {progress.gemAwarded && <button className={cx("secondary-button ml-auto whitespace-nowrap max-[560px]:ml-[83px]", secondaryButton)} onClick={() => setCelebrating(true)}>View reward</button>}
            </section>

            {progress.gemAwarded && <FeedbackForm anonymousId={progress.anonymousId} submitted={progress.feedbackSubmitted} onSubmitted={() => updateProgress((current) => ({ ...current, feedbackSubmitted: true }))} />}
            <div className="mt-[35px] text-center"><button className={cx(textButton, "font-semibold text-[#86918d]")} onClick={() => { if (window.confirm("Reset all local proof-of-concept progress?")) resetProgress(); }}>Reset this journey</button></div>
          </div>
        </main>
      )}

      <footer className="flex min-h-[70px] items-center justify-between border-t border-[#dcdcd3] px-[max(30px,calc((100vw-1080px)/2))] text-[9px] uppercase tracking-[0.06em] text-[#7e8984] max-[560px]:flex-col max-[560px]:justify-center max-[560px]:gap-2 max-[560px]:p-[18px]"><span>JX Bible Journey · Proof of concept</span><span>World English Bible · Public domain</span></footer>
      <Celebration open={celebrating} onClose={() => setCelebrating(false)} />
    </div>
  );
}
