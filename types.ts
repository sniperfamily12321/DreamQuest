
export type GameStatus = 'menu' | 'playing' | 'loading' | 'gameover';
export type View = 'menu' | 'character-creation' | 'playing' | 'settings' | 'achievements' | 'hall-of-legends' | 'story-builder' | 'challenges';
export type Mood = 'adventurous' | 'tense' | 'calm' | 'mysterious' | 'dark';
export type TimeOfDay = 'Day' | 'Night' | 'Dusk' | 'Dawn';

export interface Choice {
  text: string;
  isTimed?: boolean;
  requiredItem?: string;
}

export interface Item {
  name: string;
  description: string;
}

export interface Relationship {
  name: string;
  score: number;
  status: 'Ally' | 'Neutral' | 'Rival';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface Ending {
    title: string;
    text: string;
    imageUrl: string;
}

export interface StoryState {
  storyText: string;
  choices: Choice[];
  imageUrl: string | null;
  isGameOver: boolean;
  gameOverText: string;
  mood: Mood;
  timeOfDay: TimeOfDay;
}

export interface CharacterProfile {
  name: string;
  archetype: 'Warrior' | 'Scholar' | 'Rogue';
  background: 'Noble' | 'Orphan' | 'Merchant';
}

export interface Settings {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    narration: boolean;
}

export interface GameState {
  storyState: StoryState;
  character: CharacterProfile;
  inventory: Item[];
  relationships: Relationship[];
  achievements: Achievement[];
  storyHistory: string[];
  currentLocation: string;
  points: number;
  endingsUnlocked: Ending[];
}

export interface GeminiStoryResponse {
  storyText: string;
  imagePrompt: string;
  choices: Choice[];
  isGameOver: boolean;
  gameOverText: string;
  itemsGained: Item[];
  itemsUsed: string[];
  relationshipChanges: { name: string; change: number }[];
  achievementUnlocked: string | null;
  currentLocation: string;
  mood: Mood;
  timeOfDay: TimeOfDay;
  pointsAwarded: number;
}

export interface Language {
  code: string;
  name: string;
}

export interface TranslatedUI {
  title: string;
  newGame: string;
  continue: string;
  achievements: string;
  settings: string;
  loading: string;
  listen: string;
  stopListening: string;
  playAgain: string;
  returnToMenu: string;
  selectLanguage: string;
  // Character Creation
  createYourCharacter: string;
  characterName: string;
  selectArchetype: string;
  warrior: string,
  scholar: string,
  rogue: string,
  selectBackground: string,
  noble: string,
  orphan: string,
  merchant: string,
  beginAdventure: string,
  // Game UI
  inventory: string,
  relationships: string,
  map: string,
  achievementsUnlocked: string;
  points: string;
  // New Features
  hallOfLegends: string;
  storyBuilder: string;
  multiplayer: string;
  challenges: string;
  community: string;
  resume: string;
  exitToMenu: string;
  menu: string;
  // Settings
  fontSize: string;
  small: string;
  medium: string;
  large: string;
  highContrast: string;
  on: string;
  off: string;
  // Story Builder
  createYourOwnStory: string;
  storyPrompt: string;
  generate: string;
  // Hall of Legends
  noEndings: string;
  // Voice Commands
  voiceCommands: string;
  listening: string;
  // Share
  shareYourStory: string;
  copyToClipboard: string;
  copied: string;
}
