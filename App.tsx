
import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TOOLS } from './constants';
import { Tool } from './types';
import { useTheme } from './hooks/useTheme';
import { Loader } from './components/ui/Loader';
import { ApiKeyManager } from './components/ApiKeyManager';
import { initializeApiKeys, getApiKeys } from './services/apiKeyManager';

// Dynamic import for all feature components
const featureComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    'chat': React.lazy(() => import('./features/Chat/Chat')),
    'text-roast': React.lazy(() => import('./features/TextRoast/TextRoast')),
    'image-roast': React.lazy(() => import('./features/ImageRoast/ImageRoast')),
    'meme-generator': React.lazy(() => import('./features/MemeGenerator/MemeGenerator')),
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
};

const App: React.FC = () => {
    const [activeToolId, setActiveToolId] = useState<string>('chat');
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isApiManagerOpen, setApiManagerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Load keys from environment variable on first load
        initializeApiKeys();
        // If no keys are found after initialization, open the manager
        if (getApiKeys().length === 0) {
            setApiManagerOpen(true);
        }
    }, []);

    const activeTool = useMemo((): Tool | undefined => TOOLS.find(tool => tool.id === activeToolId), [activeToolId]);
    const ActiveToolComponent = activeTool ? featureComponents[activeTool.id] : featureComponents['chat'];

    return (
        <div className={`flex h-screen bg-transparent text-foreground dark:text-dark-foreground font-sans`}>
            <Sidebar 
                activeToolId={activeToolId} 
                setActiveToolId={setActiveToolId}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                openApiKeyManager={() => setApiManagerOpen(true)}
            />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:mr-80' : 'mr-0'}`}>
                <Navbar 
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    toggleTheme={toggleTheme}
                    theme={theme}
                    toolName={activeTool?.title || 'دردشة مع خبيركم'}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
                    <div key={activeToolId} className="animate-slideInUp">
                        <Suspense fallback={<Loader />}>
                            {ActiveToolComponent && <ActiveToolComponent />}
                        </Suspense>
                    </div>
                </main>
            </div>
             <ApiKeyManager isOpen={isApiManagerOpen} onClose={() => setApiManagerOpen(false)} />
        </div>
    );
};

export default App;
