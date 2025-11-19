
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
import { useLanguage } from './hooks/useLanguage';

// Dynamic import for all feature components to optimize initial load
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
    'post-generator': React.lazy(() => import('./features/PostGenerator/PostGenerator')),
    'text-converter': React.lazy(() => import('./features/TextConverter/TextConverter')),
    'name-generator': React.lazy(() => import('./features/NameGenerator/NameGenerator')),
    'habit-analyzer': React.lazy(() => import('./features/HabitAnalyzer/HabitAnalyzer')),
    'ai-motivator': React.lazy(() => import('./features/AiMotivator/AiMotivator')),
    'code-explainer': React.lazy(() => import('./features/CodeExplainer/CodeExplainer')),
    'memory-manager': React.lazy(() => import('./features/MemoryManager/MemoryManager')),
    'image-editor': React.lazy(() => import('./features/ImageEditor/ImageEditor')),
    'khabirkom-settings': React.lazy(() => import('./features/Settings/Settings')),
    'task-manager': React.lazy(() => import('./features/TaskManager/TaskManager')),
    'price-comparator': React.lazy(() => import('./features/PriceComparator/PriceComparator')),
    'the-judge': React.lazy(() => import('./features/TheJudge/TheJudge')),
};

const App: React.FC = () => {
    const { activeToolId, activePath } = useTool();
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        initializeApiKeys();
        // Responsive sidebar check
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, []);

    const activeTool = useMemo((): Tool | undefined => TOOLS.find(tool => tool.id === activeToolId), [activeToolId]);
    const ActiveToolComponent = activeTool ? featureComponents[activeTool.id] : featureComponents['chat'];

    const blobColors = theme === 'dark' 
        ? ["bg-blue-600/10", "bg-purple-600/10", "bg-indigo-600/10"]
        : ["bg-blue-400/20", "bg-purple-400/20", "bg-indigo-400/20"];

    return (
        <div className={`relative flex h-[100dvh] text-foreground dark:text-dark-foreground font-sans antialiased selection:bg-primary/30 overflow-hidden`}>
             {/* Global Animated Background */}
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none select-none -z-10">
                <div className={`absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-aurora ${blobColors[0]}`}></div>
                <div className={`absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-aurora ${blobColors[1]}`} style={{ animationDelay: '2s', animationDirection: 'reverse' }}></div>
                <div className={`absolute -bottom-20 left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-aurora ${blobColors[2]}`} style={{ animationDelay: '4s' }}></div>
            </div>
            
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
                    toolName={activeTool ? t(activeTool.title) : t('tools.chat.title')}
                />
                <main className="flex-1 relative min-h-0">
                    <div key={activePath} className="h-full w-full">
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
