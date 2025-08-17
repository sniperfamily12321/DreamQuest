
import React, { useState } from 'react';
import { TranslatedUI } from '../types';
import Icon from './Icon';

interface ShareModalProps {
    onClose: () => void;
    storyHistory: string[];
    uiText: TranslatedUI;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, storyHistory, uiText }) => {
    const [copied, setCopied] = useState(false);

    const generateStoryText = () => {
        return `My DreamQuest Adventure:\n\n${storyHistory.join('\n\n---\n\n')}\n\nPowered by SHOOTERS X TITANS`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateStoryText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-white">
                    <Icon name="close" />
                </button>
                <h2 className="text-3xl font-orbitron text-center mb-4 text-teal-300">{uiText.shareYourStory}</h2>
                
                <textarea
                    readOnly
                    value={generateStoryText()}
                    className="w-full h-64 bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-300 resize-none mb-4"
                />

                <button
                    onClick={handleCopy}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    {copied ? uiText.copied : uiText.copyToClipboard}
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
