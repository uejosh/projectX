export type AudioChapter = {
  chapter: 1 | 2 | 3;
  title: string;
  subtitle: string;
  duration: string;
  source: string;
};

export type VersePuzzleData = {
  id: string;
  reference: string;
  prompt: string;
  pieces: string[];
};

export type StoryCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  symbol: string;
  tone: "light" | "sky" | "earth" | "stars" | "life" | "people" | "rest" | "garden" | "warning" | "choice" | "mercy";
};

export type StorySequenceData = {
  id: string;
  title: string;
  reference: string;
  prompt: string;
  cards: StoryCard[];
};

export const classificationCategories = [
  "Promise",
  "Instruction",
  "Warning",
  "Prayer",
  "Description",
] as const;

export type ClassificationCategory = (typeof classificationCategories)[number];

export type ClassificationRound = {
  id: string;
  reference: string;
  passage: string;
  answer: ClassificationCategory;
  explanation: string;
  allowedCategories: ClassificationCategory[];
};

export type PassageClassificationData = {
  id: string;
  title: string;
  prompt: string;
  rounds: ClassificationRound[];
};

export type PictureMatchPair = {
  id: string;
  reference: string;
  passage: string;
  imageSource: string;
  sceneLabel: string;
  alt: string;
};

export type PictureMatchData = {
  id: string;
  title: string;
  prompt: string;
  pairs: [PictureMatchPair, PictureMatchPair, PictureMatchPair];
};

export type QuestRef =
  | { type: "verse"; id: string }
  | { type: "story"; id: string }
  | { type: "classification"; id: string }
  | { type: "picture-match"; id: string };

const AUDIO_ROOT = "https://ebible.org/eng-web/audio/01_Genesis";

export const audioChapters: AudioChapter[] = [
  { chapter: 1, title: "The beginning", subtitle: "Light, land, life, and humankind", duration: "about 7 min", source: `${AUDIO_ROOT}/01_01_Genesis_Chapter_One.mp3` },
  { chapter: 2, title: "The garden", subtitle: "Rest, Eden, Adam, and Eve", duration: "about 5 min", source: `${AUDIO_ROOT}/01_02_Genesis_Chapter_Two.mp3` },
  { chapter: 3, title: "The fall", subtitle: "The choice, its cost, and mercy", duration: "about 5 min", source: `${AUDIO_ROOT}/01_03_Genesis_Chapter_Three.mp3` },
];

export const versePuzzles: VersePuzzleData[] = [
  { id: "gen-1-1", reference: "Genesis 1:1", prompt: "Put the opening words of Scripture in order.", pieces: ["In the beginning,", "God created", "the heavens", "and the earth."] },
  { id: "gen-1-3", reference: "Genesis 1:3", prompt: "Rebuild the moment light entered creation.", pieces: ["God said,", "“Let there be light,”", "and there was light."] },
  { id: "gen-1-27", reference: "Genesis 1:27", prompt: "Arrange this verse about humanity's identity.", pieces: ["God created man", "in his own image.", "In God’s image", "he created him;", "male and female", "he created them."] },
  { id: "gen-2-7", reference: "Genesis 2:7", prompt: "Put the forming of the first human in order.", pieces: ["The LORD God", "formed man", "from the dust of the ground,", "and breathed into his nostrils", "the breath of life;", "and man became a living soul."] },
  { id: "gen-2-18", reference: "Genesis 2:18", prompt: "Rebuild God's words about companionship.", pieces: ["The LORD God said,", "“It is not good", "for the man to be alone.", "I will make him", "a helper comparable to him.”"] },
  { id: "gen-3-9", reference: "Genesis 3:9", prompt: "Arrange God's call in the garden.", pieces: ["The LORD God", "called to the man,", "and said to him,", "“Where are you?”"] },
];

export const storySequences: StorySequenceData[] = [
  {
    id: "creation-days", title: "Creation unfolds", reference: "Genesis 1:3-31; 2:1-3", prompt: "Arrange these scenes from the first light to the day of rest.",
    cards: [
      { id: "light", eyebrow: "First", title: "Light appears", description: "God calls light into the darkness.", symbol: "✦", tone: "light" },
      { id: "sky", eyebrow: "Then", title: "Sky and waters", description: "The expanse divides the waters.", symbol: "≈", tone: "sky" },
      { id: "land", eyebrow: "Next", title: "Land and plants", description: "Dry ground appears and the earth grows green.", symbol: "⌁", tone: "earth" },
      { id: "lights", eyebrow: "After that", title: "Sun, moon, stars", description: "Lights mark days, seasons, and years.", symbol: "☼", tone: "stars" },
      { id: "creatures", eyebrow: "Then", title: "Creatures fill creation", description: "Sea life, birds, and land animals multiply.", symbol: "◒", tone: "life" },
      { id: "people", eyebrow: "Finally", title: "Humankind", description: "God creates humanity in his image.", symbol: "◇", tone: "people" },
      { id: "rest", eyebrow: "The seventh day", title: "God rests", description: "God blesses the seventh day and makes it holy.", symbol: "—", tone: "rest" }
    ]
  },
  {
    id: "garden-fall", title: "From garden to exile", reference: "Genesis 2:7-25; 3:1-24", prompt: "Place the key moments of Eden and the fall in sequence.",
    cards: [
      { id: "formed", eyebrow: "First", title: "Adam is formed", description: "God forms the man from dust and breathes life into him.", symbol: "◌", tone: "people" },
      { id: "eden", eyebrow: "Then", title: "Eden is planted", description: "God places the man in the garden to cultivate and keep it.", symbol: "⌁", tone: "garden" },
      { id: "command", eyebrow: "A boundary", title: "The command is given", description: "Every tree is free except the tree of the knowledge of good and evil.", symbol: "!", tone: "warning" },
      { id: "woman", eyebrow: "Companionship", title: "The woman is made", description: "God brings the woman to the man.", symbol: "◇", tone: "people" },
      { id: "fruit", eyebrow: "The choice", title: "The fruit is eaten", description: "The serpent deceives; the woman and man eat.", symbol: "●", tone: "choice" },
      { id: "clothed", eyebrow: "Mercy and consequence", title: "Clothed and sent out", description: "God clothes them and sends them out of Eden.", symbol: "✦", tone: "mercy" }
    ]
  }
];

export const passageClassifications: PassageClassificationData[] = [
  {
    id: "promise-or-instruction",
    title: "Promise or Instruction",
    prompt: "What is this passage doing?",
    rounds: [
      {
        id: "be-fruitful",
        reference: "Genesis 1:28",
        passage: "Be fruitful, multiply, fill the earth, and subdue it.",
        answer: "Instruction",
        explanation: "God is telling the first people what he wants them to do, so this passage functions as an instruction.",
        allowedCategories: [...classificationCategories],
      },
      {
        id: "tree-boundary",
        reference: "Genesis 2:17",
        passage: "But you shall not eat of the tree of the knowledge of good and evil; for in the day that you eat of it, you will surely die.",
        answer: "Warning",
        explanation: "The passage names a boundary and clearly describes the consequence of crossing it, making the warning central.",
        allowedCategories: [...classificationCategories],
      },
      {
        id: "serpent-defeated",
        reference: "Genesis 3:15",
        passage: "He will bruise your head, and you will bruise his heel.",
        answer: "Promise",
        explanation: "In the middle of judgment, God points forward to the serpent’s defeat. Christians have long read this as the Bible’s first promise of rescue.",
        allowedCategories: [...classificationCategories],
      },
    ],
  },
];

export const pictureMatches: PictureMatchData[] = [
  {
    id: "scripture-picture-match",
    title: "Scripture Picture Match",
    prompt: "Match each scene to its Genesis passage.",
    pairs: [
      {
        id: "cosmos-created",
        reference: "Genesis 1:1",
        passage: "In the beginning, God created the heavens and the earth.",
        imageSource: "/images/genesis/galaxy-hero.jpg",
        sceneLabel: "The heavens and the earth",
        alt: "A luminous galaxy surrounded by stars and planets.",
      },
      {
        id: "formed-from-dust",
        reference: "Genesis 2:7",
        passage: "The LORD God formed man from the dust of the ground, and breathed into his nostrils the breath of life.",
        imageSource: "/images/genesis/formed-from-dust.svg",
        sceneLabel: "Formed from dust",
        alt: "A modestly silhouetted human figure rising from warm earth as a stream of light approaches.",
      },
      {
        id: "leaving-eden",
        reference: "Genesis 3:23",
        passage: "Therefore the LORD God sent him out from the garden of Eden, to till the ground from which he was taken.",
        imageSource: "/images/genesis/leaving-eden.svg",
        sceneLabel: "Leaving the garden",
        alt: "Two small, fully clothed figures walking from a bright garden toward open land.",
      },
    ],
  },
];

/** The canonical play order. Unit-page selection remains open and non-linear. */
export const quests: QuestRef[] = [
  { type: "verse", id: "gen-1-1" },
  { type: "verse", id: "gen-1-3" },
  { type: "verse", id: "gen-1-27" },
  { type: "verse", id: "gen-2-7" },
  { type: "verse", id: "gen-2-18" },
  { type: "verse", id: "gen-3-9" },
  { type: "story", id: "creation-days" },
  { type: "story", id: "garden-fall" },
  { type: "classification", id: "promise-or-instruction" },
  { type: "picture-match", id: "scripture-picture-match" },
];

export const canonicalQuestIds = quests.map((quest) => quest.id);

export function questsOfType<T extends QuestRef["type"]>(type: T) {
  return quests.filter((quest): quest is Extract<QuestRef, { type: T }> => quest.type === type);
}

export function resolveQuest(quest: QuestRef) {
  if (quest.type === "verse") return versePuzzles.find((item) => item.id === quest.id);
  if (quest.type === "story") return storySequences.find((item) => item.id === quest.id);
  if (quest.type === "classification") return passageClassifications.find((item) => item.id === quest.id);
  return pictureMatches.find((item) => item.id === quest.id);
}

export function isClassificationAnswer(round: ClassificationRound, answer: ClassificationCategory) {
  return round.answer === answer;
}

export function scorePictureMatches(quest: PictureMatchData, pairings: Record<string, string>) {
  return quest.pairs.map((pair) => ({ id: pair.id, correct: pairings[pair.id] === pair.id }));
}

export function nextQuest(current: QuestRef): QuestRef | null {
  const index = quests.findIndex((quest) => quest.type === current.type && quest.id === current.id);
  return index >= 0 ? quests[index + 1] ?? null : null;
}

export const upcomingUnits = [
  { number: 2, title: "Cain, Abel & Noah", chapters: "Genesis 4-9" },
  { number: 3, title: "Nations & Babel", chapters: "Genesis 10-11" },
  { number: 4, title: "Abraham's journey", chapters: "Genesis 12-25" },
  { number: 5, title: "Isaac & Jacob", chapters: "Genesis 26-36" },
  { number: 6, title: "Joseph's story", chapters: "Genesis 37-50" }
];
