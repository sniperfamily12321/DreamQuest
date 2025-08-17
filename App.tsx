
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameState, GameStatus, Language, TranslatedUI, CharacterProfile, View, Settings, Ending } from './types';
import { geminiService } from './services/geminiService';
import { DEFAULT_GAME_STATE, SUPPORTED_LANGUAGES, UI_TEXT, ALL_ACHIEVEMENTS, DEFAULT_SETTINGS } from './constants';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import LoadingScreen from './components/LoadingScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import AchievementsScreen from './components/AchievementsScreen';
import SettingsScreen from './components/SettingsScreen';
import HallOfLegendsScreen from './components/HallOfLegendsScreen';
import StoryBuilderScreen from './components/StoryBuilderScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedGame = localStorage.getItem('dreamquest_save');
    return savedGame ? JSON.parse(savedGame) : DEFAULT_GAME_STATE;
  });
  const [settings, setSettings] = useState<Settings>(() => {
      const savedSettings = localStorage.getItem('dreamquest_settings');
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [view, setView] = useState<View>('menu');
  const [status, setStatus] = useState<GameStatus>('menu');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [translatedUI, setTranslatedUI] = useState<TranslatedUI>(UI_TEXT['en']);
  
  const hasSaveGame = useMemo(() => !!localStorage.getItem('dreamquest_save'), [view, status]);

  // Save game whenever gameState changes while playing
  useEffect(() => {
    if (status === 'playing' || status === 'gameover') {
      localStorage.setItem('dreamquest_save', JSON.stringify(gameState));
    }
  }, [gameState, status]);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('dreamquest_settings', JSON.stringify(settings));
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    const fontSizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(fontSizeMap[settings.fontSize]);
  }, [settings]);
  
  // Language translation effect
  useEffect(() => {
    const translateUI = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedUI(UI_TEXT.en);
        return;
      }
      setStatus('loading');
      let previousView = view;
      setView('menu'); // Show main menu container while loading translations
      try {
        const translation = await geminiService.translateUI(currentLanguage.code);
        setTranslatedUI(translation);
      } catch (err) {
        setError(`Failed to translate UI. ${err instanceof Error ? err.message : ''}`);
        setTranslatedUI(UI_TEXT.en); // Fallback to English
      } finally {
        setStatus('menu');
        setView(previousView);
      }
    };
    translateUI();
  }, [currentLanguage]);

  // Background music effect
  useEffect(() => {
    const adventurousAudio = document.getElementById('bg-music-adventurous') as HTMLAudioElement;
    const tenseAudio = document.getElementById('bg-music-tense') as HTMLAudioElement;
    
    if (adventurousAudio && tenseAudio) {
      adventurousAudio.volume = 0.3;
      tenseAudio.volume = 0.3;

      if (status === 'playing') {
        if (gameState.storyState.mood === 'tense' || gameState.storyState.mood === 'dark') {
          adventurousAudio.pause();
          tenseAudio.play().catch(e => console.error("Audio play failed:", e));
        } else {
          tenseAudio.pause();
          adventurousAudio.play().catch(e => console.error("Audio play failed:", e));
        }
      } else {
        adventurousAudio.pause();
        tenseAudio.pause();
      }
    }
  }, [status, gameState.storyState.mood]);

  const handleNewGame = () => {
    setView('character-creation');
  };

  const handleContinue = () => {
    const savedGame = localStorage.getItem('dreamquest_save');
    if (savedGame) {
      setGameState(JSON.parse(savedGame));
      setStatus('playing');
      setView('playing');
    }
  };

  const handleStartGame = useCallback(async (character: CharacterProfile) => {
    setView('playing');
    setStatus('loading');
    setError(null);
    localStorage.removeItem('dreamquest_save');
    
    const initialGameState: GameState = {
      ...DEFAULT_GAME_STATE,
      character,
      achievements: ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })),
      endingsUnlocked: gameState.endingsUnlocked, // Carry over unlocked endings for smart memory
    };
    setGameState(initialGameState);

    try {
      const { story, image } = await geminiService.generateInitialStory(character, currentLanguage.code);
      
      setGameState(prev => ({
        ...prev,
        storyState: { ...story, imageUrl: image },
        inventory: story.itemsGained,
        relationships: story.relationshipChanges.map(r => ({ name: r.name, score: r.change, status: 'Neutral' })),
        storyHistory: [story.storyText],
        currentLocation: story.currentLocation,
        points: story.pointsAwarded,
        achievements: prev.achievements.map(ach => ach.id === story.achievementUnlocked ? { ...ach, unlocked: true } : ach),
      }));
      setStatus('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setView('menu');
      setStatus('menu');
    }
  }, [currentLanguage, gameState.endingsUnlocked]);

  const handleChoice = useCallback(async (choice: string) => {
    setStatus('loading');
    setError(null);

    const historySummary = gameState.storyHistory.slice(-3).join('\n---\n');

    try {
      const { story, image } = await geminiService.generateNextChapter(choice, historySummary, gameState, currentLanguage.code);
      
      setGameState(prev => {
        const newInventory = [...prev.inventory, ...story.itemsGained].filter(item => !story.itemsUsed.includes(item.name));
        
        const newRelationships = [...prev.relationships];
        story.relationshipChanges.forEach(change => {
          const existing = newRelationships.find(r => r.name === change.name);
          if (existing) existing.score += change.change;
          else newRelationships.push({ name: change.name, score: change.change, status: 'Neutral' });
        });

        const newAchievements = prev.achievements.map(ach => ach.id === story.achievementUnlocked ? { ...ach, unlocked: true } : ach);
        
        let newEndings = [...prev.endingsUnlocked];
        if (story.isGameOver && !newEndings.some(e => e.title === story.gameOverText)) {
            newEndings.push({ title: story.gameOverText, text: story.storyText, imageUrl: image! });
        }

        return {
          ...prev,
          storyState: { ...story, imageUrl: image },
          inventory: newInventory,
          relationships: newRelationships,
          achievements: newAchievements,
          storyHistory: [...prev.storyHistory, story.storyText],
          currentLocation: story.currentLocation,
          points: prev.points + story.pointsAwarded,
          endingsUnlocked: newEndings,
        }
      });

      if (story.isGameOver) {
        setStatus('gameover');
      } else {
        setStatus('playing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus('playing');
    }
  }, [currentLanguage, gameState]);

  const handleReturnToMenu = () => {
    localStorage.removeItem('dreamquest_save');
    setGameState(prev => ({
        ...DEFAULT_GAME_STATE,
        endingsUnlocked: prev.endingsUnlocked, // Persist unlocked endings
    }));
    setStatus('menu');
    setView('menu');
  };

  const renderContent = () => {
    if (status === 'loading' && view !== 'story-builder' && gameState.storyHistory.length === 0) {
        return <LoadingScreen text={translatedUI.loading} />;
    }
    
    switch(view) {
      case 'character-creation':
        return <CharacterCreationScreen onStartGame={handleStartGame} uiText={translatedUI} />;
      case 'achievements':
        return <AchievementsScreen achievements={gameState.achievements} onBack={() => setView('menu')} uiText={translatedUI} />;
      case 'settings':
        return <SettingsScreen settings={settings} onSettingsChange={setSettings} onBack={() => setView('menu')} uiText={translatedUI} />;
      case 'hall-of-legends':
        return <HallOfLegendsScreen endings={gameState.endingsUnlocked} onBack={() => setView('menu')} uiText={translatedUI} />;
      case 'story-builder':
        return <StoryBuilderScreen onBack={() => setView('menu')} uiText={translatedUI} languageCode={currentLanguage.code}/>;
      case 'playing':
        return (
          <GameScreen
            gameState={gameState}
            onChoice={handleChoice}
            onReturnToMenu={handleReturnToMenu}
            isLoading={status === 'loading'}
            uiText={translatedUI}
            languageCode={currentLanguage.code}
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      case 'menu':
      default:
        return (
          <MainMenu
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onNavigate={setView}
            hasSaveGame={hasSaveGame}
            currentLanguage={currentLanguage}
            onSetLanguage={setCurrentLanguage}
            uiText={translatedUI}
          />
        );
    }
  };

  return (
    <main className="bg-slate-900 text-slate-200 font-inter min-h-screen w-full flex flex-col items-center justify-center p-4">
       <audio id="bg-music-adventurous" loop src="https://cdn.pixabay.com/audio/2022/10/24/audio_963325c6a5.mp3" />
       <audio id="bg-music-tense" loop src="https://cdn.pixabay.com/audio/2022/08/25/audio_510a2731d1.mp3" />
      <div className="w-full max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-800 border border-red-600 text-white px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {renderContent()}
      </div>
       <footer className="text-center py-4 mt-8 text-slate-500 text-sm">
          <p>Powered by SHOOTERS X TITANS. Adventure awaits.</p>
        </footer>
    </main>
  );
};

export default App;
