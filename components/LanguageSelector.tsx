
import React, { useState } from 'react';
import { Language, TranslatedUI } from '../types';
import Icon from './Icon';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  uiText: TranslatedUI;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onSelect, uiText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (language: Language) => {
    onSelect(language);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLanguage.name}
          <Icon name="chevron-down" className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language)}
                className={`${
                  selectedLanguage.code === language.code ? 'bg-slate-700 text-white' : 'text-slate-300'
                } block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 hover:text-white`}
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
