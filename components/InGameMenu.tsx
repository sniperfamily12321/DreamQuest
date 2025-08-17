
import React, { useState } from 'react';
import { Settings, TranslatedUI } from '../types';
import SettingsScreen from './SettingsScreen';
import Icon from './Icon';

interface InGameMenuProps {
    onClose: () => void;
    onReturnToMenu: () => void;
    uiText: TranslatedUI;
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

const InGameMenu: React.FC<InGameMenuProps> = ({ onClose, onReturnToMenu, uiText, settings, onSettingsChange }) => {
    const [showSettings, setShowSettings] = useState(false);

    const MenuButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
        <button onClick={onClick} className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-4 rounded-lg transition-colors">
            {children}
        </button>
    );
    
    if (showSettings) {
        return (
            <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
                 <SettingsScreen settings={settings} onSettingsChange={onSettingsChange} onBack={() => setShowSettings(false)} uiText={uiText} />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-white">
                    <Icon name="close" />
                </button>
                <h2 className="text-3xl font-orbitron text-center mb-6 text-teal-300">{uiText.menu}</h2>
                <div className="space-y-4">
                    <MenuButton onClick={onClose}>{uiText.resume}</MenuButton>
                    <MenuButton onClick={() => setShowSettings(true)}>{uiText.settings}</MenuButton>
                    <MenuButton onClick={onReturnToMenu}>{uiText.exitToMenu}</MenuButton>
                </div>
            </div>
        </div>
    );
};

export default InGameMenu;
