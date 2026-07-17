# JX Project - MVP Implementation Plan

## 1. Executive summary

JX Project is a gamified, Bible-based learning web application. It uses short interactive games, chapter audio, progress tracking, and virtual rewards to help users learn Bible stories and memorize Scripture. The interaction model is inspired by Duolingo's structured learning path, while the visual direction is intended to be colorful, animated, nature-rich, and approachable.

The meeting proposed launching after completing both Genesis and Revelation. That is a useful pilot-release milestone, but it is too large for a first engineering MVP. The recommended MVP is one complete vertical slice: **English Bible -> Genesis -> Unit 1: Creation and the Fall (Genesis 1-3)**. This slice should prove the whole product loop before the team produces dozens of audio tracks, games, and illustrations.

The MVP should let a user:

1. Enter without a mandatory registration form.
2. Open the Genesis learning path.
3. Select Unit 1.
4. Listen to Genesis chapters 1-3.
5. Complete verse-order and story-sequencing quests.
6. Receive immediate feedback, one coin per quest, completion animation, and a virtual gem for the unit.
7. Resume progress later on the same device.
8. Submit private pilot feedback after completion.

## 2. Detailed project understanding

### Product vision

Create an engaging way to explore, remember, and understand Scripture through short games rather than passive reading alone. Audio supports recall and accessibility; games are the main experience.

### Intended product hierarchy

The meeting and whiteboard imply this content model:

```text
Bible game
  -> Language (English first)
    -> Bible version
      -> Section / Bible book (Genesis, Revelation, etc.)
        -> Themed unit
          -> Chapter audio
          -> Game quests
            -> Individual puzzles/questions
```

Future languages mentioned were Yoruba, Igbo, Hausa, and Nigerian Pidgin. They are expansion work, not MVP scope.

### Genesis structure confirmed by the whiteboard

| Unit | Theme | Chapters |
|---|---|---|
| 1 | Creation and the Fall | Genesis 1-3 |
| 2 | Cain, Abel and Noah | Genesis 4-9 |
| 3 | Nations and the Tower of Babel | Genesis 10-11 |
| 4 | Abraham's Journey | Genesis 12-25 |
| 5 | Isaac and Jacob | Genesis 26-36 |
| 6 | Joseph's Story | Genesis 37-50 |

### Game mechanics discussed

1. **Verse puzzle** - A verse is split into a small number of meaningful phrase tiles, shuffled, and reassembled in the correct order. A unit can contain several verse puzzles; the meeting suggested as many as nine.
2. **Story sequencing cards** - Illustrated story/event cards are shuffled and reordered chronologically using drag, swipe, or accessible move controls.
3. **Character/action matching** - Users match a person or character to something said, done, promised, or experienced.

The content lead also intends to define three more game types later. Those should not block the MVP.

### Audio behavior

- Audio is a supporting memory and reference feature, not the primary game.
- Audio should cover the full chapters assigned to a unit.
- Tracks should be separated chapter by chapter.
- Verse numbers should be spoken clearly.
- Audio files need lawful source rights, sufficient storage, and efficient delivery.

### Progression and rewards

- Users may open units in any order; progression is not strictly locked.
- Completion should be tracked per quest and per unit.
- Completing every required unit in a section/book earns a virtual precious stone or gem.
- Rewards are not real money and should not display monetary value.
- Completion may also show a rank, encouraging Scripture, confetti, or another celebratory animation.
- Pilot feedback is private to the team and should appear only after a meaningful completion milestone.

### Visual direction

- Genesis uses a green-led palette associated with creation.
- Use nature motifs such as trees, mountains, birds, flowers, and light.
- Use circular or rounded activity buttons along a learning path.
- Favor lively illustrations and restrained animation.
- The style may take inspiration from Duolingo's path structure and uLesson's visual warmth, but must become an original design system rather than a copy.

## 3. Recommended MVP boundary

### MVP goal

Validate the riskiest assumption: **Will users enjoy and complete a short Bible learning journey that combines Scripture audio with interactive ordering games?**

### In scope

- Responsive English web app installable as a PWA.
- Temporary working product name; branding can be replaced later.
- Genesis section screen showing all six planned units, with Unit 1 active and the others marked "Coming soon."
- Unit 1 content for Genesis 1-3.
- Three chapter audio tracks.
- Six to nine verse-puzzle quests selected across Genesis 1-3.
- One or two story-sequencing quests.
- Instructions and a short tutorial for each interaction.
- Correct/incorrect feedback and retry.
- Progress persistence for an anonymous user.
- Per-quest coins and celebration, plus unit completion, confetti, one prototype gem, and an encouraging message.
- Private feedback form after completion.
- Basic product analytics and error monitoring.
- A simple content import format; no full content-management system.

### Explicitly out of scope

- Revelation content.
- Genesis Units 2-6 as playable content.
- Additional languages.
- Native Android or iOS apps.
- Public ratings or reviews.
- Real-money rewards, purchases, subscriptions, leaderboards, or social profiles.
- Six distinct game engines.
- A sophisticated admin portal.
- AI-generated games at runtime.
- Offline audio downloads or push notifications.

### Why this is the right cut

It exercises every important layer - content, audio, interaction, scoring, progress, reward, feedback, analytics, mobile usability, and visual direction - while limiting content production to three chapters. If the loop does not engage users, the team can revise it before producing Genesis 4-50 and Revelation.

## 4. Primary user flow

```text
Landing page
  -> Start as guest
  -> English Bible
  -> Genesis path
  -> Unit 1: Creation and the Fall
  -> Choose audio or quest
  -> Complete quest
  -> See feedback and progress
  -> Finish required quests
  -> Earn gem and encouragement
  -> Submit private feedback
```

The app should remember the guest's progress. An account-upgrade option can be added later if cross-device progress becomes important.

## 5. Functional requirements and acceptance criteria

### A. Landing and onboarding

- The value proposition is understandable in one sentence.
- A user can start without email, phone number, or password.
- A short first-run guide explains audio, quests, and rewards.

### B. Genesis path

- The user sees six Genesis units and their chapter ranges.
- Unit 1 is playable; Units 2-6 are visibly marked as future content.
- Returning users see Unit 1 progress.

### C. Unit page

- Shows the unit title, Genesis 1-3 range, progress, audio controls, and quests.
- Audio can be played, paused, scrubbed, and switched by chapter.
- The page remains usable on a low-width mobile screen.

### D. Verse puzzle

- Phrase tiles are shuffled at the start.
- Users can reorder by touch/mouse and by keyboard or explicit move buttons.
- Submission detects exact sequence and provides understandable feedback.
- Incorrect attempts preserve the user's work and allow retry or reset.
- Completion is saved only after a correct result.

### E. Story sequencing

- Cards contain concise text and, where useful, one consistent illustration.
- Cards can be rearranged by touch/mouse and accessible controls.
- The app validates the complete order, explains mistakes without exposing the answer immediately, and allows retry.

### F. Progress and reward

- Progress is computed from required quests, not merely page visits.
- Refreshing or closing the browser does not erase completed work on the same device.
- Completing the configured MVP section triggers one gem, animation, and encouragement message only once.

### G. Feedback

- Feedback appears only after the configured completion milestone.
- It captures an optional 1-5 experience score, what the user liked, what was confusing, and suggestions.
- Responses are private to the project team.

## 6. Technical approach

### Suggested stack

- **Frontend:** TypeScript-based React web application using Next.js, delivered as a PWA.
- **UI:** Responsive component system, CSS design tokens, and an accessible drag-and-drop/reordering library.
- **Backend:** Managed PostgreSQL database with object storage for audio and illustrations.
- **Identity:** Anonymous user IDs for the MVP, with the option to link an account later.
- **Hosting:** Managed web hosting with preview deployments.
- **Monitoring:** Lightweight event analytics plus client/server error reporting.

Next.js documents a single-codebase PWA path with installable app manifests. Supabase is a reasonable managed-backend option because it supports anonymous identities, row-level database permissions, and object storage. If Supabase anonymous sign-in is used, use dynamic rendering where identity is involved, enable restrictive row-level policies, add abuse protection, and plan cleanup of abandoned anonymous users.

References:

- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Supabase anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase storage](https://supabase.com/docs/guides/storage)

### Recommended data model

| Entity | Purpose |
|---|---|
| languages | English now; future language expansion |
| bible_versions | Version, license, attribution, language |
| sections | Bible books such as Genesis |
| units | Theme, order, chapter range, completion rules |
| audio_tracks | Chapter, storage URL, duration, narrator/voice metadata |
| activities | Game type, title, instructions, required flag, order |
| activity_items | Ordered phrases, cards, matches, hints, answer key |
| assets | Illustration and animation metadata |
| user_progress | Started/completed state, attempts, timestamps |
| user_rewards | Gem awarded and award timestamp |
| feedback | Private score and comments |

### Content format

Store game content as versioned structured data, not hardcoded UI text. For the MVP, the content lead can work in a spreadsheet that is exported to validated JSON or CSV and imported by the developer. Each content record should include:

- Bible version and reference.
- Unit and activity ID.
- Game type.
- Prompt/instruction.
- Display pieces/cards.
- Correct sequence or matching key.
- Optional hint and explanation.
- Illustration/audio asset ID.
- Reviewer and approval status.

This makes Genesis and Revelation expansion primarily a content operation rather than new software development.

## 7. Content and rights workflow

Before production content is added, decide and document:

1. The exact Bible translation/version.
2. Permission to reproduce its text in an interactive public product.
3. Permission to create and distribute audio derived from that text.
4. Required copyright notices and attribution.
5. Whether AI voice-provider terms permit the intended public and commercial use.
6. Ownership and usage rights for generated illustrations, fonts, music, and sound effects.

Every Scripture puzzle and answer key should receive a content accuracy review. Every illustration should receive theological, cultural, age-appropriateness, and visual-consistency review before publication.

## 8. Delivery plan

Assumption: one primary developer and one primary content/instructional-design lead, working in parallel.

### Week 0 - Decisions and product brief

- Confirm target age group and pilot audience.
- Choose Bible version and clear rights.
- Confirm the MVP boundary and success criteria.
- Approve temporary name, voice, and Genesis visual direction.
- Write the Unit 1 activity inventory.

**Exit:** signed-off one-page brief, content rights decision, and activity list.

### Week 1 - UX prototype and technical foundation

- Create mobile-first wireframes for landing, Genesis path, unit, audio, puzzle, reward, and feedback screens.
- Test the reordering interaction on a phone and laptop.
- Set up application, database, object storage, deployment, and analytics foundations.
- Define content schema and validation rules.

**Exit:** clickable prototype and deployed empty application shell.

### Week 2 - Navigation, content import, and audio

- Implement guest identity and progress records.
- Build Genesis path and Unit 1 screens.
- Implement content importer.
- Produce, review, compress, upload, and play Genesis 1-3 audio.

**Exit:** a user can open Unit 1, play all three chapters, and resume progress.

### Week 3 - Core games

- Implement verse puzzle.
- Implement story sequencing.
- Add accessible non-drag controls, scoring, retry, hints, and completion states.
- Load a small set of reviewed test content.

**Exit:** both game types work on touch, mouse, and keyboard.

### Week 4 - Progress, reward, and feedback

- Complete progress calculation and persistence.
- Add confetti, gem award, and encouragement message.
- Add conditioned private feedback form.
- Add essential analytics and error tracking.

**Exit:** the complete start-to-reward loop works in the deployed environment.

### Week 5 - Content completion and QA

- Load six to nine reviewed verse puzzles and one or two sequencing quests.
- Add final green Genesis assets and illustrations.
- Test mobile layouts, slow connections, audio fallback, accessibility, scoring, persistence, and error states.
- Run internal content and theological review.

**Exit:** release candidate with no blocking defects.

### Week 6 - Small pilot

- Invite a small, representative test group.
- Observe first-use behavior and collect private feedback.
- Review completion funnel, errors, audio use, retries, and comments.
- Prioritize fixes before expanding content.

**Exit:** evidence-based go/revise/stop decision for Genesis expansion.

## 9. MVP success measures

Treat initial values as hypotheses, then set numerical targets once the pilot group size is known.

- Activation: percentage who start Unit 1 after landing.
- First-value: percentage who complete one quest.
- Unit completion: percentage who complete all required MVP quests.
- Return behavior: percentage who return within seven days.
- Audio utility: percentage who play audio before or after a failed quest.
- Puzzle usability: retries, resets, abandonment, and time to completion.
- Satisfaction: post-completion score and recurring qualitative themes.
- Reliability: page-error rate, failed audio loads, and lost-progress reports.

The primary MVP metric should be **Unit 1 completion among users who start the first quest**. It directly tests whether the learning loop is understandable and motivating.

## 10. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Bible text/audio rights are unclear | Launch may be legally blocked | Choose and document a permitted version before content production |
| Genesis + Revelation is treated as the MVP | Long delay before user feedback | Validate Unit 1 first, then expand |
| Too many game types are built at once | Higher complexity and QA burden | Build two mechanics, then add matching after validation |
| Content is embedded directly in code | Expansion becomes slow and error-prone | Use a versioned content schema and importer |
| Drag-and-drop is difficult on mobile or inaccessible | Users cannot complete games | Provide large targets, tap-to-move, keyboard controls, and real-device tests |
| AI-generated art is inconsistent | Product looks fragmented | Use a locked art direction, reusable prompt templates, and human review |
| Audio files are large | Slow loading and high storage/bandwidth | Split by chapter, compress, stream through a CDN, and lazy-load |
| Target audience is undefined | Tone, difficulty, privacy, and UI may be wrong | Decide age band before final copy and illustrations |
| Anonymous progress is device-bound | Users lose progress across devices | Clearly disclose this and offer account linking in a later phase |
| Feedback comes from unengaged visitors | Low-quality signal | Gate feedback behind meaningful completion |

## 11. Expansion after MVP validation

### Release 1.1 - Genesis foundation

- Add character/action matching.
- Add remaining Genesis units in small batches.
- Add section-level completion using all six units.
- Add two or three more reusable game mechanics only where content requires them.
- Improve content operations and add a small internal content editor if imports become a bottleneck.

### Pilot release - Genesis + Revelation

- Define the Revelation unit map.
- Produce and review all required text, quests, audio, and art.
- Test book-level navigation, two section themes, multiple gems, ranks, and encouragement messages.
- Run the three-month feedback pilot discussed in the meeting.

### Later releases

- Additional Bible books.
- Yoruba, Igbo, Hausa, and Nigerian Pidgin.
- Cross-device accounts and optional profiles.
- Native mobile apps only if PWA usage proves demand.

## 12. Ownership and working cadence

| Area | Suggested owner |
|---|---|
| Instructional design and game concepts | Comfort |
| Scripture selection, formatting, and review coordination | Comfort |
| Visual direction and illustration approval | Comfort, with Joshua for technical constraints |
| Product architecture and implementation | Joshua |
| Content schema, importer, media delivery, analytics | Joshua |
| Bible version, rights, audience, reward language, launch approval | Joint decision |
| Pilot recruitment and feedback synthesis | Joint decision |

Keep the agreed Tuesday/Thursday/Saturday cadence, but cap working meetings at 60-90 minutes. Each meeting should end with owners, due dates, and one demonstrated artifact or decision.

## 13. Decisions required before Week 1 ends

1. Who is the primary user: young children, teenagers, adults, families, or church groups?
2. Which Bible canon and translation are in scope? The transcript mentions "36 books," which should be clarified.
3. Is the product expected to remain free, become commercial, or accept donations later?
4. Which country or countries are in the first pilot?
5. Can pilot users be anonymous, or is cross-device progress mandatory?
6. Who gives final approval for Scripture accuracy and theological interpretation?
7. What temporary product name and visual identity should appear in the pilot?
8. Which voice and provider will be used for chapter audio, and are the usage rights confirmed?
9. What exactly counts as completing an activity, unit, and section?
10. What pilot size and decision threshold will justify expanding to all of Genesis?

## 14. Immediate next actions

1. Approve this MVP boundary.
2. Answer the ten decisions above.
3. Create the Unit 1 content spreadsheet.
4. Select six to nine verses and one or two event sequences from Genesis 1-3.
5. Confirm Bible text and audio rights.
6. Sketch the seven MVP screens.
7. Build one rough verse-puzzle interaction before producing final art.
8. Test that interaction with three to five representative users.

## Source basis

This plan was derived from the Zoom transcript dated 2026-07-15 and the accompanying one-page whiteboard PDF in this directory. Where the conversation was exploratory or contradictory, this document separates confirmed requirements from recommended MVP reductions and open decisions.
