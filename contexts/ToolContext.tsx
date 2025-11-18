
import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';

const RECENT_TOOLS_KEY = 'khabirkom-recent-tools';
const MAX_RECENT_TOOLS = 3;

interface ToolContextType {
    activeToolId: string;
    setActiveToolId: (id: string) => void;
    recentTools: string[];
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeToolId, _setActiveToolId] = useState<string>('chat');
    const [recentTools, setRecentTools] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(RECENT_TOOLS_KEY);
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

    const addRecentTool = useCallback((id: string) => {
        if (id === 'chat') return; // Don't add chat to recents
        setRecentTools(prev => {
            const newRecents = [id, ...prev.filter(toolId => toolId !== id)];
            return newRecents.slice(0, MAX_RECENT_TOOLS);
        });
    }, []);

    const setActiveToolId = useCallback((id: string) => {
        _setActiveToolId(id);
        addRecentTool(id);
    }, [addRecentTool]);
    
    const value = useMemo(() => ({
        activeToolId,
        setActiveToolId,
        recentTools,
    }), [activeToolId, setActiveToolId, recentTools]);

    return (
        <ToolContext.Provider value={value}>
            {children}
        </ToolContext.Provider>
    );
};