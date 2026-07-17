export const PROGRESS_KEY = "jx-genesis-poc-progress-v1";

export type ProgressState = {
  version: 2;
  anonymousId: string;
  completedVerseIds: string[];
  completedStoryIds: string[];
  coinAwardedQuestIds: string[];
  audioStarted: number[];
  gemAwarded: boolean;
  feedbackSubmitted: boolean;
  soundEnabled: boolean;
  lastUpdated: string;
};

export const REQUIRED_VERSE_COUNT = 6;
export const REQUIRED_STORY_COUNT = 2;
export const REQUIRED_ACTIVITY_COUNT = REQUIRED_VERSE_COUNT + REQUIRED_STORY_COUNT;

export function createInitialProgress(anonymousId = "guest-pending"): ProgressState {
  return {
    version: 2,
    anonymousId,
    completedVerseIds: [],
    completedStoryIds: [],
    coinAwardedQuestIds: [],
    audioStarted: [],
    gemAwarded: false,
    feedbackSubmitted: false,
    soundEnabled: true,
    lastUpdated: new Date(0).toISOString(),
  };
}

function uniqueStrings(value: unknown) {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string"))]
    : [];
}

export function normalizeProgress(value: unknown, anonymousId: string): ProgressState {
  if (!value || typeof value !== "object") return createInitialProgress(anonymousId);
  const candidate = value as Partial<ProgressState>;
  const completedVerseIds = uniqueStrings(candidate.completedVerseIds);
  const completedStoryIds = uniqueStrings(candidate.completedStoryIds);
  const isVersionTwo = candidate.version === 2;
  const coinAwardedQuestIds = isVersionTwo && Array.isArray(candidate.coinAwardedQuestIds)
    ? uniqueStrings(candidate.coinAwardedQuestIds)
    : [...new Set([...completedVerseIds, ...completedStoryIds])];
  return {
    version: 2,
    anonymousId: typeof candidate.anonymousId === "string" ? candidate.anonymousId : anonymousId,
    completedVerseIds,
    completedStoryIds,
    coinAwardedQuestIds,
    audioStarted: Array.isArray(candidate.audioStarted)
      ? [...new Set(candidate.audioStarted.filter((item): item is number => Number.isInteger(item)))]
      : [],
    gemAwarded: Boolean(candidate.gemAwarded),
    feedbackSubmitted: Boolean(candidate.feedbackSubmitted),
    soundEnabled: isVersionTwo ? candidate.soundEnabled !== false : true,
    lastUpdated: typeof candidate.lastUpdated === "string" ? candidate.lastUpdated : new Date(0).toISOString(),
  };
}

export function completedActivityCount(progress: ProgressState) {
  return progress.completedVerseIds.length + progress.completedStoryIds.length;
}

export function coinCount(progress: ProgressState) {
  return new Set(progress.coinAwardedQuestIds).size;
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
