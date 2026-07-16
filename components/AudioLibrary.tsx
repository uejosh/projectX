"use client";

import { useRef, useState } from "react";
import { audioChapters } from "@/data/content";
import { CheckIcon, HeadphonesIcon, PlayIcon } from "@/components/Icons";

type Props = {
  started: number[];
  onStarted: (chapter: number) => void;
};

export function AudioLibrary({ started, onStarted }: Props) {
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});
  const [active, setActive] = useState<number | null>(null);

  function playChapter(chapter: number) {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (Number(key) !== chapter) audio?.pause();
    });
    const audio = audioRefs.current[chapter];
    if (!audio) return;
    void audio.play();
    setActive(chapter);
    onStarted(chapter);
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
          return (
            <article className={`audio-card ${active === item.chapter ? "is-active" : ""}`} key={item.chapter}>
              <div className="audio-number">0{item.chapter}</div>
              <div className="audio-copy">
                <div className="audio-meta">
                  <span>Genesis {item.chapter}</span>
                  <span>{item.duration}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <button className="audio-play" onClick={() => playChapter(item.chapter)} aria-label={`Play Genesis chapter ${item.chapter}`}>
                {hasStarted ? <CheckIcon size={18} /> : <PlayIcon size={18} />}
              </button>
              <audio
                ref={(node) => { audioRefs.current[item.chapter] = node; }}
                src={item.source}
                preload="none"
                onPlay={() => { setActive(item.chapter); onStarted(item.chapter); }}
                onPause={() => setActive((current) => current === item.chapter ? null : current)}
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

