"use client";

import { useRef, useState } from "react";
import { audioChapters } from "@/data/content";
import { CheckIcon, HeadphonesIcon, PauseIcon, PlayIcon } from "@/components/Icons";

type Props = {
  started: number[];
  onStarted: (chapter: number) => void;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioLibrary({ started, onStarted }: Props) {
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTimes, setCurrentTimes] = useState<Record<number, number>>({});
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5>(1);
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  function pauseOtherChapters(chapter: number) {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (Number(key) !== chapter) audio?.pause();
    });
  }

  async function toggleChapter(chapter: number) {
    const audio = audioRefs.current[chapter];
    if (!audio) return;
    if (active === chapter && !audio.paused) {
      audio.pause();
      return;
    }
    pauseOtherChapters(chapter);
    audio.playbackRate = playbackRate;
    setErrors((current) => ({ ...current, [chapter]: false }));
    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setErrors((current) => ({ ...current, [chapter]: true }));
    }
  }

  function seek(chapter: number, value: number) {
    const audio = audioRefs.current[chapter];
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTimes((current) => ({ ...current, [chapter]: value }));
  }

  function changeRate(rate: 1 | 1.5) {
    setPlaybackRate(rate);
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) audio.playbackRate = rate;
    });
  }

  return (
    <section className="content-section audio-section" aria-labelledby="listen-heading">
      <div className="section-heading-row">
        <div className="section-icon"><HeadphonesIcon size={22} /></div>
        <div>
          <p className="eyebrow">Listen first or return when you need a hint</p>
          <h2 id="listen-heading">Genesis 1-3 audio</h2>
        </div>
      </div>
      <div className="audio-grid">
        {audioChapters.map((item) => {
          const hasStarted = started.includes(item.chapter);
          const isActive = active === item.chapter;
          const isPlaying = isActive && playing;
          const duration = durations[item.chapter] ?? 0;
          const currentTime = currentTimes[item.chapter] ?? 0;
          return (
            <article className={`audio-card ${isActive ? "is-active" : ""}`} key={item.chapter}>
              <div className="audio-card-heading">
                <div className="audio-number">0{item.chapter}</div>
                <div className="audio-copy">
                  <div className="audio-meta">
                    <span>Genesis {item.chapter}</span>
                    <span>{duration ? formatTime(duration) : item.duration}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                {hasStarted && <span className="audio-started" aria-label="Listening started"><CheckIcon size={15} /></span>}
              </div>

              <div className="audio-controls">
                <button className="audio-play" onClick={() => void toggleChapter(item.chapter)} aria-label={`${isPlaying ? "Pause" : "Play"} Genesis chapter ${item.chapter}`}>
                  {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                </button>
                <div className="audio-timeline">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => seek(item.chapter, Number(event.target.value))}
                    aria-label={`Seek Genesis chapter ${item.chapter}`}
                    disabled={!duration}
                  />
                  <div><span>{formatTime(currentTime)}</span><span>{duration ? formatTime(duration) : "--:--"}</span></div>
                </div>
                <div className="speed-control" role="group" aria-label={`Playback speed for Genesis chapter ${item.chapter}`}>
                  <button className={playbackRate === 1 ? "selected" : ""} onClick={() => changeRate(1)} aria-pressed={playbackRate === 1}>1x</button>
                  <button className={playbackRate === 1.5 ? "selected" : ""} onClick={() => changeRate(1.5)} aria-pressed={playbackRate === 1.5}>1.5x</button>
                </div>
              </div>

              {errors[item.chapter] && <p className="audio-error" role="alert">This chapter could not play. Check your connection and try again.</p>}
              <audio
                ref={(node) => { audioRefs.current[item.chapter] = node; }}
                src={item.source}
                preload="metadata"
                onLoadedMetadata={(event) => { const duration = event.currentTarget.duration; setDurations((current) => ({ ...current, [item.chapter]: duration })); }}
                onDurationChange={(event) => { const duration = event.currentTarget.duration; setDurations((current) => ({ ...current, [item.chapter]: duration })); }}
                onTimeUpdate={(event) => { const currentTime = event.currentTarget.currentTime; setCurrentTimes((current) => ({ ...current, [item.chapter]: currentTime })); }}
                onPlay={() => { setActive(item.chapter); setPlaying(true); onStarted(item.chapter); }}
                onPause={() => { if (active === item.chapter) setPlaying(false); }}
                onEnded={(event) => { event.currentTarget.currentTime = 0; setPlaying(false); setCurrentTimes((current) => ({ ...current, [item.chapter]: 0 })); }}
                onError={() => { setPlaying(false); setErrors((current) => ({ ...current, [item.chapter]: true })); }}
              />
            </article>
          );
        })}
      </div>
      <p className="source-note">
        Audio: World English Bible, read by Winfred W. Henson. Public-domain recording provided by{" "}
        <a href="https://ebible.org/eng-web/audio/" target="_blank" rel="noreferrer">eBible.org</a>.
      </p>
    </section>
  );
}
