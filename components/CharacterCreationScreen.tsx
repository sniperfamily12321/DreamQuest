
import React, { useState } from 'react';
import { CharacterProfile, TranslatedUI } from '../types';

interface CharacterCreationScreenProps {
  onStartGame: (character: CharacterProfile) => void;
  uiText: TranslatedUI;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onStartGame, uiText }) => {
  const [character, setCharacter] = useState<CharacterProfile>({
    name: '',
    archetype: 'Warrior',
    background: 'Noble',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (character.name.trim()) {
      onStartGame(character);
    }
  };
  
  const OptionButton: React.FC<{ value: string; selectedValue: string; onClick: () => void; children: React.ReactNode}> = ({ value, selectedValue, onClick, children }) => (
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-md transition-colors w-full ${selectedValue === value ? 'bg-teal-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
      >
          {children}
      </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in -mt-20">
      <div className="w-full max-w-lg p-8 bg-slate-800/50 rounded-lg border border-slate-700">
        <h1 className="text-4xl font-orbitron text-center mb-8 text-teal-300">{uiText.createYourCharacter}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">{uiText.characterName}</label>
            <input
              type="text"
              id="name"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{uiText.selectArchetype}</label>
            <div className="grid grid-cols-3 gap-2">
              <OptionButton value="Warrior" selectedValue={character.archetype} onClick={() => setCharacter({...character, archetype: 'Warrior'})}>{uiText.warrior}</OptionButton>
              <OptionButton value="Scholar" selectedValue={character.archetype} onClick={() => setCharacter({...character, archetype: 'Scholar'})}>{uiText.scholar}</OptionButton>
              <OptionButton value="Rogue" selectedValue={character.archetype} onClick={() => setCharacter({...character, archetype: 'Rogue'})}>{uiText.rogue}</OptionButton>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{uiText.selectBackground}</label>
            <div className="grid grid-cols-3 gap-2">
                <OptionButton value="Noble" selectedValue={character.background} onClick={() => setCharacter({...character, background: 'Noble'})}>{uiText.noble}</OptionButton>
                <OptionButton value="Orphan" selectedValue={character.background} onClick={() => setCharacter({...character, background: 'Orphan'})}>{uiText.orphan}</OptionButton>
                <OptionButton value="Merchant" selectedValue={character.background} onClick={() => setCharacter({...character, background: 'Merchant'})}>{uiText.merchant}</OptionButton>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            disabled={!character.name.trim()}
          >
            {uiText.beginAdventure}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreationScreen;
