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

export type QuestRef =
  | { type: "verse"; id: string }
  | { type: "story"; id: string };

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
];

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
