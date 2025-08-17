
import React, { useState } from 'react';
import { GameState, TranslatedUI, Choice, Settings } from '../types';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import Icon from './Icon';
import Sidebar from './Sidebar';
import InGameMenu from './InGameMenu';
import AmbientEffects from './AmbientEffects';
import ShareModal from './ShareModal';

interface GameScreenProps {
  gameState: GameState;
  onChoice: (choice: string) => void;
  onReturnToMenu: () => void;
  isLoading: boolean;
  uiText: TranslatedUI;
  languageCode: string;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, onChoice, onReturnToMenu, isLoading, uiText, languageCode, settings, onSettingsChange }) => {
  const { storyState, inventory, relationships, currentLocation, achievements, points, storyHistory } = gameState;
  const { storyText, choices, imageUrl, isGameOver, gameOverText, mood, timeOfDay } = storyState;
  const { isSpeaking, isSupported, speak, stop } = useSpeechSynthesis();
  const { isListening, isSupported: voiceSupported, startListening } = useVoiceCommands({
      commands: choices.map(c => c.text),
      onCommand: onChoice
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else if (isSupported) {
      speak(storyText, languageCode);
    }
  };

  return (
    <div className="w-full h-full animate-fade-in-slow relative">
        <AmbientEffects mood={mood} timeOfDay={timeOfDay} />
        {isMenuOpen && <InGameMenu onClose={() => setIsMenuOpen(false)} onReturnToMenu={onReturnToMenu} uiText={uiText} settings={settings} onSettingsChange={onSettingsChange} />}
        {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} storyHistory={storyHistory} uiText={uiText} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            <div className="lg:col-span-3">
                <div className="mb-6 rounded-lg overflow-hidden shadow-2xl shadow-slate-950/50 border border-slate-700 relative">
                {imageUrl ? (
                    <img src={imageUrl} alt="Scene" className="w-full h-auto object-cover aspect-video" />
                ) : (
                    <div className="w-full aspect-video bg-slate-800 flex items-center justify-center">
                    <Icon name="spinner" className="w-12 h-12 text-teal-400 animate-spin-slow" />
                    </div>
                )}
                </div>
                
                <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-lg border border-slate-700 relative">
                    <div className="absolute top-3 right-3 flex gap-2">
                        {isSupported && (
                            <button onClick={handleListen} className="bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-full transition-colors duration-200" aria-label={isSpeaking ? uiText.stopListening : uiText.listen}>
                                <Icon name={isSpeaking ? "stop" : "speaker"} />
                            </button>
                        )}
                        <button onClick={() => setIsShareModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-colors duration-200" aria-label={uiText.shareYourStory}>
                           <Icon name="share" />
                        </button>
                    </div>

                    <p className="text-lg text-slate-300 leading-relaxed font-inter whitespace-pre-wrap pr-20">{storyText}</p>
                    
                    {isGameOver && (
                        <div className="mt-6 text-center animate-fade-in">
                        <p className="text-2xl font-cinzel text-teal-400 mb-4">{gameOverText}</p>
                        <button onClick={onReturnToMenu} className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            {uiText.returnToMenu}
                        </button>
                        </div>
                    )}
                </div>

                {!isGameOver && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                    {choices.map((choice: Choice) => (
                    <button
                        key={choice.text}
                        onClick={() => onChoice(choice.text)}
                        disabled={isLoading}
                        className="bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 text-slate-200 font-semibold w-full py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 border border-slate-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                    >
                        {isLoading && <Icon name="spinner" className="w-5 h-5 animate-spin-slow" />}
                        <span>{choice.text}</span>
                    </button>
                    ))}
                </div>
                )}
            </div>
            <div className="lg:col-span-1">
                <Sidebar 
                inventory={inventory}
                relationships={relationships}
                location={currentLocation}
                unlockedAchievements={achievements.filter(a => a.unlocked).length}
                totalAchievements={achievements.length}
                points={points}
                uiText={uiText}
                />
            </div>
        </div>

        {/* Floating Menu Button */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
             {voiceSupported && !isGameOver && (
                <button onClick={startListening} disabled={isListening} className={`p-3 rounded-full transition-colors text-white ${isListening ? 'bg-red-600 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}`} title={uiText.voiceCommands}>
                    <Icon name="microphone" />
                </button>
            )}
            <button onClick={() => setIsMenuOpen(true)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors flex items-center gap-2">
                <Icon name="settings" className="w-5 h-5"/>
                <span className="hidden sm:inline">{uiText.menu}</span>
            </button>
        </div>
    </div>
  );
};

export default GameScreen;
