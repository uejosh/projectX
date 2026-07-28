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

type Activity = QuestRef | null;
type QuestCelebrationState = { title: string; earnsGem: boolean } | null;

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
    <div className="site-shell" ref={shellRef}>
      <header className="site-header">
        <button className="brand" onClick={() => { setView("path"); setActivity(null); }} aria-label="JX Bible journey home">
          <span className="brand-mark"><BookIcon size={21} /></span><span><strong>JX</strong><small>Bible Journey</small></span>
        </button>
        <div className="header-actions">
          <button className="sound-toggle" onClick={() => updateProgress((current) => ({ ...current, soundEnabled: !current.soundEnabled }))} aria-label={progress.soundEnabled ? "Mute celebration sounds" : "Turn on celebration sounds"} aria-pressed={!progress.soundEnabled}>{progress.soundEnabled ? <VolumeIcon size={17} /> : <VolumeOffIcon size={17} />}</button>
          <div className="coin-counter" aria-label={`${coins} gold coins earned`}><CoinIcon size={18} /><strong>{coins}</strong></div>
          <div className="gem-counter" aria-label={`${progress.gemAwarded ? 1 : 0} Creation badges earned`}><GemIcon size={18} /><strong>{progress.gemAwarded ? 1 : 0}</strong></div>
          <span className="guest-pill">Guest journey</span>
        </div>
      </header>

      {!hydrated ? <main className="loading-state"><div className="loading-gem"><GemIcon size={36} /></div><p>Opening your journey…</p></main> : view === "path" ? (
        <main className="path-page">
          <Ripple className="path-hero-ripple" amplitude={0.38} speed={0.55} wavelength={95} rings={2} decay={1.2} refraction={65} dispersion={0.25} shine={0.7} trigger="hover" interval={4.5}>
            <section className="path-hero">
              <div className="hero-glow" />
              <div className="hero-copy">
                <p className="eyebrow light">English Bible · World English Bible</p>
                <h1>Begin at the<br /><em>beginning.</em></h1>
                <p>Explore Genesis through sound, story, word puzzles, passage meaning, and vivid scene matching.</p>
                <button className="hero-button" onClick={() => setView("unit")}>{completeCount ? "Continue Unit 1" : "Start Unit 1"}<ArrowIcon size={18} /></button>
              </div>
              <div className="hero-image-accent" aria-hidden="true"><SparkleIcon size={24}/><span>GENESIS</span><strong>01</strong><small>In the beginning</small></div>
            </section>
          </Ripple>

          <section className="journey-section" aria-labelledby="journey-heading">
            <div className="journey-heading"><div><p className="eyebrow">The book of beginnings</p><h2 id="journey-heading">Genesis journey</h2></div><p>6 units · 50 chapters</p></div>
            <div className="path-list">
              <article className="unit-card active-unit">
                <div className="unit-number"><span>UNIT</span><strong>1</strong></div>
                <div className="unit-copy"><div className="unit-topline"><span>Genesis 1–3</span>{progress.gemAwarded && <span className="earned-label"><GemIcon size={14}/> Badge earned</span>}</div><h3>Creation and the Fall</h3><p>From the first light to the garden, the choice, and the promise beyond it.</p><div className="unit-progress"><div><span style={{ width: `${percent}%` }} /></div><small>{completeCount} of {quests.length} quests</small></div></div>
                <button className="round-arrow" onClick={() => setView("unit")} aria-label="Open Unit 1"><ArrowIcon size={20}/></button>
              </article>
              {upcomingUnits.map((unit) => <article className={`unit-card locked-unit ${unit.imageSource ? "has-unit-art" : ""}`} style={unit.imageSource ? { "--unit-art": `url("${unit.imageSource}")` } as React.CSSProperties : undefined} key={unit.number}><div className="unit-number"><span>UNIT</span><strong>{unit.number}</strong></div><div className="unit-copy"><div className="unit-topline"><span>{unit.chapters}</span></div><h3>{unit.title}</h3><p>Continue the Genesis story after completing the proof-of-concept unit.</p></div><div className="locked-icon"><LockIcon size={17}/></div></article>)}
            </div>
          </section>
        </main>
      ) : (
        <main className="unit-page">
          <FloatingCreationSvgs variant="unit" />
          <button className="back-button" onClick={() => setView("path")}><BackIcon size={17}/> Genesis journey</button>
          <section className="unit-hero">
            <div className="unit-hero-copy"><p className="eyebrow light">Unit 1 · Genesis 1–3</p><h1>Creation<br />and the Fall</h1><p>Listen closely. Rebuild the words. Trace the story from a world without form to the gates of Eden.</p></div>
            <div className="unit-progress-card"><div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{percent}%</strong><span>complete</span></div></div><div><p>{completeCount} of {quests.length} quests</p><small>Your progress is saved on this device.</small></div></div>
          </section>

          <AudioLibrary started={progress.audioStarted} onStarted={(chapter) => updateProgress((current) => current.audioStarted.includes(chapter) ? current : { ...current, audioStarted: [...current.audioStarted, chapter] })} />

          <section className="content-section" aria-labelledby="verse-heading">
            <div className="section-heading-row"><div className="section-icon"><PuzzleIcon size={22}/></div><div><p className="eyebrow">Remember the words</p><h2 id="verse-heading">Verse-order puzzles</h2></div><span className="section-count">{completedFor(verseQuests.map((quest) => quest.id))}/{verseQuests.length}</span></div>
            <div className="activity-grid verse-grid">
              {versePuzzles.map((puzzle, index) => { const done = isQuestComplete(progress, puzzle.id); return <button className={`activity-card ${done ? "is-complete" : ""}`} key={puzzle.id} onClick={() => setActivity({ type: "verse", id: puzzle.id })}><span className="activity-index">{String(index + 1).padStart(2,"0")}</span><div><span className="card-type">Verse puzzle</span><h3>{puzzle.reference}</h3><p>{puzzle.prompt}</p></div><span className="card-status">{done ? <CheckIcon size={17}/> : <ArrowIcon size={17}/>}</span></button>; })}
            </div>
          </section>

          <section className="content-section story-section" aria-labelledby="story-heading">
            <div className="section-heading-row"><div className="section-icon"><LayersIcon size={22}/></div><div><p className="eyebrow">See the whole arc</p><h2 id="story-heading">Story-sequencing games</h2></div><span className="section-count">{completedFor(storyQuests.map((quest) => quest.id))}/{storyQuests.length}</span></div>
            <div className="story-game-grid">
              {storySequences.map((story, index) => { const done = isQuestComplete(progress, story.id); return <button className={`story-game-card ${done ? "is-complete" : ""}`} key={story.id} onClick={() => setActivity({ type: "story", id: story.id })}><div className={`story-game-art art-${index + 1}`} role="img" aria-label={story.imageAlt} style={{ "--story-art": `url("${story.previewImage}")` } as React.CSSProperties}><small>{story.cards.length} moments</small></div><div className="story-game-copy"><span className="card-type">Story sequence</span><h3>{story.title}</h3><p>{story.reference}</p><span className="story-cta">{done ? <><CheckIcon size={16}/> Completed</> : <>Begin sequence <ArrowIcon size={16}/></>}</span></div></button>; })}
            </div>
          </section>

          <section className="content-section understanding-section" aria-labelledby="understanding-heading">
            <div className="section-heading-row"><div className="section-icon"><SparkleIcon size={22}/></div><div><p className="eyebrow">Understand the passage</p><h2 id="understanding-heading">Meaning and picture quests</h2></div><span className="section-count">{completedFor(understandingQuests.map((quest) => quest.id))}/{understandingQuests.length}</span></div>
            <div className="understanding-grid">
              {passageClassifications.map((quest) => { const done = isQuestComplete(progress, quest.id); return <button className={`understanding-card classification-preview ${done ? "is-complete" : ""}`} key={quest.id} onClick={() => setActivity({ type: "classification", id: quest.id })}><div className="understanding-art"><span>?</span><small>{quest.rounds.length} passages</small></div><div><span className="card-type">Passage meaning</span><h3>{quest.title}</h3><p>Classify each passage and learn why the answer fits.</p><span className="story-cta">{done ? <><CheckIcon size={16}/> Completed</> : <>Explore meaning <ArrowIcon size={16}/></>}</span></div></button>; })}
              {pictureMatches.map((quest) => { const done = isQuestComplete(progress, quest.id); return <button className={`understanding-card picture-preview ${done ? "is-complete" : ""}`} key={quest.id} onClick={() => setActivity({ type: "picture-match", id: quest.id })}><div className="understanding-art"><span>✦</span><small>{quest.pairs.length} scenes</small></div><div><span className="card-type">Visual connection</span><h3>{quest.title}</h3><p>Connect creation, the first human, and Eden to Scripture.</p><span className="story-cta">{done ? <><CheckIcon size={16}/> Completed</> : <>Match scenes <ArrowIcon size={16}/></>}</span></div></button>; })}
            </div>
          </section>
          <section className={`reward-card ${progress.gemAwarded ? "earned" : ""}`}>
            <div className="reward-gem"><GemIcon size={66}/></div><div><p className="eyebrow">Unit reward</p><h2>{progress.gemAwarded ? "Creation Badge collected" : "The Creation Badge awaits"}</h2><p>{progress.gemAwarded ? (progress.legacyGemAwarded && completeCount < quests.length ? `Creation Badge collected · ${quests.length - completeCount} new quests available.` : "A reminder that you completed Genesis 1–3.") : `${quests.length - completeCount} quests remain. Complete all ten quests to earn it.`}</p></div>{progress.gemAwarded && <button className="secondary-button" onClick={() => setCelebrating(true)}>View reward</button>}
          </section>

          {progress.gemAwarded && <FeedbackForm anonymousId={progress.anonymousId} submitted={progress.feedbackSubmitted} onSubmitted={() => updateProgress((current) => ({ ...current, feedbackSubmitted: true }))} />}
          <div className="reset-area"><button className="text-button muted" onClick={() => { if (window.confirm("Reset all local proof-of-concept progress?")) resetProgress(); }}>Reset this journey</button></div>
        </main>
      )}

      <footer><span>JX Bible Journey · Proof of concept</span><span>World English Bible · Public domain</span></footer>
      <Celebration open={celebrating} onClose={() => setCelebrating(false)} />
    </div>
  );
}
