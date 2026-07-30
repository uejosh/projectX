"use client";

import { useRef, useState } from "react";
import { audioChapters } from "@/data/content";
import { CheckIcon, HeadphonesIcon, PauseIcon, PlayIcon } from "@/components/Icons";
import { cx, eyebrow, focusRing, sectionHeadingRow, sectionIcon, sectionTitle, sectionWrap } from "@/lib/styles";

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
    <section className={sectionWrap} aria-labelledby="listen-heading">
      <div className={sectionHeadingRow}>
        <div className={sectionIcon}><HeadphonesIcon size={22} /></div>
        <div>
          <p className={cx("eyebrow", eyebrow, "mb-[3px]")}>Listen first or return when you need a hint</p>
          <h2 className={sectionTitle} id="listen-heading">Genesis 1-3 audio</h2>
        </div>
      </div>
      <div className="grid grid-cols-3 items-start gap-3.5 max-[800px]:grid-cols-1">
        {audioChapters.map((item) => {
          const hasStarted = started.includes(item.chapter);
          const isActive = active === item.chapter;
          const isPlaying = isActive && playing;
          const duration = durations[item.chapter] ?? 0;
          const currentTime = currentTimes[item.chapter] ?? 0;
          return (
            <article className={cx("audio-card min-w-0 rounded-[19px] border border-line bg-paper p-5 transition-all duration-200 max-[560px]:p-4", isActive && "border-[#7fa497] shadow-[0_10px_30px_#14463a1a]")} key={item.chapter}>
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[13px]">
                <div className="font-display text-[27px] font-medium text-[#a68435]">0{item.chapter}</div>
                <div>
                  <div className="flex justify-between text-[9px] uppercase tracking-[0.07em] text-[#75837e]">
                    <span>Genesis {item.chapter}</span>
                    <span>{duration ? formatTime(duration) : item.duration}</span>
                  </div>
                  <h3 className="mb-[3px] mt-1.5 font-display text-lg font-medium">{item.title}</h3>
                  <p className="m-0 text-[10px] text-muted">{item.subtitle}</p>
                </div>
                {hasStarted && <span className="grid size-7 place-items-center rounded-full bg-[#2b7162] text-white" aria-label="Listening started"><CheckIcon size={15} /></span>}
              </div>

              <div className="mt-[18px] grid grid-cols-[auto_minmax(80px,1fr)] items-center gap-x-3 gap-y-2.5 border-t border-[#e8e5da] pt-4">
                <button className={cx(focusRing, "grid size-[42px] cursor-pointer place-items-center rounded-full border-0 bg-[#e3ece7] text-forest")} onClick={() => void toggleChapter(item.chapter)} aria-label={`${isPlaying ? "Pause" : "Play"} Genesis chapter ${item.chapter}`}>
                  {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                </button>
                <div className="min-w-0">
                  <input
                    className={cx(focusRing, "block h-[5px] w-full cursor-pointer accent-green disabled:cursor-not-allowed disabled:opacity-45")}
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => seek(item.chapter, Number(event.target.value))}
                    aria-label={`Seek Genesis chapter ${item.chapter}`}
                    disabled={!duration}
                  />
                  <div className="mt-1.5 flex justify-between text-[9px] text-[#71807a] tabular-nums"><span>{formatTime(currentTime)}</span><span>{duration ? formatTime(duration) : "--:--"}</span></div>
                </div>
                <div className="col-span-full flex justify-end gap-[5px]" role="group" aria-label={`Playback speed for Genesis chapter ${item.chapter}`}>
                  {[1, 1.5].map((rate) => (
                    <button
                      key={rate}
                      className={cx(
                        focusRing,
                        "h-[29px] min-w-[43px] cursor-pointer rounded-full border border-[#ced7d1] bg-white text-[10px] font-extrabold text-[#5a7068]",
                        playbackRate === rate && "border-forest bg-forest text-white",
                      )}
                      onClick={() => changeRate(rate as 1 | 1.5)}
                      aria-pressed={playbackRate === rate}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {errors[item.chapter] && <p className="mb-0 mt-3 rounded-[9px] bg-[#f7e1dd] px-[11px] py-[9px] text-[10px] leading-[1.4] text-[#833a31]" role="alert">This chapter could not play. Check your connection and try again.</p>}
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
      <p className="mx-[3px] mb-0 mt-3 text-[10px] text-[#7a8581]">
        Audio: World English Bible, read by Winfred W. Henson. Public-domain recording provided by{" "}
        <a className={cx(focusRing, "text-inherit")} href="https://ebible.org/eng-web/audio/" target="_blank" rel="noreferrer">eBible.org</a>.
      </p>
    </section>
  );
}
