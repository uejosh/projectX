"use client";

import { useState } from "react";
import { AudioLibrary } from "@/components/AudioLibrary";
import { Celebration } from "@/components/Celebration";
import { FeedbackForm } from "@/components/FeedbackForm";
import { StorySequence } from "@/components/StorySequence";
import { VersePuzzle } from "@/components/VersePuzzle";
import { ArrowIcon, BackIcon, BookIcon, CheckIcon, GemIcon, LayersIcon, LockIcon, PuzzleIcon, SparkleIcon } from "@/components/Icons";
import { storySequences, upcomingUnits, versePuzzles } from "@/data/content";
import { completedActivityCount, progressPercent } from "@/lib/progress";
import { useProgress } from "@/components/useProgress";

type Activity = { type: "verse"; id: string } | { type: "story"; id: string } | null;

export function GenesisApp() {
  const { progress, hydrated, updateProgress, resetProgress } = useProgress();
  const [view, setView] = useState<"path" | "unit">("path");
  const [activity, setActivity] = useState<Activity>(null);
  const [celebrating, setCelebrating] = useState(false);


  function completeVerse(id: string) {
    if (progress.completedVerseIds.includes(id)) return;
    const completedVerseIds = [...progress.completedVerseIds, id];
    const earnsGem = !progress.gemAwarded && completedVerseIds.length >= 6 && progress.completedStoryIds.length >= 2;
    updateProgress((current) => ({ ...current, completedVerseIds, gemAwarded: current.gemAwarded || earnsGem }));
    if (earnsGem) setCelebrating(true);
  }

  function completeStory(id: string) {
    if (progress.completedStoryIds.includes(id)) return;
    const completedStoryIds = [...progress.completedStoryIds, id];
    const earnsGem = !progress.gemAwarded && progress.completedVerseIds.length >= 6 && completedStoryIds.length >= 2;
    updateProgress((current) => ({ ...current, completedStoryIds, gemAwarded: current.gemAwarded || earnsGem }));
    if (earnsGem) setCelebrating(true);
  }

  if (activity?.type === "verse") {
    const puzzle = versePuzzles.find((item) => item.id === activity.id)!;
    return <VersePuzzle puzzle={puzzle} completed={progress.completedVerseIds.includes(puzzle.id)} onComplete={() => completeVerse(puzzle.id)} onClose={() => setActivity(null)} />;
  }

  if (activity?.type === "story") {
    const story = storySequences.find((item) => item.id === activity.id)!;
    return <StorySequence story={story} completed={progress.completedStoryIds.includes(story.id)} onComplete={() => completeStory(story.id)} onClose={() => setActivity(null)} />;
  }

  const completeCount = completedActivityCount(progress);
  const percent = progressPercent(progress);

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => { setView("path"); setActivity(null); }} aria-label="JX Bible journey home">
          <span className="brand-mark"><BookIcon size={21} /></span><span><strong>JX</strong><small>Bible Journey</small></span>
        </button>
        <div className="header-actions">
          <div className="gem-counter" aria-label={`${progress.gemAwarded ? 1 : 0} gems earned`}><GemIcon size={18} /><strong>{progress.gemAwarded ? 1 : 0}</strong></div>
          <span className="guest-pill">Guest journey</span>
        </div>
      </header>

      {!hydrated ? <main className="loading-state"><div className="loading-gem"><GemIcon size={36} /></div><p>Opening your journey…</p></main> : view === "path" ? (
        <main className="path-page">
          <section className="path-hero">
            <div className="hero-glow" />
            <div className="hero-copy">
              <p className="eyebrow light">English Bible · World English Bible</p>
              <h1>Begin at the<br /><em>beginning.</em></h1>
              <p>Follow Genesis as a guided journey—listen to each chapter, rebuild its verses, and put its story in order.</p>
              <button className="hero-button" onClick={() => setView("unit")}>{completeCount ? "Continue Unit 1" : "Start Unit 1"}<ArrowIcon size={18} /></button>
            </div>
            <div className="hero-art" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><div className="world"><SparkleIcon size={35}/><span>GENESIS</span><strong>01</strong></div><i className="star s1">✦</i><i className="star s2">·</i><i className="star s3">✧</i></div>
          </section>

          <section className="journey-section" aria-labelledby="journey-heading">
            <div className="journey-heading"><div><p className="eyebrow">The book of beginnings</p><h2 id="journey-heading">Genesis journey</h2></div><p>6 units · 50 chapters</p></div>
            <div className="path-list">
              <article className="unit-card active-unit">
                <div className="unit-number"><span>UNIT</span><strong>1</strong></div>
                <div className="unit-copy"><div className="unit-topline"><span>Genesis 1–3</span>{progress.gemAwarded && <span className="earned-label"><GemIcon size={14}/> Gem earned</span>}</div><h3>Creation and the Fall</h3><p>From the first light to the garden, the choice, and the promise beyond it.</p><div className="unit-progress"><div><span style={{ width: `${percent}%` }} /></div><small>{completeCount} of 8 activities</small></div></div>
                <button className="round-arrow" onClick={() => setView("unit")} aria-label="Open Unit 1"><ArrowIcon size={20}/></button>
              </article>
              {upcomingUnits.map((unit) => <article className="unit-card locked-unit" key={unit.number}><div className="unit-number"><span>UNIT</span><strong>{unit.number}</strong></div><div className="unit-copy"><div className="unit-topline"><span>{unit.chapters}</span></div><h3>{unit.title}</h3><p>Continue the Genesis story after completing the proof-of-concept unit.</p></div><div className="locked-icon"><LockIcon size={17}/></div></article>)}
            </div>
          </section>
        </main>
      ) : (
        <main className="unit-page">
          <button className="back-button" onClick={() => setView("path")}><BackIcon size={17}/> Genesis journey</button>
          <section className="unit-hero">
            <div className="unit-hero-copy"><p className="eyebrow light">Unit 1 · Genesis 1–3</p><h1>Creation<br />and the Fall</h1><p>Listen closely. Rebuild the words. Trace the story from a world without form to the gates of Eden.</p></div>
            <div className="unit-progress-card"><div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{percent}%</strong><span>complete</span></div></div><div><p>{completeCount} of 8 activities</p><small>Your progress is saved on this device.</small></div></div>
          </section>

          <AudioLibrary started={progress.audioStarted} onStarted={(chapter) => updateProgress((current) => current.audioStarted.includes(chapter) ? current : { ...current, audioStarted: [...current.audioStarted, chapter] })} />

          <section className="content-section" aria-labelledby="verse-heading">
            <div className="section-heading-row"><div className="section-icon"><PuzzleIcon size={22}/></div><div><p className="eyebrow">Remember the words</p><h2 id="verse-heading">Verse-order puzzles</h2></div><span className="section-count">{progress.completedVerseIds.length}/6</span></div>
            <div className="activity-grid verse-grid">
              {versePuzzles.map((puzzle, index) => { const done = progress.completedVerseIds.includes(puzzle.id); return <button className={`activity-card ${done ? "is-complete" : ""}`} key={puzzle.id} onClick={() => setActivity({ type: "verse", id: puzzle.id })}><span className="activity-index">{String(index + 1).padStart(2,"0")}</span><div><span className="card-type">Verse puzzle</span><h3>{puzzle.reference}</h3><p>{puzzle.prompt}</p></div><span className="card-status">{done ? <CheckIcon size={17}/> : <ArrowIcon size={17}/>}</span></button>; })}
            </div>
          </section>

          <section className="content-section story-section" aria-labelledby="story-heading">
            <div className="section-heading-row"><div className="section-icon"><LayersIcon size={22}/></div><div><p className="eyebrow">See the whole arc</p><h2 id="story-heading">Story-sequencing games</h2></div><span className="section-count">{progress.completedStoryIds.length}/2</span></div>
            <div className="story-game-grid">
              {storySequences.map((story, index) => { const done = progress.completedStoryIds.includes(story.id); return <button className={`story-game-card ${done ? "is-complete" : ""}`} key={story.id} onClick={() => setActivity({ type: "story", id: story.id })}><div className={`story-game-art art-${index + 1}`}><span>{index === 0 ? "✦" : "⌁"}</span><small>{story.cards.length} moments</small></div><div className="story-game-copy"><span className="card-type">Story sequence</span><h3>{story.title}</h3><p>{story.reference}</p><span className="story-cta">{done ? <><CheckIcon size={16}/> Completed</> : <>Begin sequence <ArrowIcon size={16}/></>}</span></div></button>; })}
            </div>
          </section>

          <section className={`reward-card ${progress.gemAwarded ? "earned" : ""}`}>
            <div className="reward-gem"><GemIcon size={52}/></div><div><p className="eyebrow">Unit reward</p><h2>{progress.gemAwarded ? "Creation Gem collected" : "The Creation Gem awaits"}</h2><p>{progress.gemAwarded ? "A reminder that you completed Genesis 1–3." : `${8 - completeCount} activities remain. Complete every puzzle and sequence to earn it.`}</p></div>{progress.gemAwarded && <button className="secondary-button" onClick={() => setCelebrating(true)}>View reward</button>}
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
