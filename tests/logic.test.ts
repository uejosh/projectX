import test from "node:test";
import assert from "node:assert/strict";
import { nextQuest, quests } from "../data/content";
import {
  coinCount,
  completedActivityCount,
  createInitialProgress,
  isJourneyComplete,
  normalizeProgress,
  progressPercent,
} from "../lib/progress";

test("new progress starts on schema version 2 with no rewards", () => {
  const progress = createInitialProgress("guest-test");
  assert.equal(progress.version, 2);
  assert.deepEqual(progress.coinAwardedQuestIds, []);
  assert.equal(progress.soundEnabled, true);
  assert.equal(coinCount(progress), 0);
});

test("version 1 progress migrates completions into idempotent coin awards", () => {
  const migrated = normalizeProgress({
    version: 1,
    anonymousId: "legacy-guest",
    completedVerseIds: ["gen-1-1", "gen-1-1", "gen-1-3"],
    completedStoryIds: ["creation-days"],
    audioStarted: [1, 1, 2],
    gemAwarded: false,
    feedbackSubmitted: true,
    lastUpdated: "2026-07-17T00:00:00.000Z",
  }, "fallback");

  assert.equal(migrated.version, 2);
  assert.equal(migrated.anonymousId, "legacy-guest");
  assert.deepEqual(migrated.completedVerseIds, ["gen-1-1", "gen-1-3"]);
  assert.deepEqual(migrated.coinAwardedQuestIds, ["gen-1-1", "gen-1-3", "creation-days"]);
  assert.deepEqual(migrated.audioStarted, [1, 2]);
  assert.equal(migrated.feedbackSubmitted, true);
  assert.equal(coinCount(migrated), 3);
});

test("version 2 coin awards remain unique and preserve a muted preference", () => {
  const normalized = normalizeProgress({
    ...createInitialProgress("guest-v2"),
    coinAwardedQuestIds: ["gen-1-1", "gen-1-1"],
    soundEnabled: false,
  }, "fallback");

  assert.deepEqual(normalized.coinAwardedQuestIds, ["gen-1-1"]);
  assert.equal(normalized.soundEnabled, false);
});

test("progress reaches eight quests, eight coins, and completion", () => {
  const complete = {
    ...createInitialProgress("complete-guest"),
    completedVerseIds: quests.filter((quest) => quest.type === "verse").map((quest) => quest.id),
    completedStoryIds: quests.filter((quest) => quest.type === "story").map((quest) => quest.id),
    coinAwardedQuestIds: quests.map((quest) => quest.id),
    gemAwarded: true,
  };

  assert.equal(completedActivityCount(complete), 8);
  assert.equal(progressPercent(complete), 100);
  assert.equal(coinCount(complete), 8);
  assert.equal(isJourneyComplete(complete), true);
});

test("quest navigation follows the configured order and terminates", () => {
  for (let index = 0; index < quests.length - 1; index += 1) {
    assert.deepEqual(nextQuest(quests[index]), quests[index + 1]);
  }
  assert.equal(nextQuest(quests.at(-1)!), null);
  assert.equal(nextQuest({ type: "verse", id: "missing" }), null);
});
