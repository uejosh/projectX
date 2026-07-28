import test from "node:test";
import assert from "node:assert/strict";
import {
  classificationOptions,
  isClassificationAnswer,
  nextQuest,
  passageClassifications,
  pictureMatches,
  quests,
  resolveQuest,
  scorePictureMatches,
  storySequences,
  versePuzzles,
} from "../data/content";
import {
  awardQuestCompletion,
  coinCount,
  completedActivityCount,
  createInitialProgress,
  isJourneyComplete,
  normalizeProgress,
  progressPercent,
} from "../lib/progress";

test("new progress starts on schema version 3 with no rewards", () => {
  const progress = createInitialProgress("guest-test");
  assert.equal(progress.version, 3);
  assert.deepEqual(progress.completedQuestIds, []);
  assert.deepEqual(progress.coinAwardedQuestIds, []);
  assert.equal(progress.soundEnabled, true);
  assert.equal(coinCount(progress), 0);
});

test("version 1 progress migrates category completions into canonical quest IDs", () => {
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

  assert.equal(migrated.version, 3);
  assert.equal(migrated.anonymousId, "legacy-guest");
  assert.deepEqual(migrated.completedQuestIds, ["gen-1-1", "gen-1-3", "creation-days"]);
  assert.deepEqual(migrated.coinAwardedQuestIds, ["gen-1-1", "gen-1-3", "creation-days"]);
  assert.deepEqual(migrated.audioStarted, [1, 2]);
  assert.equal(migrated.feedbackSubmitted, true);
  assert.equal(coinCount(migrated), 3);
});

test("version 2 users retain an earned eight-quest legacy badge and mute preference", () => {
  const legacyIds = quests.slice(0, 8).map((quest) => quest.id);
  const migrated = normalizeProgress({
    version: 2,
    anonymousId: "guest-v2",
    completedVerseIds: legacyIds.slice(0, 6),
    completedStoryIds: legacyIds.slice(6),
    coinAwardedQuestIds: [...legacyIds, legacyIds[0]],
    gemAwarded: true,
    soundEnabled: false,
  }, "fallback");

  assert.equal(migrated.gemAwarded, true);
  assert.equal(migrated.legacyGemAwarded, true);
  assert.equal(migrated.soundEnabled, false);
  assert.equal(completedActivityCount(migrated), 8);
  assert.equal(coinCount(migrated), 8);
  assert.equal(isJourneyComplete(migrated), false);
});

test("corrupt and duplicate IDs cannot inflate progress or coins", () => {
  const normalized = normalizeProgress({
    version: 3,
    completedQuestIds: [quests[0].id, quests[0].id, "invented-quest"],
    coinAwardedQuestIds: [quests[0].id, "free-coin", "free-coin"],
  }, "fallback");

  assert.deepEqual(normalized.completedQuestIds, [quests[0].id]);
  assert.equal(completedActivityCount(normalized), 1);
  assert.equal(coinCount(normalized), 1);
});

test("all ten quests award exactly ten coins and one badge", () => {
  let progress = createInitialProgress("complete-guest");
  let badgeAwards = 0;

  for (const quest of quests) {
    const first = awardQuestCompletion(progress, quest.id);
    assert.equal(first.newlyCompleted, true);
    if (first.badgeAwardedNow) badgeAwards += 1;
    progress = first.progress;

    const replay = awardQuestCompletion(progress, quest.id);
    assert.equal(replay.newlyCompleted, false);
    assert.equal(replay.badgeAwardedNow, false);
  }

  assert.equal(completedActivityCount(progress), 10);
  assert.equal(progressPercent(progress), 100);
  assert.equal(coinCount(progress), 10);
  assert.equal(isJourneyComplete(progress), true);
  assert.equal(progress.gemAwarded, true);
  assert.equal(badgeAwards, 1);
});

test("every classification round exposes its data-driven answer exactly once", () => {
  for (const quest of passageClassifications) {
    for (const round of quest.rounds) {
      const options = classificationOptions(round);
      assert.equal(isClassificationAnswer(round, round.answer), true);
      assert.equal(options.includes(round.answer), true);
      assert.equal(options.filter((option) => option === round.answer).length, 1);
      assert.equal(new Set(options).size, options.length);
    }
  }
});

test("picture-pair scoring is independent of selection order", () => {
  const quest = pictureMatches[0];
  const reverseSelectionOrder = Object.fromEntries([...quest.pairs].reverse().map((pair) => [pair.id, pair.id]));
  assert.equal(scorePictureMatches(quest, reverseSelectionOrder).every((pair) => pair.correct), true);
  const wrong = { ...reverseSelectionOrder, [quest.pairs[0].id]: quest.pairs[1].id };
  assert.equal(scorePictureMatches(quest, wrong).filter((pair) => pair.correct).length, 2);
});

test("quest navigation follows all ten configured quests and terminates", () => {
  assert.equal(quests.length, 10);
  assert.equal(new Set(quests.map((quest) => quest.id)).size, 10);
  for (let index = 0; index < quests.length - 1; index += 1) {
    assert.deepEqual(nextQuest(quests[index]), quests[index + 1]);
  }
  assert.equal(nextQuest(quests.at(-1)!), null);
  assert.equal(nextQuest({ type: "verse", id: "missing" }), null);
});

test("all configured quests resolve to playable content with complete option sets", () => {
  assert.equal(versePuzzles.every((puzzle) => puzzle.pieces.length >= 3 && new Set(puzzle.pieces).size === puzzle.pieces.length), true);
  assert.equal(storySequences.every((story) => story.cards.length >= 3 && new Set(story.cards.map((card) => card.id)).size === story.cards.length), true);
  assert.equal(quests.every((quest) => Boolean(resolveQuest(quest))), true);

  for (const quest of pictureMatches) {
    assert.equal(quest.pairs.length, 3);
    assert.equal(new Set(quest.pairs.map((pair) => pair.reference)).size, quest.pairs.length);
    assert.equal(new Set(quest.pairs.map((pair) => pair.imageSource)).size, quest.pairs.length);
  }
});
