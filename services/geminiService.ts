import { GoogleGenAI, Type } from '@google/genai';
import { GeminiStoryResponse, TranslatedUI, GameState, CharacterProfile } from '../types';
import { UI_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const storySchema = {
  type: Type.OBJECT,
  properties: {
    storyText: { type: Type.STRING, description: "A compelling, descriptive paragraph for the current scene. At least 3 sentences long." },
    imagePrompt: { type: Type.STRING, description: "A detailed, vivid, artistic description of the scene for an AI image generator. Focus on atmosphere, colors, key elements, and character actions. Example: 'Epic fantasy art, a lone warrior with a glowing sword standing before an ancient portal in a dark, misty forest, cinematic lighting'." },
    choices: {
      type: Type.ARRAY,
      description: "An array of 3 short, distinct action phrases for the player to choose from.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          requiredItem: { type: Type.STRING, description: "Optional item name from inventory required for this choice." }
        }
      }
    },
    isGameOver: { type: Type.BOOLEAN, description: "Set to true if this is a definitive end of the story (good or bad)." },
    gameOverText: { type: Type.STRING, description: "If isGameOver is true, this is the concluding message. Otherwise, it's an empty string." },
    itemsGained: {
        type: Type.ARRAY,
        description: "A list of items the player acquires in this scene.",
        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }
    },
    itemsUsed: { type: Type.ARRAY, description: "A list of item names from the player's inventory that were consumed or used.", items: { type: Type.STRING } },
    relationshipChanges: {
        type: Type.ARRAY,
        description: "A list of changes to NPC relationships.",
        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, change: { type: Type.INTEGER, description: "A positive or negative number representing the change." } } }
    },
    achievementUnlocked: { type: Type.STRING, description: "The ID of an achievement unlocked in this scene, or null." },
    currentLocation: { type: Type.STRING, description: "The name of the current location for the map." },
    mood: { type: Type.STRING, description: "The dominant mood of the scene: 'adventurous', 'tense', 'calm', 'mysterious', or 'dark'." },
    timeOfDay: { type: Type.STRING, description: "The time of day: 'Day', 'Night', 'Dusk', or 'Dawn'." },
    pointsAwarded: { type: Type.INTEGER, description: "Number of points awarded to the player for this chapter. Usually 10." },
  },
  required: ["storyText", "imagePrompt", "choices", "isGameOver", "gameOverText", "itemsGained", "itemsUsed", "relationshipChanges", "achievementUnlocked", "currentLocation", "mood", "timeOfDay", "pointsAwarded"]
};


const parseJsonResponse = <T,>(jsonString: string, fallback: T): T => {
  try {
    const cleanedString = jsonString.replace(/^```json\s*|```$/g, '').trim();
    return JSON.parse(cleanedString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Original string:", jsonString);
    return fallback;
  }
};


const generateStory = async (prompt: string): Promise<GeminiStoryResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: storySchema,
            temperature: 0.85,
        },
    });

    return parseJsonResponse<GeminiStoryResponse>(response.text, {
        storyText: 'The story machine is broken. Please try again.',
        imagePrompt: 'A single cracked gear on a white background.',
        choices: [{text: 'Try Again'}],
        isGameOver: true,
        gameOverText: 'An unexpected error occurred.',
        itemsGained: [],
        itemsUsed: [],
        relationshipChanges: [],
        achievementUnlocked: null,
        currentLocation: 'Error',
        mood: 'calm',
        timeOfDay: 'Day',
        pointsAwarded: 0,
    });
};

const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `${prompt}, cinematic, hyper-detailed, atmospheric, fantasy art`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error('Image generation failed.');
};

export const geminiService = {
  generateInitialStory: async (character: CharacterProfile, languageCode: string) => {
    const prompt = `You are a master storyteller for a dynamic text adventure game. The user's language is ${languageCode}. All your text output must be in this language.
    PLAYER CHARACTER:
    - Name: ${character.name}
    - Archetype: ${character.archetype}
    - Background: ${character.background}
    
    Create the very beginning of a fantasy adventure for this character. The story begins on a forgotten, mysterious island jungle. This first scene should introduce the world and present the first choice. Set the mood to 'mysterious' and time to 'Dusk'. Unlock the 'first_step' achievement. Award 10 points.
    Generate a JSON object adhering to the required schema.`;

    const story = await generateStory(prompt);
    const image = await generateImage(story.imagePrompt);
    return { story, image };
  },

  generateNextChapter: async (playerChoice: string, storyHistory: string, gameState: GameState, languageCode: string) => {
    const unlockedEndingTitles = gameState.endingsUnlocked.map(e => e.title).join(', ') || 'None';
    const prompt = `You are a master storyteller continuing a text adventure. The user's language is ${languageCode}. All text must be in this language.
    
    CURRENT GAME STATE:
    - Player Character: ${JSON.stringify(gameState.character)}
    - Inventory: ${JSON.stringify(gameState.inventory.map(i => i.name))}
    - Relationships: ${JSON.stringify(gameState.relationships)}
    - Story So Far (summary): ${storyHistory}
    - Previously Unlocked Endings: ${unlockedEndingTitles}
    
    PLAYER'S LAST CHOICE: "${playerChoice}"

    Continue the story based on the player's choice and the current game state. The consequences should be meaningful and exciting, reflecting the character's profile, inventory, and relationships. Award 10 points. You can subtly reference the player's previously unlocked endings to add a sense of memory to the world. Create branching paths, secrets, and potential for multiple endings.
    Generate a new JSON object adhering to the required schema. If the story ends, set isGameOver to true and provide a unique, memorable title for the ending in the gameOverText.`;

    const story = await generateStory(prompt);
    const image = await generateImage(story.imagePrompt);
    return { story, image };
  },
  
  generateCustomStory: async (userPrompt: string, languageCode: string) => {
    const prompt = `You are a creative storyteller. A user wants you to create a short, single-scene story based on their prompt. The user's language is ${languageCode}. Your response must be in this language.
    USER PROMPT: "${userPrompt}"
    
    Based on this prompt, generate a JSON object with two fields:
    1. "storyText": A compelling, single paragraph of story.
    2. "imagePrompt": A detailed, vivid, artistic description of the scene for an AI image generator.
    
    Example response format:
    {
      "storyText": "The clockwork dragon unfurled its metallic wings, catching the moonlight on gears of brass and silver. It let out a puff of steam from its nostrils, its ruby eyes fixed on the distant, floating castle.",
      "imagePrompt": "A magnificent clockwork dragon on a tower, wings of brass and silver, ruby eyes glowing, steam puffing from its nose, a floating castle in the background under a full moon, cinematic, fantasy art."
    }`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            storyText: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
        },
        required: ["storyText", "imagePrompt"],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    const story = parseJsonResponse(response.text, { storyText: 'Could not generate story.', imagePrompt: 'An error.'});
    const image = await generateImage(story.imagePrompt);
    return { ...story, image };
  },

  translateUI: async (targetLang: string): Promise<TranslatedUI> => {
    const baseUI = UI_TEXT.en;
    const prompt = `Translate the values of the following JSON object into the language with the ISO 639-1 code "${targetLang}". Maintain the exact JSON structure and keys. Output ONLY the raw JSON object.\n${JSON.stringify(baseUI, null, 2)}`;
    
    // Dynamically create schema from keys of the English UI text
    const properties: { [key: string]: { type: Type } } = {};
    for (const key in baseUI) {
        properties[key] = { type: Type.STRING };
    }
    const translationSchema = {
        type: Type.OBJECT,
        properties,
        required: Object.keys(baseUI),
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });
        return parseJsonResponse<TranslatedUI>(response.text, UI_TEXT.en);
    } catch (error) {
        console.error(`Failed to translate UI to ${targetLang}:`, error);
        return UI_TEXT.en; // Fallback to English on error
    }
  }
};