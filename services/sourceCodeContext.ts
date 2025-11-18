
export const SOURCE_CODE_CONTEXT = `
// FILE: index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToolProvider } from './contexts/ToolContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ChatProvider>
        <ToolProvider>
          <App />
        </ToolProvider>
      </ChatProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// FILE: App.tsx
import React, { useMemo, Suspense, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TOOLS } from './constants';
import { Tool } from './types';
import { useTheme } from './hooks/useTheme';
import { Loader } from './components/ui/Loader';
import { initializeApiKeys } from './services/apiKeyManager';
import { useTool } from './hooks/useTool';
import { ApiKeyManager } from './components/ApiKeyManager';

const featureComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    'chat': React.lazy(() => import('./features/Chat/Chat')),
    'text-roast': React.lazy(() => import('./features/TextRoast/TextRoast')),
    'image-roast': React.lazy(() => import('./features/ImageRoast/ImageRoast')),
    'meme-generator': React.lazy(() => import('./features/MemeGenerator/MemeGenerator')),
    'image-generator': React.lazy(() => import('./features/ImageGenerator/ImageGenerator')),
    'dialect-converter': React.lazy(() => import('./features/DialectConverter/DialectConverter')),
    'news-summarizer': React.lazy(() => import('./features/NewsSummarizer/NewsSummarizer')),
    'moods-generator': React.lazy(() => import('./features/MoodsGenerator/MoodsGenerator')),
    'voice-analysis': React.lazy(() => import('./features/VoiceAnalysis/VoiceAnalysis')),
    'dream-interpreter': React.lazy(() => import('./features/DreamInterpreter/DreamInterpreter')),
    'recipe-generator': React.lazy(() => import('./features/RecipeGenerator/RecipeGenerator')),
    'story-maker': React.lazy(() => import('./features/StoryMaker/StoryMaker')),
    'pdf-summarizer': React.lazy(() => import('./features/PdfSummarizer/PdfSummarizer')),
    'ai-teacher': React.lazy(() => import('./features/AiTeacher/AiTeacher')),
    'ai-love-messages': React.lazy(() => import('./features/AiLoveMessages/AiLoveMessages')),
    'voice-commands': React.lazy(() => import('./features/VoiceCommands/VoiceCommands')),
    'post-generator': React.lazy(() => import('./features/PostGenerator/PostGenerator')),
    'text-converter': React.lazy(() => import('./features/TextConverter/TextConverter')),
    'name-generator': React.lazy(() => import('./features/NameGenerator/NameGenerator')),
    'habit-analyzer': React.lazy(() => import('./features/HabitAnalyzer/HabitAnalyzer')),
    'ai-motivator': React.lazy(() => import('./features/AiMotivator/AiMotivator')),
    'code-explainer': React.lazy(() => import('./features/CodeExplainer/CodeExplainer')),
};

const App: React.FC = () => {
    const { activeToolId } = useTool();
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        initializeApiKeys();
    }, []);

    const activeTool = useMemo((): Tool | undefined => TOOLS.find(tool => tool.id === activeToolId), [activeToolId]);
    const ActiveToolComponent = activeTool ? featureComponents[activeTool.id] : featureComponents['chat'];

    return (
        <div className={\`flex h-full bg-transparent text-foreground dark:text-dark-foreground font-sans\`}>
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onOpenApiKeyManager={() => setApiKeyManagerOpen(true)}
            />
            <div className={\`flex-1 flex flex-col overflow-hidden transition-all duration-300 \${isSidebarOpen ? 'md:mr-80' : 'mr-0'}\`}>
                <Navbar 
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    toggleTheme={toggleTheme}
                    theme={theme}
                    toolName={activeTool?.title || 'دردشة مع خبيركم'}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent">
                    <div key={activeToolId} className="animate-slideInUp h-full">
                        <Suspense fallback={<Loader />}>
                            {ActiveToolComponent && <ActiveToolComponent />}
                        </Suspense>
                    </div>
                </main>
            </div>
            <ApiKeyManager isOpen={isApiKeyManagerOpen} onClose={() => setApiKeyManagerOpen(false)} />
        </div>
    );
};
export default App;

// FILE: types.ts
import { LucideIcon } from 'lucide-react';

export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    category: string;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    parts: { text: string }[];
    timestamp: string;
    error?: boolean;
    imageUrl?: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    toolId: string;
}

export interface AnalysisResult {
    mood: string;
    energy: string;
    roast: string;
    advice: string;
}

// FILE: constants.ts
import {
    MessageSquare, Flame, Image as ImageIcon, Smile, Languages, Newspaper, Sparkles, Mic,
    Cloud, CookingPot, BookOpen, FileText, GraduationCap, Heart, Voicemail, Send, Swords,
    Lightbulb, Target, Zap, Paintbrush, Code
} from 'lucide-react';
import { Tool } from './types';

// ... (TOOLS array content from user)

// FILE: components/Sidebar.tsx
import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown, KeyRound } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { Tool } from '../types';
import { useTool } from '../hooks/useTool';

// ... (Sidebar component content as updated)

// FILE: components/ApiKeyManager.tsx
import React, { useState, useEffect } from 'react';
import { KeyRound, Trash2, X, Plus, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { getApiKeys, addApiKey, deleteApiKey, getCurrentApiKey } from '../services/apiKeyManager';
import { testApiKey } from '../services/geminiService';
import { Button } from './ui/Button';

// ... (ApiKeyManager component content as updated)

// FILE: features/Chat/Chat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Plus, X, Image as ImageIcon, Mic, Copy, Check } from 'lucide-react';
// ... (rest of imports)

// ... (Chat component content as updated, including WelcomeScreen and MessageContent)

// FILE: features/CodeExplainer/CodeExplainer.tsx
// ... (Content of the new CodeExplainer.tsx file)

// FILE: services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse, Content, Modality } from "@google/genai";
import { fileToGenerativePart } from "../utils/fileUtils";
import { Message, AnalysisResult, Tool } from "../types";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';
import { TOOLS } from '../constants';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

// ... (geminiService.ts content as updated, including testApiKey and explainCode)

// ... (content of all other provided files) ...
`;