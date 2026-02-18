'use client';

import { Language } from '@/lib/utils/translations';

interface LanguageToggleProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

export default function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
    return (
        <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm border border-rose-100 p-1 rounded-full shadow-sm">
            <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${currentLanguage === 'en'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-rose-400 hover:text-rose-600'
                    }`}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${currentLanguage === 'hi'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-rose-400 hover:text-rose-600'
                    }`}
            >
                हिं
            </button>
        </div>
    );
}
