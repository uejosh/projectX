import { canonicalQuestIds } from "../data/content";

export const PROGRESS_KEY = "jx-genesis-poc-progress-v1";

export type ProgressState = {
  version: 3;
  anonymousId: string;
  completedQuestIds: string[];
  coinAwardedQuestIds: string[];
  audioStarted: number[];
  gemAwarded: boolean;
  legacyGemAwarded: boolean;
  feedbackSubmitted: boolean;
  soundEnabled: boolean;
  lastUpdated: string;
};

const canonicalQuestIdSet = new Set(canonicalQuestIds);
export const REQUIRED_ACTIVITY_COUNT = canonicalQuestIds.length;

export function createInitialProgress(anonymousId = "guest-pending"): ProgressState {
  return {
    version: 3,
    anonymousId,
    completedQuestIds: [],
    coinAwardedQuestIds: [],
    audioStarted: [],
    gemAwarded: false,
    legacyGemAwarded: false,
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

function canonicalIds(value: unknown) {
  return uniqueStrings(value).filter((id) => canonicalQuestIdSet.has(id));
}

export function normalizeProgress(value: unknown, anonymousId: string): ProgressState {
  if (!value || typeof value !== "object") return createInitialProgress(anonymousId);
  const candidate = value as Record<string, unknown>;
  const legacyCompleted = [
    ...uniqueStrings(candidate.completedVerseIds),
    ...uniqueStrings(candidate.completedStoryIds),
  ];
  const completedQuestIds = canonicalIds(
    candidate.version === 3 ? candidate.completedQuestIds : legacyCompleted,
  );
  const coinAwardedQuestIds = canonicalIds(
    Array.isArray(candidate.coinAwardedQuestIds)
      ? candidate.coinAwardedQuestIds
      : completedQuestIds,
  );
  const gemAwarded = Boolean(candidate.gemAwarded);
  const legacyGemAwarded = Boolean(candidate.legacyGemAwarded) ||
    (candidate.version !== 3 && gemAwarded && completedQuestIds.length < REQUIRED_ACTIVITY_COUNT);

  return {
    version: 3,
    anonymousId: typeof candidate.anonymousId === "string" ? candidate.anonymousId : anonymousId,
    completedQuestIds,
    coinAwardedQuestIds,
    audioStarted: Array.isArray(candidate.audioStarted)
      ? [...new Set(candidate.audioStarted.filter((item): item is number => Number.isInteger(item)))]
      : [],
    gemAwarded,
    legacyGemAwarded,
    feedbackSubmitted: Boolean(candidate.feedbackSubmitted),
    soundEnabled: candidate.version === 1 ? true : candidate.soundEnabled !== false,
    lastUpdated: typeof candidate.lastUpdated === "string" ? candidate.lastUpdated : new Date(0).toISOString(),
  };
}

export function isQuestComplete(progress: ProgressState, id: string) {
  return progress.completedQuestIds.includes(id);
}

export function completedActivityCount(progress: ProgressState) {
  return new Set(progress.completedQuestIds.filter((id) => canonicalQuestIdSet.has(id))).size;
}

export function coinCount(progress: ProgressState) {
  return new Set(progress.coinAwardedQuestIds.filter((id) => canonicalQuestIdSet.has(id))).size;
}

export function isJourneyComplete(progress: ProgressState) {
  const completed = new Set(progress.completedQuestIds);
  return canonicalQuestIds.every((id) => completed.has(id));
}

export function progressPercent(progress: ProgressState) {
  return Math.min(100, Math.round((completedActivityCount(progress) / REQUIRED_ACTIVITY_COUNT) * 100));
}

export type CompletionResult = {
  progress: ProgressState;
  newlyCompleted: boolean;
  badgeAwardedNow: boolean;
};

export function awardQuestCompletion(progress: ProgressState, questId: string): CompletionResult {
  if (!canonicalQuestIdSet.has(questId) || progress.completedQuestIds.includes(questId)) {
    return { progress, newlyCompleted: false, badgeAwardedNow: false };
  }

  const completedQuestIds = [...progress.completedQuestIds, questId];
  const coinAwardedQuestIds = progress.coinAwardedQuestIds.includes(questId)
    ? progress.coinAwardedQuestIds
    : [...progress.coinAwardedQuestIds, questId];
  const journeyComplete = canonicalQuestIds.every((id) => completedQuestIds.includes(id));
  const badgeAwardedNow = !progress.gemAwarded && journeyComplete;

  return {
    newlyCompleted: true,
    badgeAwardedNow,
    progress: {
      ...progress,
      completedQuestIds,
      coinAwardedQuestIds,
      gemAwarded: progress.gemAwarded || badgeAwardedNow,
    },
  };
}
