

import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';

const RECENT_TOOLS_KEY = 'khabirkom-recent-tools';
const FAVORITE_TOOLS_KEY = 'khabirkom-favorite-tools';
const MAX_RECENT_TOOLS = 3;

interface ToolContextType {
    history: string[];
    activePath: string;
    activeToolId: string;
    activeConversationId?: string;
    navigateTo: (path: string) => void;
    goBack: () => void;
    recentTools: string[];
    favoriteTools: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<string[]>(['chat/']);
    
    const [recentTools, setRecentTools] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(RECENT_TOOLS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [favoriteTools, setFavoriteTools] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(FAVORITE_TOOLS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recentTools));
        } catch (error) {
            console.error("Failed to save recent tools to localStorage", error);
        }
    }, [recentTools]);

    useEffect(() => {
        try {
            localStorage.setItem(FAVORITE_TOOLS_KEY, JSON.stringify(favoriteTools));
        } catch (error) {
            console.error("Failed to save favorite tools to localStorage", error);
        }
    }, [favoriteTools]);

    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            try {
                if (event.key === RECENT_TOOLS_KEY && event.newValue) {
                    setRecentTools(JSON.parse(event.newValue));
                }
                if (event.key === FAVORITE_TOOLS_KEY && event.newValue) {
                    setFavoriteTools(JSON.parse(event.newValue));
                }
            } catch (e) {
                console.error("Failed to parse tool data from storage event.", e);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addFavorite = useCallback((id: string) => {
        setFavoriteTools(prev => [...prev, id]);
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavoriteTools(prev => prev.filter(toolId => toolId !== id));
    }, []);

    const addRecentTool = useCallback((id: string) => {
        if (id === 'chat' || id.startsWith('chat/')) return;
        setRecentTools(prev => {
            const newRecents = [id, ...prev.filter(toolId => toolId !== id)];
            return newRecents.slice(0, MAX_RECENT_TOOLS);
        });
    }, []);

    const navigateTo = useCallback((path: string) => {
        setHistory(prev => {
            if (prev[prev.length - 1] === path) {
                return prev;
            }
            return [...prev, path];
        });
        const [toolId] = path.split('/');
        addRecentTool(toolId);
    }, [addRecentTool]);

    const goBack = useCallback(() => {
        setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []);

    const activePath = useMemo(() => history[history.length - 1], [history]);
    const [activeToolId, activeConversationId] = useMemo(() => {
        const parts = activePath.split('/');
        return [parts[0], parts[1]];
    }, [activePath]);
    
    const value = useMemo(() => ({
        history,
        activePath,
        activeToolId,
        activeConversationId,
        navigateTo,
        goBack,
        recentTools,
        favoriteTools,
        addFavorite,
        removeFavorite,
    }), [history, activePath, activeToolId, activeConversationId, navigateTo, goBack, recentTools, favoriteTools, addFavorite, removeFavorite]);

    return (
        <ToolContext.Provider value={value}>
            {children}
        </ToolContext.Provider>
    );
};
