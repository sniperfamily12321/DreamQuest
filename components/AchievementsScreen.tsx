
import React from 'react';
import { Achievement, TranslatedUI } from '../types';
import Icon from './Icon';

interface AchievementsScreenProps {
  achievements: Achievement[];
  onBack: () => void;
  uiText: TranslatedUI;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements, onBack, uiText }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in -mt-20">
      <div className="w-full max-w-2xl p-8 bg-slate-800/50 rounded-lg border border-slate-700">
        <h1 className="text-4xl font-orbitron text-center mb-8 text-teal-300">{uiText.achievements}</h1>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-md border ${
                ach.unlocked ? 'bg-teal-900/50 border-teal-500' : 'bg-slate-700/50 border-slate-600'
              } transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                <Icon name="trophy" className={`w-8 h-8 ${ach.unlocked ? 'text-teal-300' : 'text-slate-500'}`} />
                <div>
                  <h3 className={`font-bold text-lg ${ach.unlocked ? 'text-white' : 'text-slate-300'}`}>{ach.name}</h3>
                  <p className="text-sm text-slate-400">{ach.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
            <button
                onClick={onBack}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                {uiText.returnToMenu}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsScreen;
