
import React, { useState } from 'react';
import { TranslatedUI } from '../types';
import { geminiService } from '../services/geminiService';
import Icon from './Icon';

interface StoryBuilderScreenProps {
    onBack: () => void;
    uiText: TranslatedUI;
    languageCode: string;
}

const StoryBuilderScreen: React.FC<StoryBuilderScreenProps> = ({ onBack, uiText, languageCode }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ storyText: string; image: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const generatedResult = await geminiService.generateCustomStory(prompt, languageCode);
            setResult(generatedResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate story.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in -mt-20">
            <div className="w-full max-w-3xl p-8 bg-slate-800/50 rounded-lg border border-slate-700">
                <h1 className="text-4xl font-orbitron text-center mb-6 text-teal-300">{uiText.createYourOwnStory}</h1>
                
                <form onSubmit={handleGenerate} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={uiText.storyPrompt}
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:ring-teal-500 focus:border-teal-500"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50" disabled={isLoading || !prompt.trim()}>
                        {isLoading ? <Icon name="spinner" className="w-6 h-6 animate-spin"/> : uiText.generate}
                    </button>
                </form>

                <div className="bg-slate-900/50 rounded-lg min-h-96 flex items-center justify-center p-4">
                    {isLoading && <Icon name="spinner" className="w-12 h-12 text-teal-400 animate-spin-slow" />}
                    {error && <p className="text-red-400">{error}</p>}
                    {result && (
                        <div className="animate-fade-in w-full">
                            <img src={result.image} alt="Generated Scene" className="w-full h-auto object-cover aspect-video rounded-md mb-4" />
                            <p className="text-slate-300">{result.storyText}</p>
                        </div>
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

export default StoryBuilderScreen;
