
export const SOURCE_CODE_CONTEXT = `
// FILE: index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToolProvider } from './contexts/ToolContext';
import { MemoryProvider } from './contexts/MemoryContext';

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
          <MemoryProvider>
            <App />
          </MemoryProvider>
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
    'memory-manager': React.lazy(() => import('./features/MemoryManager/MemoryManager')),
    'image-editor': React.lazy(() => import('./features/ImageEditor/ImageEditor')),
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
    Lightbulb, Target, Zap, Paintbrush, Code, BrainCircuit, Wand2
} from 'lucide-react';
import { Tool } from './types';

// ... (TOOLS array content from user, now including memory-manager and image-editor)

// FILE: features/Chat/Chat.tsx
// ... (Chat component content as updated, including mobile UI fix and memory integration)

// FILE: features/MemoryManager/MemoryManager.tsx (NEW)
// ... (Content of the new MemoryManager.tsx file)

// FILE: features/ImageEditor/ImageEditor.tsx (NEW)
// ... (Content of the new ImageEditor.tsx file)

// FILE: services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse, Content, Modality } from "@google/genai";
import { fileToGenerativePart } from "../utils/fileUtils";
import { Message, AnalysisResult, Tool } from "../types";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';
import { TOOLS } from '../constants';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

// ... (geminiService.ts content as updated, including memory in chat prompt and new editImage function)

// FILE: contexts/MemoryContext.tsx (NEW)
// ... (Content of the new MemoryContext.tsx file)

// ... (content of all other provided files) ...
`;
