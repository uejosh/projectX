"use client";

import { useEffect, useState } from "react";
import {
  PROGRESS_KEY,
  createInitialProgress,
  normalizeProgress,
  type ProgressState,
} from "@/lib/progress";

function makeAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadStoredProgress() {
  const anonymousId = makeAnonymousId();
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? normalizeProgress(JSON.parse(stored), anonymousId) : createInitialProgress(anonymousId);
  } catch {
    return createInitialProgress(anonymousId);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => createInitialProgress("pending"));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setProgress(loadStoredProgress());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  function updateProgress(updater: (current: ProgressState) => ProgressState) {
    setProgress((current) => ({ ...updater(current), lastUpdated: new Date().toISOString() }));
  }

  function resetProgress() {
    const fresh = createInitialProgress(makeAnonymousId());
    setProgress({ ...fresh, lastUpdated: new Date().toISOString() });
  }

  return { progress, hydrated, updateProgress, resetProgress };
}
