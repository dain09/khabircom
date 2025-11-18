
import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { PersonaSettings } from '../types';

interface PersonaContextType {
    persona: PersonaSettings;
    setPersona: (persona: PersonaSettings) => void;
    setHumor: (level: number) => void;
    setVerbosity: (level: number) => void;
    setInterests: (interests: string[]) => void;
}

export const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

const PERSONA_STORAGE_KEY = 'khabirkom-persona-settings';

const defaultPersona: PersonaSettings = {
    humor: 7,
    verbosity: 5,
    interests: [],
};

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [persona, setPersona] = useState<PersonaSettings>(() => {
        try {
            const localData = localStorage.getItem(PERSONA_STORAGE_KEY);
            return localData ? { ...defaultPersona, ...JSON.parse(localData) } : defaultPersona;
        } catch (error) {
            console.error("Failed to load persona from localStorage", error);
            return defaultPersona;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(persona));
        } catch (error) {
            console.error("Failed to save persona to localStorage", error);
        }
    }, [persona]);

    const setHumor = useCallback((level: number) => {
        setPersona(p => ({ ...p, humor: level }));
    }, []);

    const setVerbosity = useCallback((level: number) => {
        setPersona(p => ({ ...p, verbosity: level }));
    }, []);
    
    const setInterests = useCallback((interests: string[]) => {
        setPersona(p => ({ ...p, interests }));
    }, []);

    const value = useMemo(() => ({
        persona,
        setPersona,
        setHumor,
        setVerbosity,
        setInterests,
    }), [persona, setHumor, setVerbosity, setInterests]);

    return (
        <PersonaContext.Provider value={value}>
            {children}
        </PersonaContext.Provider>
    );
};

export const usePersona = () => {
    const context = useContext(PersonaContext);
    if (context === undefined) {
        throw new Error('usePersona must be used within a PersonaProvider');
    }
    return context;
};
