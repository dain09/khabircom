
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { initializeLocalization, t, TFunction } from '../services/localizationService';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: TFunction;
    isInitialized: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('ar');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            await initializeLocalization();
            setIsInitialized(true);
        };
        init();
    }, []);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
        isInitialized,
    }), [language, isInitialized]);

    if (!isInitialized) {
        // You can render a global loader here if needed
        return null; 
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
