
import React from 'react';
import { Settings, TranslatedUI } from '../types';

interface SettingsScreenProps {
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
    onBack: () => void;
    uiText: TranslatedUI;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSettingsChange, onBack, uiText }) => {
    
    const ToggleButton: React.FC<{ label: string; value: boolean; onToggle: () => void; }> = ({ label, value, onToggle }) => (
        <div className="flex items-center justify-between">
            <span className="text-slate-300">{label}</span>
            <button onClick={onToggle} className={`px-4 py-1 rounded-full w-24 ${value ? 'bg-teal-600' : 'bg-slate-600'}`}>
                {value ? uiText.on : uiText.off}
            </button>
        </div>
    );
    
    const OptionGroup: React.FC<{ label: string; children: React.ReactNode}> = ({ label, children }) => (
        <div>
            <label className="block text-lg font-orbitron text-teal-400 mb-2">{label}</label>
            <div className="bg-slate-900/50 p-3 rounded-md space-y-3">{children}</div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in -mt-20">
            <div className="w-full max-w-lg p-8 bg-slate-800/50 rounded-lg border border-slate-700">
                <h1 className="text-4xl font-orbitron text-center mb-8 text-teal-300">{uiText.settings}</h1>
                <div className="space-y-6">

                    <OptionGroup label={uiText.fontSize}>
                        <div className="flex items-center justify-between gap-2">
                           <button onClick={() => onSettingsChange({...settings, fontSize: 'small'})} className={`w-full py-1 rounded ${settings.fontSize === 'small' ? 'bg-teal-600' : 'bg-slate-600'}`}>{uiText.small}</button>
                           <button onClick={() => onSettingsChange({...settings, fontSize: 'medium'})} className={`w-full py-1 rounded ${settings.fontSize === 'medium' ? 'bg-teal-600' : 'bg-slate-600'}`}>{uiText.medium}</button>
                           <button onClick={() => onSettingsChange({...settings, fontSize: 'large'})} className={`w-full py-1 rounded ${settings.fontSize === 'large' ? 'bg-teal-600' : 'bg-slate-600'}`}>{uiText.large}</button>
                        </div>
                    </OptionGroup>

                    <OptionGroup label="Accessibility">
                        <ToggleButton label={uiText.highContrast} value={settings.highContrast} onToggle={() => onSettingsChange({...settings, highContrast: !settings.highContrast})}/>
                    </OptionGroup>
                    
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

export default SettingsScreen;
