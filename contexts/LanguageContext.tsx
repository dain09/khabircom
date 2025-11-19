import React, { createContext, useState, useMemo } from 'react';
import { t, TFunction } from '../services/localizationService';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: TFunction;
    isInitialized: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('ar');

    // Since localization is initialized at module load, we are always initialized.
    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
        isInitialized: true,
    }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
