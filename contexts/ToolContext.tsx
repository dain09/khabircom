
import React, { createContext, useState, useMemo } from 'react';

interface ToolContextType {
    activeToolId: string;
    setActiveToolId: (id: string) => void;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeToolId, setActiveToolId] = useState<string>('chat');
    
    const value = useMemo(() => ({
        activeToolId,
        setActiveToolId
    }), [activeToolId]);

    return (
        <ToolContext.Provider value={value}>
            {children}
        </ToolContext.Provider>
    );
};