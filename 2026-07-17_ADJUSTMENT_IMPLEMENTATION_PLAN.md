# JX Project - 17 July 2026 Adjustment Implementation Plan

## Implementation status

Implemented on 17 July 2026. The quest flow, rewards, audio controls, Creation-themed visuals, responsive behavior, persisted progress migration, and automated coverage described below are now in place. Type checking, linting, logic tests, production build, and desktop/mobile browser QA pass.

## 1. Purpose

This plan translates the decisions from the 17 July meeting transcript and whiteboard into an implementation sequence for the current Genesis 1-3 proof of concept.

The immediate pass is a focused UX/gameplay revision. It does **not** expand playable content beyond Unit 1 or replace the proof-of-concept's guest/local progress model. Production authentication and final custom audio are tracked separately because they need additional product, backend, rights, and content inputs.

## 2. Confirmed adjustments

### Immediate prototype work

1. Give each chapter recording full playback controls: play/pause, seek forward or backward, elapsed/duration display, and 1x or 1.5x speed.
2. Make game feedback and hints larger, bolder, and visually prominent.
3. Celebrate every successfully completed quest with confetti or balloons and a short happy voice/sound.
4. Award one gold coin for every quest completed; keep the Creation Gem as the reward for completing all eight quests in Unit 1.
5. Replace user-facing "activities" terminology with "quests," including progress text such as "1 of 8 quests."
6. After completing a quest, provide a primary "Continue your quest" action that opens the next configured game without forcing a return to the unit page.
7. Also provide a text "Back to unit" action at the bottom of every completed game. Keep the existing top action; do not add a home icon.
8. Add restrained Genesis creation imagery/animation to game backgrounds: trees, animals, oceans, sun/light, and celestial elements. The imagery should sit around the sides or read like a subtle watermark, not compete with game content.
9. Make the sequencing experience more colorful while keeping puzzle text tiles neutral once the illustrated background is present.

### Confirmed product direction, outside the immediate UI pass

- The public product should support account-based, cross-device progress. Use multiple accessible sign-in options rather than Facebook alone. Google/Facebook OAuth and email were discussed; WhatsApp-based verification may be evaluated. Direct phone/SMS OTP was deprioritized because of recurring verification cost.
- Social sign-in should be used for authentication, not assumed to produce automatic promotional reach. Reward sharing can be designed as a separate, explicit feature later.
- The preferred final Scripture/audio source discussed was NLT with a custom or project-owned narration. This cannot replace the current public-domain WEB text/audio until reproduction, narration, and distribution rights are confirmed and approved source files are delivered.

## 3. Current implementation gaps

| Area | Current behavior | Required change |
|---|---|---|
| Audio | A hidden audio element and one play button; the icon becomes a check after playback starts. | Expose an actual player state with pause, seek, time, and speed controls. |
| Quest completion | A small inline success message; only full-unit completion opens the gem celebration. | Add a reusable per-quest completion celebration and stronger feedback treatment. |
| Rewards | Progress stores completed IDs and one `gemAwarded` boolean. | Add idempotent per-quest coin awards and a visible coin total. |
| Terminology | The path and unit progress say "activities." | Change user-facing copy to "quests" while internal type names may remain unchanged. |
| Navigation | Both game types close back to the unit after success. | Introduce ordered next-quest navigation plus a bottom "Back to unit" action. |
| Visuals | Game screens use paper/gradient backgrounds and symbolic sequence cards. | Add a shared creation-themed backdrop and richer sequencing color. |
| Completion sound | No per-quest sound exists. | Add a short approved success sound/voice with a non-audio visual equivalent and mute control. |

## 4. Implementation approach

### Phase 0 - Lock inputs and interaction rules

Before implementation, confirm or supply:

- One approved short success sound or happy voice clip, including usage rights.
- The visual asset approach: original SVG/illustration set or approved generated assets.
- Whether the first visual pass may use lightweight SVG/CSS scenery while final art is being produced.
- The final ordered quest list. The current order is six verse quests followed by two sequencing quests.
- The expected last-quest action. Recommended: change the primary action to "View your unit reward" and return to the unit page with the Creation Gem celebration visible.

Exit criterion: assets and the eight-quest order are named and approved, or placeholders are explicitly authorized.

### Phase 1 - Create a shared ordered quest model and navigation contract

Files:

- `data/content.ts`
- `components/GenesisApp.tsx`
- `components/VersePuzzle.tsx`
- `components/StorySequence.tsx`

Work:

- Add a single ordered quest registry containing each quest ID, type, title/reference, and order.
- Make `GenesisApp` resolve the current quest and its next quest from this registry rather than duplicating sequencing logic in each game.
- Replace the game callback contract with explicit `onBackToUnit` and `onContinue` actions.
- On successful completion, show both actions at the bottom:
  - Secondary text action: "Back to unit."
  - Primary action: "Continue your quest," opening the next quest.
- Preserve free choice from the unit page; next-quest navigation is a convenience, not a progression lock.
- For the final quest, return to the unit/reward state instead of wrapping to the first quest.

Acceptance criteria:

- Every quest can still be opened directly in any order.
- Completing quests 1-7 and selecting "Continue your quest" opens the next configured quest.
- Both the top and bottom "Back to unit" actions return to Unit 1.
- The eighth quest has a clear terminal action and never dead-ends or loops unexpectedly.

### Phase 2 - Add coin rewards and migrate progress safely

Files:

- `lib/progress.ts`
- `components/useProgress.ts`
- `components/GenesisApp.tsx`
- `components/Icons.tsx`

Work:

- Bump the stored progress schema from version 1 to version 2.
- Add `coinAwardedQuestIds` (or an equivalent set-like field) so a quest can award only one coin even when replayed.
- Backfill existing completed quest IDs during migration so current users receive the coins their saved completions imply.
- Derive the displayed coin count from unique awarded quest IDs; do not persist an independently mutable total.
- Award the coin in the same atomic progress update that records first completion.
- Add a gold coin counter to the header alongside the existing gem counter.
- Keep the Creation Gem rule unchanged: one gem after all six verse quests and both sequencing quests are complete.

Acceptance criteria:

- First completion of a quest increases the coin total by exactly one.
- Replaying or refreshing a completed quest never creates another coin.
- Existing saved progress migrates without losing completion, feedback, audio-started, anonymous ID, or gem state.
- Completing all eight quests produces eight coins and one Creation Gem.

### Phase 3 - Build reusable quest feedback and celebration

Files:

- New `components/QuestCelebration.tsx`, or refactor `components/Celebration.tsx` into quest/unit variants.
- `components/VersePuzzle.tsx`
- `components/StorySequence.tsx`
- `app/globals.css`
- `public/` for an approved sound asset

Work:

- Strengthen success and retry/hint messages with a larger headline, bolder type, clearer spacing, and high-contrast state treatment.
- On first successful quest completion, show a short celebration containing:
  - Confetti and/or balloons.
  - A visible "+1 gold coin" result.
  - The completed reference/title.
  - The approved happy sound/voice.
- Keep the existing full-unit gem celebration visually distinct and more substantial.
- Do not reopen the coin celebration for a previously completed quest unless a deliberate replay celebration is approved; never re-award the coin.
- Add a sound toggle and persist the preference locally. The experience must remain understandable with sound muted.
- Respect `prefers-reduced-motion` by replacing falling/moving particles with a static celebratory treatment.
- Manage focus inside the celebration and return it to the appropriate completion action when closed.

Acceptance criteria:

- Success and retry feedback are immediately noticeable on desktop and mobile.
- Every first-time quest completion gives visible celebration feedback and one sound cue.
- Muting prevents future success sounds without hiding visual feedback.
- Reduced-motion mode has no continuous particle animation.
- Screen readers announce success and the coin award once.

### Phase 4 - Replace the audio cards with accessible playback controls

Files:

- `components/AudioLibrary.tsx`
- `components/Icons.tsx`
- `app/globals.css`

Work:

- Track the active chapter, playing state, current time, duration, seek position, and playback rate.
- Provide play/pause, a labeled seek slider, elapsed/duration text, and 1x/1.5x speed control for every chapter.
- Pause the previous chapter when another chapter starts.
- Do not use a completion checkmark as a replacement for the play/pause control; show listening history separately if retained.
- Handle metadata loading, playback rejection, unavailable duration, network error, and end-of-track states.
- Keep the chapter source and attribution visible.

Acceptance criteria:

- A user can play, pause, resume, seek forward/backward, and switch between 1x and 1.5x.
- Starting a new chapter pauses the old one.
- Controls are keyboard-operable, visibly focused, and have meaningful accessible labels.
- The layout works at narrow mobile widths and does not jump when metadata loads.
- A failed audio load shows a recoverable message instead of leaving a false playing state.

### Phase 5 - Add the creation-themed visual layer

Files:

- New `components/CreationBackdrop.tsx`
- `components/VersePuzzle.tsx`
- `components/StorySequence.tsx`
- `app/globals.css`
- `public/` for approved art assets

Work:

- Build one reusable, decorative backdrop with configurable motifs for light/cosmos, ocean/sky, land/plants, animals, and Eden.
- Render art outside the primary reading/interaction column, with low contrast behind any text-bearing region.
- Use restrained motion such as slow drifting light, leaves, or stars; disable it for reduced-motion users.
- Apply a green-led Genesis palette with accent colors that bring the sequencing page to life.
- Keep verse phrase chips neutral and highly readable.
- Enrich sequencing cards through accent bands, illustrations, and scene-specific color without relying on color alone to communicate order.
- Mark decorative assets as hidden from assistive technology and avoid expensive animations that degrade low-end mobile performance.

Acceptance criteria:

- Both game types visibly communicate creation/nature without obscuring instructions, pieces, controls, or feedback.
- Sequencing feels more colorful; verse tiles remain neutral and readable.
- The design holds at 320px width, standard desktop widths, and 200% zoom.
- Decorative motion stops under reduced-motion and does not cause horizontal overflow.

### Phase 6 - Terminology and content consistency pass

Files:

- `components/GenesisApp.tsx`
- `components/VersePuzzle.tsx`
- `components/StorySequence.tsx`
- `components/Celebration.tsx`
- `README.md`
- `MVP_IMPLEMENTATION_PLAN.md`

Work:

- Replace visible progress labels such as "activities" with "quests."
- Replace "Continue the journey" with "Continue your quest" on game completion.
- Retain "journey" where it describes the overall Genesis path rather than an individual game.
- Update product documentation to explain the coin-per-quest and gem-per-unit reward hierarchy.
- Check singular/plural forms at 0, 1, and multiple quests.

Acceptance criteria:

- No user-facing progress or completion UI calls a game an "activity."
- "Quest" consistently means one playable game; "Unit" means the Genesis 1-3 collection; "Journey" means the broader path.

### Phase 7 - Verification and release readiness

Automated checks:

- Add unit tests for progress version migration, coin idempotency, progress percentage, gem eligibility, and next-quest resolution.
- Add browser tests for the complete eight-quest flow, direct quest selection, both back actions, next navigation, audio controls, replay behavior, refresh persistence, and reduced-motion behavior.
- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

Manual QA matrix:

- Desktop and mobile viewport.
- Mouse, touch, and keyboard-only operation.
- Fresh progress, partially migrated version-1 progress, and completed progress.
- Sound on/off, reduced motion on/off, and audio load failure.
- Replaying a completed quest and refreshing at each completion boundary.
- Screen-reader announcements and focus return after dialogs.

Exit criterion: no loss or duplication of progress/rewards, no navigation dead ends, and no blocking accessibility or responsive-layout defects.

## 5. Recommended delivery order

1. Ordered quest registry and navigation.
2. Progress schema migration and coin model.
3. Shared quest celebration and stronger feedback.
4. Audio playback controls.
5. Creation backdrop and sequencing color pass.
6. Terminology/documentation cleanup.
7. Automated and manual regression testing.

This order stabilizes state and navigation before layering celebration and art on top, and it lets audio work proceed independently once the player interaction is specified.

## 6. Deferred production track

### Authentication and cross-device progress

Do not add production authentication as part of this prototype adjustment pass. Prepare a separate technical design covering:

- Managed authentication and database-backed progress.
- Google and Facebook OAuth as initial social options.
- Email fallback and a cost/coverage study for WhatsApp or phone verification.
- Account linking so local guest progress is not lost when a user signs in.
- Minimal profile storage, consent, privacy retention, and age-group collection rules.
- Recovery behavior when a social provider is unavailable.

### Custom NLT audio

Keep the current WEB audio until all gates below pass:

1. Confirm permission to reproduce NLT text and create/distribute narration.
2. Receive reviewed Genesis 1, 2, and 3 scripts with footnote markers and cross-reference artifacts removed.
3. Announce the chapter once, then speak verse numbers as numbers before each verse.
4. Record/generate full chapters at a normal storytelling pace with a project-approved, lawfully usable voice.
5. Review pronunciation, completeness, verse alignment, pauses, loudness, and file ownership.
6. Export one optimized file per chapter with duration and attribution metadata.
7. Replace the URLs in `data/content.ts` only after the three files pass content and rights review.

### Later reward sharing

Treat social sharing as a separate opt-in feature after authentication and reward visuals are stable. It should generate a deliberate share card/action; logging in through a social provider must not be represented as automatic marketing or posting permission.

## 7. Definition of done for the adjustment release

The adjustment release is complete when a returning or new guest can:

1. Control Genesis audio with play/pause, seeking, and 1x/1.5x speed.
2. Complete any quest and receive prominent feedback, one coin, and a short accessible celebration.
3. Continue directly to the next quest or return to the unit from the bottom of the completion state.
4. See progress described as quests and see separate coin and gem totals.
5. Complete all eight quests, hold exactly eight coins, and receive the Creation Gem once.
6. Use creation-themed game screens without loss of readability, responsiveness, keyboard access, reduced-motion support, or saved progress.
