
import { GameState, Language, TranslatedUI, Achievement, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
    fontSize: 'medium',
    highContrast: false,
    narration: false,
};

export const DEFAULT_GAME_STATE: GameState = {
  storyState: {
    storyText: '',
    choices: [],
    imageUrl: null,
    isGameOver: false,
    gameOverText: '',
    mood: 'calm',
    timeOfDay: 'Day',
  },
  character: {
    name: '',
    archetype: 'Warrior',
    background: 'Noble',
  },
  inventory: [],
  relationships: [],
  achievements: [],
  storyHistory: [],
  currentLocation: 'The Beginning',
  points: 0,
  endingsUnlocked: [],
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'hi', name: 'हिन्दी' },
];

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
    { id: 'first_step', name: 'First Step', description: 'Began your grand adventure.' },
    { id: 'secret_finder', name: 'Secret Finder', description: 'Discovered a hidden path.' },
    { id: 'true_friend', name: 'True Friend', description: 'Forged a strong alliance.' },
    { id: 'the_end', name: 'The End?', description: 'Reached one of the story\'s endings.' },
];

export const UI_TEXT: { [key: string]: TranslatedUI } = {
  en: {
    title: 'DreamQuest',
    newGame: 'New Game',
    continue: 'Continue',
    achievements: 'Achievements',
    settings: 'Settings',
    loading: 'Generating your adventure...',
    listen: 'Listen',
    stopListening: 'Stop',
    playAgain: 'Play Again',
    returnToMenu: 'Return to Menu',
    selectLanguage: 'Select Language',
    // Character Creation
    createYourCharacter: 'Create Your Character',
    characterName: 'Enter Your Name',
    selectArchetype: 'Select Archetype',
    warrior: 'Warrior',
    scholar: 'Scholar',
    rogue: 'Rogue',
    selectBackground: 'Select Background',
    noble: 'Noble',
    orphan: 'Orphan',
    merchant: 'Merchant',
    beginAdventure: 'Begin Adventure',
    // Game UI
    inventory: 'Inventory',
    relationships: 'Relationships',
    map: 'Map',
    achievementsUnlocked: 'Achievements Unlocked',
    points: 'Points',
    // New Features
    hallOfLegends: 'Hall of Legends',
    storyBuilder: 'Story Builder',
    multiplayer: 'Multiplayer (Soon)',
    challenges: 'Challenges (Soon)',
    community: 'Community',
    resume: 'Resume',
    exitToMenu: 'Exit to Menu',
    menu: 'Menu',
    // Settings
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    highContrast: 'High Contrast',
    on: 'On',
    off: 'Off',
    // Story Builder
    createYourOwnStory: 'Create Your Own Story',
    storyPrompt: 'Enter your story prompt...',
    generate: 'Generate',
    // Hall of Legends
    noEndings: 'You have not unlocked any endings yet. Finish an adventure to see it here!',
    // Voice Commands
    voiceCommands: 'Voice Commands',
    listening: 'Listening...',
    // Share
    shareYourStory: 'Share Your Story',
    copyToClipboard: 'Copy to Clipboard',
    copied: 'Copied!',
  },
};
