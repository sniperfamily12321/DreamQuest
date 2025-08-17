
import React from 'react';
import { Language, TranslatedUI, View } from '../types';
import LanguageSelector from './LanguageSelector';
import { SUPPORTED_LANGUAGES } from '../constants';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onNavigate: (view: View) => void;
  hasSaveGame: boolean;
  currentLanguage: Language;
  onSetLanguage: (language: Language) => void;
  uiText: TranslatedUI;
}

const MenuButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; primary?: boolean }> = ({ onClick, disabled, children, primary = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full text-center font-orbitron py-3 px-6 rounded-sm text-lg transition-all duration-300 transform hover:scale-105 shadow-lg
      ${primary 
        ? 'bg-teal-600/80 border-2 border-teal-500 hover:bg-teal-500/80 text-white shadow-teal-700/50' 
        : 'bg-slate-800/50 border-2 border-slate-600/80 hover:bg-slate-700/50 hover:border-slate-500 text-slate-300 shadow-slate-900/50'
      }
      disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:bg-slate-800/30
    `}
  >
    {children}
  </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onContinue, onNavigate, hasSaveGame, currentLanguage, onSetLanguage, uiText }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in -mt-20">
      <h1 className="text-6xl md:text-8xl font-orbitron font-bold text-white mb-4 tracking-widest uppercase">
        {uiText.title}
      </h1>
      <p className="text-slate-400 mb-12 max-w-lg font-cinzel">
        An epic text-based adventure where your choices shape the world.
      </p>
      
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Actions */}
        <div className="flex flex-col gap-4">
            <MenuButton onClick={onNewGame} primary>{uiText.newGame}</MenuButton>
            <MenuButton onClick={onContinue} disabled={!hasSaveGame}>{uiText.continue}</MenuButton>
            <MenuButton onClick={() => onNavigate('story-builder')}>{uiText.storyBuilder}</MenuButton>
            <MenuButton onClick={() => onNavigate('hall-of-legends')}>{uiText.hallOfLegends}</MenuButton>
        </div>
        {/* Secondary Actions */}
        <div className="flex flex-col gap-4">
            <MenuButton onClick={() => onNavigate('achievements')}>{uiText.achievements}</MenuButton>
            <MenuButton onClick={() => onNavigate('settings')}>{uiText.settings}</MenuButton>
            <MenuButton onClick={() => {}} disabled>{uiText.multiplayer}</MenuButton>
            <MenuButton onClick={() => {}} disabled>{uiText.challenges}</MenuButton>
        </div>
      </div>

      <div className="absolute bottom-10 right-10">
        <LanguageSelector
          languages={SUPPORTED_LANGUAGES}
          selectedLanguage={currentLanguage}
          onSelect={onSetLanguage}
          uiText={uiText}
        />
      </div>
       <div className="absolute bottom-10 left-10 text-slate-600">
        Powered by SHOOTERS X TITANS
      </div>
    </div>
  );
};

export default MainMenu;
