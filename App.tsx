
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
import { ToastContainer } from './components/ToastContainer';

// Dynamic import for all feature components
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
    'khabirkom-settings': React.lazy(() => import('./features/Settings/Settings')),
};

const App: React.FC = () => {
    const { activeToolId } = useTool();
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        initializeApiKeys();
        // Mobile check for sidebar
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, []);

    const activeTool = useMemo((): Tool | undefined => TOOLS.find(tool => tool.id === activeToolId), [activeToolId]);
    const ActiveToolComponent = activeTool ? featureComponents[activeTool.id] : featureComponents['chat'];

    return (
        <div className={`relative flex h-full text-foreground dark:text-dark-foreground font-sans antialiased selection:bg-primary/30 overflow-hidden`}>
             {/* 
                Performance Optimization: Fixed Background
                This div stays completely static in terms of DOM position. 
                Colors are handled by CSS variables or simple class switching, preventing layout thrashing.
             */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none" />
            
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onOpenApiKeyManager={() => setApiKeyManagerOpen(true)}
            />
            
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:mr-80' : 'mr-0'}`}>
                <Navbar 
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    toggleTheme={toggleTheme}
                    theme={theme}
                    toolName={activeTool?.title || 'دردشة مع خبيركم'}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                    <div key={activeToolId} className="h-full p-1 sm:p-2 max-w-7xl mx-auto animate-fadeIn">
                        <Suspense fallback={<Loader />}>
                            {ActiveToolComponent && <ActiveToolComponent />}
                        </Suspense>
                    </div>
                </main>
            </div>
            
            <ApiKeyManager isOpen={isApiKeyManagerOpen} onClose={() => setApiKeyManagerOpen(false)} />
            <ToastContainer />
        </div>
    );
};

export default App;
