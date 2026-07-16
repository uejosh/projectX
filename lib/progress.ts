export const PROGRESS_KEY = "jx-genesis-poc-progress-v1";

export type ProgressState = {
  version: 1;
  anonymousId: string;
  completedVerseIds: string[];
  completedStoryIds: string[];
  audioStarted: number[];
  gemAwarded: boolean;
  feedbackSubmitted: boolean;
  lastUpdated: string;
};

export const REQUIRED_VERSE_COUNT = 6;
export const REQUIRED_STORY_COUNT = 2;
export const REQUIRED_ACTIVITY_COUNT = REQUIRED_VERSE_COUNT + REQUIRED_STORY_COUNT;

export function createInitialProgress(anonymousId = "guest-pending"): ProgressState {
  return {
    version: 1,
    anonymousId,
    completedVerseIds: [],
    completedStoryIds: [],
    audioStarted: [],
    gemAwarded: false,
    feedbackSubmitted: false,
    lastUpdated: new Date(0).toISOString(),
  };
}

export function normalizeProgress(value: unknown, anonymousId: string): ProgressState {
  if (!value || typeof value !== "object") return createInitialProgress(anonymousId);
  const candidate = value as Partial<ProgressState>;
  return {
    version: 1,
    anonymousId: typeof candidate.anonymousId === "string" ? candidate.anonymousId : anonymousId,
    completedVerseIds: Array.isArray(candidate.completedVerseIds)
      ? candidate.completedVerseIds.filter((item): item is string => typeof item === "string")
      : [],
    completedStoryIds: Array.isArray(candidate.completedStoryIds)
      ? candidate.completedStoryIds.filter((item): item is string => typeof item === "string")
      : [],
    audioStarted: Array.isArray(candidate.audioStarted)
      ? candidate.audioStarted.filter((item): item is number => Number.isInteger(item))
      : [],
    gemAwarded: Boolean(candidate.gemAwarded),
    feedbackSubmitted: Boolean(candidate.feedbackSubmitted),
    lastUpdated: typeof candidate.lastUpdated === "string" ? candidate.lastUpdated : new Date(0).toISOString(),
  };
}

export function completedActivityCount(progress: ProgressState) {
  return progress.completedVerseIds.length + progress.completedStoryIds.length;
}

export function isJourneyComplete(progress: ProgressState) {
  return (
    progress.completedVerseIds.length >= REQUIRED_VERSE_COUNT &&
    progress.completedStoryIds.length >= REQUIRED_STORY_COUNT
  );
}

export function progressPercent(progress: ProgressState) {
  return Math.min(100, Math.round((completedActivityCount(progress) / REQUIRED_ACTIVITY_COUNT) * 100));
}

