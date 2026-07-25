# JX Bible Journey — Genesis proof of concept

A polished, installable proof of concept for one complete learning journey:

**English Bible → Genesis → Unit 1: Creation and the Fall (Genesis 1–3)**

## Included

- Three chapter-audio players for Genesis 1–3 with play/pause, seeking, and 1x/1.5x speed
- Six verse-order quests
- Two story-sequencing quests
- One multi-round Promise or Instruction classification quest
- One accessible three-pair Scripture Picture Match quest
- Device-local progress persistence
- One coin per completed quest, plus a Creation Badge after all ten quests
- Per-quest confetti/balloon celebrations, optional success sound, and a distinct unit celebration
- Direct next-quest navigation, contextual Genesis scene art, GSAP motion, and CanvasUI ripple interactions
- A private feedback form that is available only after completion
- Responsive desktop and mobile layouts, keyboard-operable quests, reduced-motion support, a web manifest, and an offline app shell

The Bible text is the public-domain World English Bible. Audio is the public-domain WEB recording read by Winfred W. Henson and hosted by eBible.org.

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Production check:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

## Proof-of-concept architecture

- **Next.js 16 App Router, React 19, TypeScript** for the application
- **Static typed content** in `data/content.ts` for the single curated unit
- **Browser localStorage** for anonymous progress, reward, and sound preferences, so the journey resumes after reload without an account
- **Node API route** for feedback; POSTs append to `data/private-feedback.jsonl`
- **No feedback read endpoint**; GET returns 405, and the local file is owner-readable only and excluded from Git
- **Remote public-domain MP3s** for audio, keeping the prototype repository small
- **Progress schema v3** with canonical quest IDs, idempotent coin awards, and lossless v1/v2 migration

## Follow-up implementation status

The implementable parts of the 18 July follow-up are present: ten canonical quests, registry-driven progress/rewards, legacy eight-quest badge retention, the two new game types, supplied galaxy/reward art, contextual scene illustrations, and responsive/reduced-motion styling. The new passages, explanations, and scene art are proof-of-concept editorial drafts and still require theological, rights, and content-owner approval.

The existing public-domain narration remains intentionally unchanged until an approved translation, voice workflow, final recordings, and distribution rights are supplied. Physical-device and mixed pilot-group testing also remain stakeholder-led release steps.

## Deliberate POC boundaries

This validates the learning loop and interaction design, not production operations. Before a public launch:

- Replace local progress with Supabase Auth/Postgres sync while retaining a local offline cache.
- Store feedback in a row-level-secured Supabase table available only to authorized product staff.
- Move audio behind managed object storage/CDN with offline-download controls and resilient retry states.
- Add a real CMS/content ingestion workflow, editorial review, analytics consent, automated browser tests, rate limiting, abuse protection, monitoring, and backups.
- Generate PNG maskable icons in addition to the SVG prototype icon and expand service-worker versioning/offline behavior.

## Content sources

- World English Bible text and public-domain notice: <https://ebible.org/engwebp/copyright.htm>
- World English Bible audio: <https://ebible.org/eng-web/audio/>
