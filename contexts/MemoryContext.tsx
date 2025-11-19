
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

interface MemoryContextType {
    memory: Record<string, string>;
    updateMemory: (key: string, value: string) => void;
    deleteMemoryItem: (key: string) => void;
    clearMemory: () => void;
}

export const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

const MEMORY_STORAGE_KEY = 'khabirkom-user-memory';

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [memory, setMemory] = useState<Record<string, string>>(() => {
        try {
            const localData = localStorage.getItem(MEMORY_STORAGE_KEY);
            return localData ? JSON.parse(localData) : {};
        } catch (error) {
            console.error("Failed to load memory from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
        } catch (error) {
            console.error("Failed to save memory to localStorage", error);
        }
    }, [memory]);

    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === MEMORY_STORAGE_KEY && event.newValue) {
                try {
                    setMemory(JSON.parse(event.newValue));
                } catch(e) {
                    console.error("Failed to parse memory data from storage event.", e);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateMemory = useCallback((key: string, value: string) => {
        if (!key.trim() || !value.trim()) return;
        setMemory(prev => ({ ...prev, [key]: value }));
    }, []);

    const deleteMemoryItem = useCallback((key: string) => {
        setMemory(prev => {
            const newMemory = { ...prev };
            delete newMemory[key];
            return newMemory;
        });
    }, []);

    const clearMemory = useCallback(() => {
        setMemory({});
    }, []);
    
    const value = useMemo(() => ({
        memory,
        updateMemory,
        deleteMemoryItem,
        clearMemory,
    }), [memory, updateMemory, deleteMemoryItem, clearMemory]);

    return (
        <MemoryContext.Provider value={value}>
            {children}
        </MemoryContext.Provider>
    );
};
