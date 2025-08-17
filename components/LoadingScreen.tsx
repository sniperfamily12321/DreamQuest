
import React from 'react';
import Icon from './Icon';

interface LoadingScreenProps {
  text: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center py-20">
      <Icon name="spinner" className="w-16 h-16 text-teal-400 animate-spin-slow mb-6" />
      <h2 className="text-3xl font-cinzel text-slate-300">{text}</h2>
      <p className="text-slate-500 mt-2">The mists of fate are swirling...</p>
    </div>
  );
};

export default LoadingScreen;
