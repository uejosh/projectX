# JX Project — 18 July 2026 Follow-up Implementation Plan

## 1. Status and purpose

**Status:** Partially implemented on 25 July 2026.

Implemented in the proof of concept: Phases 1–6 (using provisional editorial content/art for the two new quests), progress schema v3 and legacy reward migration, ten-quest automated logic coverage, responsive/reduced-motion styling, supplied galaxy/reward assets, GSAP motion, and CanvasUI ripple interactions.

Still pending external/stakeholder input: final theological/editorial and rights approval, approved replacement narration and attribution, physical-device/accessibility review, and pilot-group selection/execution.

This plan translates the decisions in `Transcript Sat 18` into an implementation sequence for the Genesis 1–3 proof of concept. It builds on `2026-07-17_ADJUSTMENT_IMPLEMENTATION_PLAN.md`, whose eight-quest flow, coin rewards, Creation Gem, audio controls, celebrations, and Creation-themed backdrop are already present.

The follow-up has four immediate outcomes:

1. Make the journey and quest screens more visually captivating and context-specific.
2. Replace the current narration with an approved, better-quality recording.
3. Upgrade the coin and gem presentation so rewards feel vivid and valuable.
4. Expand Unit 1 from eight to ten quests by adding:
   - **Promise or Instruction**, a passage-classification quest.
   - **Scripture Picture Match**, a three-picture/three-reference matching quest.

## 2. Confirmed product decisions

### 2.1 Visual direction

- Keep the green-led palette and the existing trees.
- Review the palette on a real phone because the current experience may read too dark on some displays.
- Replace the restrained Genesis hero graphic with a more recognizable solar-system/cosmos composition that clearly identifies Genesis 1.
- Add larger clouds and more visible stars.
- Add more trees, water, sea life, and relevant illustrated characters or scenes.
- Use contextual artwork in the applicable quest or story rather than one generic background everywhere.
- Treat supplied/reference images as art direction. Produce a cohesive original illustration set rather than mixing unrelated web images.
- Keep the artwork lively but leave enough quiet space for instructions and interactions.

### 2.2 Biblical and editorial art guardrails

- Use illustrations or stylized sketches rather than photographs of people.
- Avoid explicit nudity. Human figures must be modestly framed, cropped, silhouetted, or otherwise safely illustrated.
- Do not imply that the forbidden fruit was definitively an apple; use a generic fruit or avoid making the fruit species identifiable.
- Where Genesis 2:7 is illustrated, show Adam being formed from dust and receiving the breath of life. Avoid imagery in which a pointing finger creates him.
- Avoid science-fiction styling and compositions with excessive visual detail.
- Every human, event, location, and sequence illustration must receive content/editorial approval before release.

### 2.3 Reward direction

- The quest reward remains a **gold coin**, without a dollar or other currency symbol.
- The unit reward remains a **diamond/precious stone**.
- Both counters and celebrations should use polished, dimensional artwork rather than flat symbolic line icons.
- The treatment may take inspiration from the energy and clarity of learning-game reward systems, but must remain an original JX visual design.

### 2.4 New Unit 1 quests

- Add exactly two quest entries to the current Genesis 1–3 demo.
- The first is **Promise or Instruction**:
  - Show a verse or passage.
  - Ask the player to classify it as **Promise**, **Instruction**, **Warning**, **Prayer**, or **Description**.
  - The learning objective is passage understanding, not only recall.
- The second is **Scripture Picture Match**:
  - Show three clearly visible picture cards and three Genesis references/passages.
  - Ask the player to match each picture to its corresponding reference/passage.
  - Keep the activity to three pairs so the cards remain legible on mobile and for older users.
- Completing either new quest awards one coin, as with every existing quest.
- The Creation Gem moves from an eight-quest requirement to a ten-quest requirement.

### 2.5 Audio direction

- The existing player design and playback controls may remain.
- The current externally hosted narration is not acceptable as final product audio and must be replaced.
- First test and document the current voice-generation workflow because the previously discussed Google process may have changed.
- Once the workflow is verified, provide reproducible instructions to the content owner so the approved chapter recordings can be generated.
- Do not publish generated or third-party audio until the translation, voice, generation, reproduction, and distribution rights are confirmed.

### 2.6 Pilot direction

- After the revised demo is stable, share it with a deliberately selected mixed pilot group of approximately six or seven people.
- The pilot group and outreach list are product decisions to be agreed jointly; implementation should only prepare the build and feedback path.

## 3. Explicitly deferred items

The following ideas were discussed but are not part of this implementation pass:

- Bible Story Detective.
- Two Truths and One Lie.
- Memory Tiles.
- Paid group mode, invitations, shared sessions, casting, or multiplayer.
- Expansion beyond Genesis 1–3.
- Production authentication, cross-device progress, subscriptions, or payment enforcement.

These should remain in the product backlog until the ten-quest demo has been tested.

## 4. Current-state gaps

| Area | Current implementation | Required follow-up |
|---|---|---|
| Unit size | Six verse-order quests and two story-sequencing quests; progress and reward copy are based on eight total quests. | Add two new quest types and make ten the canonical completion total. |
| Quest model | `QuestRef` supports only `verse` and `story`. | Add typed references and content models for classification and picture matching. |
| Completion state | Progress stores completed verse and story IDs. | Store completion for both new quest types and migrate existing local progress without loss. |
| Gem rule | The gem is awarded after six verse and two story completions. | Require all ten canonical quest IDs, avoiding category-specific hard-coded checks. |
| Unit screen | The UI renders separate verse and story sections with fixed `/6`, `/2`, and `of 8` copy. | Add discoverable cards/sections for the new quests and derive all totals from content. |
| Artwork | `CreationBackdrop` supplies decorative scenery, while several cards still use symbolic art. | Introduce approved contextual scene art and a more prominent cosmic hero. |
| Rewards | `CoinIcon` and `GemIcon` are flat vector symbols. | Replace or enhance them with dimensional, currency-neutral reward assets. |
| Audio source | The player streams public-domain WEB recordings from eBible.org. | Validate the replacement workflow, ingest approved chapter files, and update attribution. |
| QA audience | Responsive behavior exists, but the new picture game has not been tested for older users. | Validate card legibility, touch targets, instructions, and contrast with representative testers. |

## 5. Implementation approach

### Phase 0 — Lock content, artwork, and rights

Before changing completion logic, prepare a small content/asset approval pack containing:

- The exact verses/passages and correct category for each round of Promise or Instruction.
- The three Genesis passages/references for Scripture Picture Match.
- Three approved illustrations and descriptive alt text for the picture pairs.
- The approved visual treatment for the hero, contextual backgrounds, coin, and gem.
- The Bible translation to be used in the new content and replacement narration.
- Written confirmation of the applicable text, image, voice, audio-generation, hosting, and distribution rights.
- A decision on whether generated narration is final audio or a temporary demo asset.

Content recommendations:

- Use at least one unambiguous example from each represented classification.
- Avoid passages that can reasonably belong to multiple categories unless the explanation acknowledges that nuance.
- For the picture match, choose visually distinct scenes across Genesis 1, 2, and 3.
- Review all wording and art for theological accuracy before it enters `data/content.ts`.

Exit criterion: approved content and assets have stable IDs, source/rights notes, and final answer keys.

### Phase 1 — Generalize the quest and content model

Files:

- `data/content.ts`
- `components/GenesisApp.tsx`
- `lib/progress.ts`

Work:

- Extend `QuestRef` with:
  - `{ type: "classification"; id: string }`
  - `{ type: "picture-match"; id: string }`
- Add typed content structures for both new quest types.
- Model Promise or Instruction as one quest containing multiple rounds. Each round should include an ID, reference, displayed passage, answer, explanation, and allowed category labels.
- Model Scripture Picture Match as one quest containing exactly three pairs. Each pair should include an ID, reference, optional passage excerpt, image source, concise scene label, alt text, and answer key.
- Append the two entries to the canonical `quests` array in the approved play order.
- Add reusable helpers that resolve a quest, its display metadata, its completion state, and the next quest.
- Derive unit totals and per-section counts from the content arrays. Remove user-facing hard-coded values such as `8`, `/6`, and `/2` wherever the canonical model can supply them.

Recommended canonical order:

1. Six verse-order quests.
2. Two story-sequencing quests.
3. Promise or Instruction.
4. Scripture Picture Match.

This retains the existing sequence for saved users and places the two understanding-oriented activities before the Creation Gem.

Acceptance criteria:

- The canonical quest registry contains ten unique IDs.
- `nextQuest` traverses all ten quests and terminates after Scripture Picture Match.
- Existing quests still open directly and retain their saved completion state.
- Counts and progress percentages are calculated from content, not duplicated literals.

### Phase 2 — Migrate progress and make rewards registry-driven

Files:

- `lib/progress.ts`
- `components/useProgress.ts`
- `components/GenesisApp.tsx`
- `tests/logic.test.ts`

Work:

- Bump the progress schema to version 3.
- Add completion storage for the new quest types, preferably as one `completedQuestIds` set-like array.
- During migration:
  - Preserve anonymous ID, audio history, feedback state, sound preference, existing verse/story completions, coins, and gem history.
  - Convert existing category-specific completion arrays into canonical quest IDs.
  - Preserve one coin for every previously completed quest.
- Centralize completion in one idempotent function that records completion and awards at most one coin per canonical quest ID.
- Determine unit completion by checking that every canonical quest ID is complete.
- Revoke neither an already collected gem nor existing coins during migration. If a returning version-2 user already earned the eight-quest gem, mark it as a legacy award and allow the two new quests to award their coins without duplicating the gem.
- For users who have not earned the gem, require all ten quests.
- Decide how the UI explains a legacy eight-quest gem holder's new `8 of 10` state. Recommended copy: “Creation Gem collected · 2 new quests available.”

Acceptance criteria:

- A new user earns ten coins and one Creation Gem after completing all ten quests.
- Replaying any quest never awards another coin.
- Version-2 users lose no progress or rewards.
- An existing eight-quest gem is never silently removed.
- Corrupt or duplicate stored IDs cannot inflate progress or coin totals.

### Phase 3 — Implement Promise or Instruction

Files:

- New `components/PassageClassification.tsx`
- `data/content.ts`
- `components/GenesisApp.tsx`
- `app/globals.css`

Interaction:

1. Show one passage and its reference at a time.
2. Present large buttons for Promise, Instruction, Warning, Prayer, and Description.
3. On selection, give immediate correct/try-again feedback.
4. After a correct response, show a short explanation of why the category applies.
5. Advance through the configured rounds.
6. Mark the quest complete only after every round is answered correctly.

Implementation notes:

- Randomize option order only if it does not make the interface harder to learn; keep the answer itself data-driven.
- Avoid a punitive lives system in the proof of concept.
- Announce feedback through an `aria-live` region and move focus predictably when the round changes.
- Use the existing quest celebration, coin award, Back to unit, and Continue your quest behavior.
- Keep passage text large enough for older readers and allow 200% zoom without clipping.

Acceptance criteria:

- Mouse, touch, and keyboard users can complete every round.
- A wrong answer does not complete the quest or award a coin.
- Completion awards exactly one coin and advances to Scripture Picture Match.
- Each correct answer has an approved explanation.

### Phase 4 — Implement Scripture Picture Match

Files:

- New `components/ScripturePictureMatch.tsx`
- `data/content.ts`
- `components/GenesisApp.tsx`
- `app/globals.css`
- `public/images/genesis/` for approved optimized assets

Interaction:

- Display three picture cards and three reference/passage cards.
- Use an accessible select-and-pair interaction as the primary mechanic:
  1. Select a picture.
  2. Select the matching reference/passage.
  3. Show a visible proposed pair.
- A drag-and-drop enhancement may be added for pointer users, but it must not be the only input method.
- Allow a player to change a proposed pair before checking.
- Provide one explicit **Check matches** action.
- On submission, identify correct pairs and clearly flag pairs that need another attempt without revealing unrelated hidden state.

Responsive behavior:

- Use one large picture per row or a horizontal snap carousel on narrow screens; do not shrink all three into unreadable thumbnails.
- Use a compact three-column layout only where each illustration remains comfortably legible.
- Ensure all controls meet at least a 44-by-44-pixel touch target.

Asset requirements:

- Use optimized AVIF/WebP with width/height metadata to avoid layout shift.
- Provide useful alt text when the scene is part of the task. Do not put the answer/reference directly into alt text.
- Supply a separate scene label or post-answer explanation so the task does not depend on color or vision alone.
- Avoid generic web-image hotlinks and unverified copyrighted material.

Acceptance criteria:

- The quest contains exactly three approved pairs.
- It is usable at 320-pixel viewport width, 200% zoom, and with keyboard only.
- Images remain large and recognizable on a representative phone.
- All three correct matches complete the quest, award the tenth coin, and unlock the Creation Gem for an eligible user.

### Phase 5 — Upgrade hero, contextual artwork, and mobile brightness

Files:

- `components/GenesisApp.tsx`
- `components/CreationBackdrop.tsx`
- `components/VersePuzzle.tsx`
- `components/StorySequence.tsx`
- New shared image/scene component if needed
- `app/globals.css`
- `public/images/genesis/`

Work:

- Redesign the path hero as a solar-system/cosmic scene with a clear Genesis 1 identity.
- Increase the scale and visibility of clouds and stars while retaining the approved tree treatment.
- Add contextual side/background illustrations to relevant quests:
  - Creation/cosmos.
  - Land, trees, and vegetation.
  - Sea and sea life.
  - Adam formed from dust.
  - Eden and companionship.
  - The choice and exile, handled modestly and without presenting the fruit as definitively an apple.
- Keep interaction surfaces on a stable high-contrast layer above the art.
- Audit the green palette on physical mobile devices and adjust luminance/overlays where it appears muddy or too dark.
- Use slow, optional motion only where it adds life; honor `prefers-reduced-motion`.
- Keep decorative art hidden from assistive technology, while task-relevant picture-match art remains perceivable.

Acceptance criteria:

- The path hero immediately reads as Genesis/cosmos.
- Game screens feel more colorful and visually populated without reducing text contrast.
- No artwork obscures controls, feedback, passages, or puzzle pieces.
- There is no horizontal overflow at 320 pixels or at 200% zoom.
- Reduced-motion mode remains calm and fully functional.

### Phase 6 — Upgrade coin and gem visuals

Files:

- `components/Icons.tsx`
- `components/QuestCelebration.tsx`
- `components/Celebration.tsx`
- `components/GenesisApp.tsx`
- `app/globals.css`
- Optional `public/images/rewards/`

Work:

- Create an original dimensional gold coin with no currency mark. A JX monogram, star, or neutral embossed motif may be used after approval.
- Create a faceted precious-stone/diamond asset with highlights, depth, and a strong silhouette.
- Use the same reward assets consistently in the header, quest celebration, unit card, and final celebration.
- Add restrained shimmer, scale, or light-sweep animation for enabled-motion users.
- Preserve readable numeric counters and accessible names; never rely on the artwork alone.
- Optimize the assets so reward animation does not cause page jank on low-end phones.

Acceptance criteria:

- No dollar sign or national currency symbol appears.
- Coin and gem are visually distinct at header size and celebration size.
- Counters remain understandable to screen-reader and muted/reduced-motion users.
- The final gem celebration feels more valuable than an individual coin celebration.

### Phase 7 — Validate and replace narration

Files:

- `data/content.ts`
- `components/AudioLibrary.tsx` only if the source/storage contract changes
- `public/audio/genesis/` or approved managed storage
- `README.md`

Work:

1. Re-test the proposed voice-generation workflow with a short, rights-cleared sample.
2. Record the current steps, supported export format, voice settings, known limits, cost, and quality findings.
3. Send the verified workflow to the content owner for chapter generation.
4. Review the three delivered chapters for:
   - Exact agreement with the approved translation.
   - Pronunciation and pacing.
   - Missing, duplicated, or reordered text.
   - Clipping, noise, long silences, and inconsistent volume.
5. Normalize and encode final files consistently.
6. Host them from a stable approved source and update `audioChapters`.
7. Replace WEB attribution only when the source actually changes; document the new translation, narrator/voice, rights holder, and license.
8. Retain the existing public-domain audio until approved replacement files pass review.

Acceptance criteria:

- Every displayed passage and recording uses the same approved translation.
- Each player loads, seeks, changes speed, ends cleanly, and reports failure accessibly.
- Audio files have documented provenance and release permission.
- The README and on-screen attribution match the files being served.

### Phase 8 — Documentation, regression testing, and pilot

Files:

- `README.md`
- `MVP_IMPLEMENTATION_PLAN.md`
- `2026-07-17_ADJUSTMENT_IMPLEMENTATION_PLAN.md` only for a cross-reference/status note
- `tests/logic.test.ts`
- New component/browser tests as appropriate

Automated checks:

- Progress v2-to-v3 migration.
- Ten-quest count and percentage calculations.
- Idempotent completion and coin awards for all four quest types.
- Legacy gem retention.
- New-user ten-quest gem requirement.
- Classification scoring and round completion.
- Picture-pair scoring independent of selection order.
- Next-quest navigation through the new final quest.
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

Manual/browser checks:

- Desktop and mobile layouts, including a 320-pixel viewport.
- Physical-phone review for brightness, image size, and touch behavior.
- Keyboard-only navigation and visible focus.
- Screen-reader announcements for matching, classification, coin, and gem outcomes.
- 200% zoom, reduced motion, sound muted, and high-contrast checks.
- Slow-network and failed-image/audio states.
- Refresh/resume before and after each new quest.
- Migration using representative version-2 local-storage fixtures.

Pilot preparation:

- Create a release candidate with all ten quests and the private feedback path working.
- Agree on a mixed group of approximately six or seven testers.
- Give testers a short scenario covering onboarding, listening, all four quest mechanics, rewards, and feedback.
- Record issues by severity and theme: comprehension, theological/content accuracy, accessibility, artwork, audio, motivation, and technical defects.
- Do not expand to additional Genesis units until blocking pilot findings are resolved.

## 6. Suggested delivery order

| Milestone | Deliverable | Dependency |
|---|---|---|
| M1 | Approved content, image list, audio/rights decision, and interaction wireframes | Stakeholder/editorial input |
| M2 | Generalized ten-quest registry and safe progress migration | M1 content IDs |
| M3 | Promise or Instruction playable end to end | M2 |
| M4 | Scripture Picture Match playable and responsive | M1 approved images, M2 |
| M5 | Hero, contextual art, and dimensional rewards | Approved art direction |
| M6 | Replacement narration integrated | Verified workflow and approved audio |
| M7 | Full regression pass and pilot release candidate | M3–M6 |

M3 and the non-overlapping artwork work in M5 may proceed in parallel after M1. M6 must not block logic development, but unapproved narration must not ship as final audio.

## 7. Definition of done

This follow-up is complete when:

- Unit 1 visibly contains ten playable quests.
- Promise or Instruction and Scripture Picture Match work with touch, mouse, and keyboard.
- A new user can earn exactly ten coins and one Creation Gem.
- Existing local users retain all previously earned progress and rewards.
- The hero, quest backgrounds, coin, and gem reflect the approved richer visual direction.
- Artwork follows the biblical/editorial guardrails and has documented usage rights.
- Approved narration replaces the current source, or the release is explicitly labeled as retaining temporary public-domain audio.
- Type checking, linting, automated tests, production build, and desktop/mobile accessibility QA pass.
- The ten-quest release candidate is ready for the agreed six-to-seven-person mixed pilot group.

## 8. Open decisions requiring stakeholder input

1. Which exact passages and categories will make up Promise or Instruction?
2. Which three scenes and passages will be used for Scripture Picture Match?
3. Who gives final theological/editorial approval for text, explanations, and imagery?
4. Where are the referenced/supplied images stored, and which are licensed for reuse versus inspiration only?
5. What Bible translation and narration rights are approved for the replacement audio?
6. Which voice-generation service and voice may be used commercially?
7. Should the two new quests appear as a new “Understand the passage” section or as two separate sections on the unit page?
8. What approved motif should appear on the currency-neutral gold coin?
9. Which six or seven people form the first mixed pilot group?
