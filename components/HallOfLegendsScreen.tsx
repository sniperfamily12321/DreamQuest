
import React from 'react';
import { Ending, TranslatedUI } from '../types';

interface HallOfLegendsScreenProps {
  endings: Ending[];
  onBack: () => void;
  uiText: TranslatedUI;
}

const HallOfLegendsScreen: React.FC<HallOfLegendsScreenProps> = ({ endings, onBack, uiText }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in -mt-20">
      <div className="w-full max-w-4xl p-8 bg-slate-800/50 rounded-lg border border-slate-700">
        <h1 className="text-4xl font-orbitron text-center mb-8 text-teal-300">{uiText.hallOfLegends}</h1>
        
        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
            {endings.length > 0 ? (
                endings.map((ending, index) => (
                    <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-center">
                        <img src={ending.imageUrl} alt={ending.title} className="w-full md:w-48 h-auto rounded-md object-cover aspect-video md:aspect-square" />
                        <div className="flex-1">
                            <h3 className="text-2xl font-cinzel text-teal-400 mb-2">{ending.title}</h3>
                            <p className="text-slate-400">{ending.text}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-slate-500 italic py-10">{uiText.noEndings}</p>
            )}
        </div>

        <div className="text-center mt-8">
            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-6 rounded-lg transition-colors">
                {uiText.returnToMenu}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HallOfLegendsScreen;
