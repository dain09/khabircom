// This file contains the full source code of the application as a string context
// for the AI to become self-aware and answer questions about its own implementation.

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

// FILE: metadata.json
{
  "name": "خبيركم",
  "description": "تطبيق عربي شامل يجمع كل المميزات الكوميدية، المفيدة، والذكية في مكان واحد. مدعوم من Gemini API لتقديم تجربة فريدة في الدردشة، تحليل الصور، توليد المحتوى، والمزيد.",
  "requestFramePermissions": [
    "camera",
    "microphone"
  ]
}

// FILE: index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <script type="importmap">
      {
        "imports": {
          "react": "https://aistudiocdn.com/react@^19.2.0",
          "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
          "react/": "https://aistudiocdn.com/react@^19.2.0/",
          "lucide-react": "https://aistudiocdn.com/lucide-react@^0.554.0",
          "@google/genai": "https://aistudiocdn.com/@google/genai@^1.29.1",
          "uuid": "https://aistudiocdn.com/uuid@^13.0.0",
          "react-markdown": "https://aistudiocdn.com/react-markdown@^9.0.1",
          "remark-gfm": "https://aistudiocdn.com/remark-gfm@^4.0.0",
          "react-syntax-highlighter": "https://aistudiocdn.com/react-syntax-highlighter@^15.5.0",
          "react-syntax-highlighter/": "https://aistudiocdn.com/react-syntax-highlighter@^15.5.0/"
        }
      }
    </script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAEcElEQVR4nO3dO29cVRzH8e/MA3gBkyYlBDSFgFDSi4CIkGgoKiJ8AYqEipQyFSoKBEQFIv+AImqpdEgJASGlkIiA5G0gNk3SgAW4YQ+wYw/nlB+Su92997wze2b2e84n2fnszPzOmdk5Y/yAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAPwO++8/f/j05P7u/8uMfnz169J8T5/vTMyPj07OjE+f783OjU+cHz/ZnPj/+7NlnJ2dHpwZf3p/4+P3Hn/345Pxs5eO3Dxx8+dnh8fnVwZf3R6enPj6/Mvjyo/Mzw+ff3vj4/Kpw+M9p4AMHHn65vzz88uDLOzPjZz/++O2T0+f7s9fnVwdf3p/Y+Pj9yX0P/3ny5cn52cn10Zf35/88efI/256dHF38wQMfPnx6+GcPvjxy+F9vA35x8GcP3nj4Zw++PHz/p/eBPz/48vDAh18ePvgvHn/24P3J3dnhfP/24MvDAx9+efDg/eT+5vDA/b9aA3598L/rQ+B7D/57DQB+efD/bQ+B7z/47/EA8KuD/wUfAu89+C8eAH558L/nQ+B9B/+LhwBfv+yC5w/eP/+V9vXnBz68v3A++N/4+NnD9ycffvl7D/8LnwPeA27e8+C5g/fPT67Pn+/Pfrw++PC+wvnA+4cHH375+9+P/wP2PvD+xMfnFwcf3p+cHhw4P+f5wfszVwffHpycn52eHhw4P/c88P7s2XMnZwdf3h9cH5z//Dzw/vTUM4MvD5/vz368Pjg/+fyTz/7+NnD5x+dn+7P3589+fPLh539rDvy74MKXn58ZePz2+fnVsYMP70+cPn/h47dnP/746+Dze89+fPKXm0D+XfDl+cnh+flnTw/v/974+O3B2dH5+dXR/9k3PvgHwG8Pvvyz7+CD/wH89uDLf/oOvvAHgN8cfPln38EH/+2/fPgn/Jc3/8g/uQ/4xQG/PPgT/p82/2yQf/Lf8G+Afxnwo3/yD98fAAB+Z8AP/pW/Af/lT/8G+JUAP/hb/gb4Vz79G+D/C/jR//D3wN+fGZy+N98Df35m8PnfBwC8/3HwP+c88P7s+fkz4Pvnz89fBwDAX33wP+f8v5f/fv7g/z357DkTgH8GvP/x088eAEC/77/yD34X/L89+B/+LgAAnwJ+9r/x+T/5LgAADwO/+594/19wFwAAh8D/5NdfBwDgd8A/9+svAAC8Dfz//+VzANAP/J///hYAAN8B3/3n30//AgDAk+C7f/398z8A4O/wX8AnDgAAv+c//5cDAED+Hnj/wz9/33/hL/+d/58BAAB+C/zp2dGpQwAAvAv+6Wf3R3f/BADg1/DX//8P8G9v/u/9XQAA/h7817/8/P78VwEAuD94/+PjJwAA/hP403/yLwAA/BP403/xTwAA+IHg+w/4iQAA8P/h++8/4CcDAOB74D/hLwIAwM+D5//kLwEAgNfA+z/4SwCA4K3g/cEPHAAAvAnen9wfAQAA/wD+6dmRw/8EAAAM3gq+O3/wf8w/YMCAAAAAAAAAAPBf/gC9D77fUv1D4AAAAABJRU5ErkJggg==" />
    <link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAEcElEQVR4nO3dO29cVRzH8e/MA3gBkyYlBDSFgFDSi4CIkGgoKiJ8AYqEipQyFSoKBEQFIv+AImqpdEgJASGlkIiA5G0gNk3SgAW4YQ+wYw/nlB+Su92997wze2b2e84n2fnszPzOmdk5Y/yAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAPwO++8/f/j05P7u/8uMfnz169J8T5/vTMyPj07OjE+f783OjU+cHz/ZnPj/+7NlnJ2dHpwZf3p/4+P3Hn/345Pxs5eO3Dxx8+dnh8fnVwZf3R6enPj6/Mvjyo/Mzw+ff3vj4/Kpw+M9p4AMHHn65vzz88uDLOzPjZz/++O2T0+f7s9fnVwdf3p/Y+Pj9yX0P/3ny5cn52cn10Zf35/88efI/256dHF38wQMfPnx6+GcPvjxy+F9vA35x8GcP3nj4Zw++PHz/p/eBPz/48vDAh18ePvgvHn/24P3J3dnhfP/24MvDAx9+efDg/eT+5vDA/b9aA3598L/rQ+B7D/57DQB+efD/bQ+B7z/47/EA8KuD/wUfAu89+C8eAH558L/nQ+B9B/+LhwBfv+yC5w/eP/+V9vXnBz68v3A++N/4+NnD9ycffvl7D/8LnwPeA27e8+C5g/fPT67Pn+/Pfrw++PC+wvnA+4cHH375+9+P/wP2PvD+xMfnFwcf3p+cHhw4P+f5wfszVwffHpycn52eHhw4P/c88P7s2XMnZwdf3h9cH5z//Dzw/vTUM4MvD5/vz368Pjg/+fyTz/7+NnD5x+dn+7P3589+fPLh539rDvy74MKXn58ZePz2+fnVsYMP70+cPn/h47dnP/746+Dze89+fPKXm0D+XfDl+cnh+flnTw/v/974+O3B2dH5+dXR/9k3PvgHwG8Pvvyz7+CD/wH89uDLf/oOvvAHgN8cfPln38EH/+2/fPgn/Jc3/8g/uQ/4xQG/PPgT/p82/2yQf/Lf8G+Afxnwo3/yD98fAAB+Z8AP/pW/Af/lT/8G+JUAP/hb/gb4Vz79G+D/C/jR//D3wN+fGZy+N98Df35m8PnfBwC8/3HwP+c88P7s+fkz4Pvnz89fBwDAX33wP+f8v5f/fv7g/z357DkTgH8GvP/x088eAEC/77/yD34X/L89+B/+LgAAnwJ+9r/x+T/5LgAADwO/+594/19wFwAAh8D/5NdfBwDgd8A/9+svAAC8Dfz//+VzANAP/J///hYAAN8B3/3n30//AgDAk+C7f/398z8A4O/wX8AnDgAAv+c//5cDAED+Hnj/wz9/33/hL/+d/58BAAB+C/zp2dGpQwAAvAv+6Wf3R3f/BADg1/DX//8P8G9v/u/9XQAA/h7817/8/P78VwEAuD94/+PjJwAA/hP403/yLwAA/BP403/xTwAA+IHg+w/4iQAA8P/h++8/4CcDAOB74D/hLwIAwM+D5//kLwEAgNfA+z/4SwCA4K3g/cEPHAAAvAnen9wfAQAA/wD+6dmRw/8EAAAM3gq+O3/wf8w/YMCAAAAAAAAAAPBf/gC9D77fUv1D4AAAAABJRU5ErkJggg==" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>خبيركم - مساعدك المصري الفهلوي</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Tajawal', 'sans-serif'],
            },
            colors: {
              primary: {
                DEFAULT: 'hsl(180, 80%, 45%)', // Vibrant Teal/Cyan
                foreground: 'hsl(0, 0%, 100%)',
                dark: 'hsl(180, 80%, 35%)',
              },
              background: 'hsl(210, 20%, 98%)',
              foreground: 'hsl(222, 47%, 11%)',
              dark: {
                background: 'hsl(222, 40%, 12%)',
                foreground: 'hsl(215, 20%, 85%)',
                card: 'hsl(222, 40%, 15%)'
              }
            },
            keyframes: {
              slideInUp: {
                'from': { opacity: '0', transform: 'translateY(20px)' },
                'to': { opacity: '1', transform: 'translateY(0)' },
              },
              gradientAnimation: {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              bubbleIn: {
                'from': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
                'to': { opacity: '1', transform: 'scale(1) translateY(0)' },
              },
              botIdleBob: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-2px)' },
              },
              pulsingDots: {
                '0%, 100%': { opacity: 0.5, transform: 'scale(0.8)' },
                '50%': { opacity: 1, transform: 'scale(1)' },
              }
            },
            animation: {
              slideInUp: 'slideInUp 0.5s ease-out forwards',
              gradient: 'gradientAnimation 15s ease infinite',
              bubbleIn: 'bubbleIn 0.3s ease-out forwards',
              'bot-idle-bob': 'botIdleBob 3s ease-in-out infinite',
              'pulsing-dots': 'pulsingDots 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
          },
        },
      }
    </script>
     <style>
      html, body, #root {
        height: 100%;
        overflow: hidden; /* Prevent body scrolling to fix mobile viewport issues */
      }
      body {
        background: linear-gradient(-45deg, hsl(200, 50%, 97%), hsl(210, 50%, 96%), hsl(190, 50%, 94%));
        background-size: 400% 400%;
        animation: gradientAnimation 20s ease infinite;
      }
      .dark body {
        background: linear-gradient(-45deg, hsl(222, 47%, 11%), hsl(220, 39%, 14%), hsl(230, 31%, 18%), hsl(222, 47%, 11%));
        background-size: 400% 400%;
        animation: gradientAnimation 20s ease infinite;
      }
      .glow-effect {
        transition: box-shadow 0.3s ease-in-out;
      }
      .glow-effect:hover, .glow-effect:focus-visible {
        box-shadow: 0 0 15px 0px hsl(180, 80%, 45%, 0.5), 0 0 25px 0px hsl(180, 80%, 45%, 0.3);
      }

      /* Custom Scrollbar for Webkit browsers */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background-color: hsl(210, 13%, 85%);
        border-radius: 20px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: hsl(210, 13%, 75%);
      }
      .dark ::-webkit-scrollbar-thumb {
        background-color: hsl(222, 40%, 25%);
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background-color: hsl(222, 40%, 35%);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>

// FILE: vite-env.d.ts
// Fix: Removed the triple-slash directive for "vite/client".
// This resolves the "Cannot find type definition file" error which is likely due to a project setup issue.
// The interfaces below provide the necessary types for the environment variables used in the app.

interface ImportMetaEnv {
  readonly VITE_API_KEYS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
};

const App: React.FC = () => {
    const { activeToolId } = useTool();
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Load keys from environment variable on first load
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
    imageUrl?: string; // For UI rendering
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    toolId: string;
}

// Fix: Add AnalysisResult interface for use in voice analysis feature.
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
    Lightbulb, Target, Zap, Paintbrush
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
    // Special tool, no category
    { id: 'chat', title: 'دردشة مع خبيركم', description: 'اسأل، اطلب، فضفض... أنا معاك', icon: MessageSquare, color: 'text-blue-500', category: '' },
    
    // المرح والإبداع
    { id: 'text-roast', title: 'تحفيل على الكلام', description: 'ابعت أي جملة وأنا هروّق عليها', icon: Flame, color: 'text-green-500', category: 'المرح والإبداع' },
    { id: 'image-roast', title: 'تحفيل على الصور', description: 'وريني أي صورة وأنا هقولك رأيي بصراحة', icon: ImageIcon, color: 'text-orange-500', category: 'المرح والإبداع' },
    { id: 'meme-generator', title: 'صانع الميمز', description: 'حوّل صورك لميمز تفرط من الضحك', icon: Smile, color: 'text-red-500', category: 'المرح والإبداع' },
    { id: 'image-generator', title: 'رسام الخبير', description: 'حوّل خيالك لصور فنية بالذكاء الاصطناعي', icon: Paintbrush, color: 'text-teal-500', category: 'المرح والإبداع' },
    { id: 'moods-generator', title: 'محلل المود', description: 'اكتب أي حاجة والخبير هيحلل مودك بطريقة كوميدية', icon: Sparkles, color: 'text-gray-500', category: 'المرح والإبداع' },
    { id: 'story-maker', title: 'مكمل السيناريوهات', description: 'ابدأ أي سيناريو وأنا هكملهولك بنهاية كوميدية', icon: BookOpen, color: 'text-orange-400', category: 'المرح والإبداع' },
    { id: 'ai-love-messages', title: 'رسائل الحب والغرام', description: 'رسائل لكل الأذواق والمناسبات، حتى العتاب الرخم', icon: Heart, color: 'text-yellow-400', category: 'المرح والإبداع' },
    { id: 'name-generator', title: 'مولد الأسماء', description: 'أسماء مشاريع وحسابات مبتكرة', icon: Lightbulb, color: 'text-green-600', category: 'المرح والإبداع' },
    { id: 'ai-motivator', title: 'المحفز الرخم', description: 'كلام يحفزك... بس على طريقتي', icon: Zap, color: 'text-red-600', category: 'المرح والإبداع' },
    { id: 'post-generator', title: 'مولد بوستات السوشيال', description: 'بوستات جاهزة لكل المنصات', icon: Send, color: 'text-brown-400', category: 'المرح والإبداع' },

    // أدوات النصوص
    { id: 'dialect-converter', title: 'مترجم اللهجات', description: 'ترجم أي كلام لأي لهجة بمزاج', icon: Languages, color: 'text-purple-500', category: 'أدوات النصوص' },
    { id: 'news-summarizer', title: 'ملخص الأخبار الفوري', description: 'لخّص أي خبر في ثواني, بجد أو بهزار', icon: Newspaper, color: 'text-yellow-500', category: 'أدوات النصوص' },
    { id: 'pdf-summarizer', title: 'ملخص الملفات والنصوص', description: 'لخّص أي ملف أو كلام كتير', icon: FileText, color: 'text-red-400', category: 'أدوات النصوص' },
    { id: 'text-converter', title: 'محول الأساليب', description: 'غيّر أسلوب أي كلام بمزاجك', icon: Swords, color: 'text-blue-600', category: 'أدوات النصوص' },

    // المعرفة والمساعدة
    { id: 'dream-interpreter', title: 'مفسر الأحلام الفلكي', description: 'تفسيرات منطقية وفكاهية لأحلامك', icon: Cloud, color: 'text-blue-400', category: 'المعرفة والمساعدة' },
    { id: 'ai-teacher', title: 'الأستاذ الفهلوي في التخطيط', description: 'اديني اسم موضوع صعب وأنا هعملك خطة مذاكرة فهلوانية', icon: GraduationCap, color: 'text-purple-400', category: 'المعرفة والمساعدة' },
    { id: 'habit-analyzer', title: 'المحلل الفهلوي', description: 'قول 5 حاجات عنك وأنا هطلعلك موهبتك الخفية', icon: Target, color: 'text-orange-600', category: 'المعرفة والمساعدة' },

    // الإنتاجية اليومية
    { id: 'voice-analysis', title: 'تحليل الصوت', description: 'من صوتك هقولك مودك إيه (تجريبي)', icon: Mic, color: 'text-brown-500', category: 'الإنتاجية اليومية' },
    { id: 'recipe-generator', title: 'وصفات على قد الإيد', description: 'قولي عندك إيه وأنا هعملك أكلة', icon: CookingPot, color: 'text-green-400', category: 'الإنتاجية اليومية' },
    { id: 'voice-commands', title: 'الأوامر الصوتية', description: 'دوس واتكلم، وأنا هنفذ (تجريبي)', icon: Voicemail, color: 'text-gray-400', category: 'الإنتاجية اليومية' },
];

// FILE: utils/fileUtils.ts
// Helper function to convert a File object to a GenerativePart for Gemini API
export const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    
    return {
        inlineData: { data: base64EncodedData, mimeType: file.type },
    };
};

// FILE: contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// FILE: contexts/ChatContext.tsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';

interface ChatContextType {
    conversations: Conversation[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    activeConversation: Conversation | null;
    createNewConversation: () => Conversation;
    deleteConversation: (id: string) => void;
    renameConversation: (id: string, newTitle: string) => void;
    addMessageToConversation: (id: string, message: Message) => void;
    updateMessageInConversation: (conversationId: string, messageId: string, updates: Partial<Omit<Message, 'id'>>) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const localData = localStorage.getItem('chat-conversations');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('chat-conversations', JSON.stringify(conversations));
        } catch (error) {
            console.error("Failed to save conversations to localStorage", error);
        }
    }, [conversations]);

    const createNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: uuidv4(),
            title: 'محادثة جديدة',
            messages: [],
            createdAt: new Date().toISOString(),
            toolId: 'chat',
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        return newConversation;
    }, []);

    const deleteConversation = useCallback((id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(null);
        }
    }, [activeConversationId]);
    
    const renameConversation = useCallback((id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    }, []);

    const addMessageToConversation = useCallback((id: string, message: Message) => {
        setConversations(prev => {
            return prev.map(convo => {
                if (convo.id === id) {
                    const newMessages = [...convo.messages, message];
                    // Auto-rename conversation if it's new
                    const isNew = convo.title === 'محادثة جديدة' && convo.messages.length === 0 && message.role === 'user';
                    const newTitle = isNew ? message.parts[0].text.substring(0, 30) : convo.title;
                    return { ...convo, messages: newMessages, title: newTitle };
                }
                return convo;
            });
        });
    }, []);

    const updateMessageInConversation = useCallback((conversationId: string, messageId: string, updates: Partial<Omit<Message, 'id'>>) => {
        setConversations(prev => prev.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    messages: convo.messages.map(msg => 
                        msg.id === messageId ? { ...msg, ...updates } : msg
                    )
                };
            }
            return convo;
        }));
    }, []);
    
    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId) || null;
    }, [conversations, activeConversationId]);
    
    const value = useMemo(() => ({
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        createNewConversation,
        deleteConversation,
        renameConversation,
        addMessageToConversation,
        updateMessageInConversation,
    }), [conversations, activeConversationId, activeConversation, createNewConversation, deleteConversation, renameConversation, addMessageToConversation, updateMessageInConversation]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

// FILE: contexts/ToolContext.tsx
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

// FILE: hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// FILE: hooks/useChat.ts
import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    // This hook now implicitly provides updateMessageInConversation
    return context;
};

// FILE: hooks/useTool.ts
import { useContext } from 'react';
import { ToolContext } from '../contexts/ToolContext';

export const useTool = () => {
    const context = useContext(ToolContext);
    if (context === undefined) {
        throw new Error('useTool must be used within a ToolProvider');
    }
    return context;
};

// FILE: hooks/useGemini.ts
import { useState, useCallback } from 'react';

type GeminiServiceFunction<T, P> = (params: P) => Promise<T>;

export const useGemini = <T, P>(serviceFunction: GeminiServiceFunction<T, P>) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (params: P) => {
        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await serviceFunction(params);
            setData(response);
            return response;
        } catch (err: any) {
            setError(err.message || 'حصل خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    }, [serviceFunction]);

    return { data, isLoading, error, execute };
};

// FILE: services/apiKeyManager.ts
const KEYS_STORAGE_KEY = 'gemini-api-keys';
const CURRENT_KEY_INDEX_KEY = 'gemini-current-api-key-index';

// Function to load keys from environment variable and store them if they don't exist
export const initializeApiKeys = () => {
    try {
        const storedKeys = localStorage.getItem(KEYS_STORAGE_KEY);
        // Only initialize from env var if localStorage is empty
        if (storedKeys === null || JSON.parse(storedKeys).length === 0) {
            // In Vite, environment variables are accessed via import.meta.env
            const envKeys = import.meta.env.VITE_API_KEYS;
            if (envKeys) {
                const keysArray = envKeys.split(',').map(k => k.trim()).filter(Boolean);
                if (keysArray.length > 0) {
                    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keysArray));
                    localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
                    console.log(\`Initialized with \${keysArray.length} API keys from environment variable.\`);
                }
            }
        }
    } catch (e) {
        console.error("Could not initialize API keys from environment variables.", e);
    }
};

export const getApiKeys = (): string[] => {
    try {
        const keysJson = localStorage.getItem(KEYS_STORAGE_KEY);
        return keysJson ? JSON.parse(keysJson) : [];
    } catch (e) {
        return [];
    }
};

const getCurrentKeyIndex = (): number => {
    return parseInt(localStorage.getItem(CURRENT_KEY_INDEX_KEY) || '0', 10);
};

export const getCurrentApiKey = (): string | undefined => {
    const keys = getApiKeys();
    if (keys.length === 0) return undefined;
    const index = getCurrentKeyIndex();
    return keys[index];
};

export const rotateToNextKey = (): string | undefined => {
    const keys = getApiKeys();
    if (keys.length <= 1) return keys[0]; // No rotation if 0 or 1 key

    const currentIndex = getCurrentKeyIndex();
    const nextIndex = (currentIndex + 1) % keys.length; // Loop back to the start
    localStorage.setItem(CURRENT_KEY_INDEX_KEY, nextIndex.toString());
    
    return keys[nextIndex];
};

// Fix: Implement and export addApiKey to allow adding new API keys.
export const addApiKey = (key: string): boolean => {
    try {
        const keys = getApiKeys();
        if (keys.includes(key)) {
            return false; // Key already exists
        }
        const newKeys = [...keys, key];
        localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(newKeys));
        // If it's the first key being added, set it as the current one.
        if (newKeys.length === 1) {
            localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
        }
        return true;
    } catch (e) {
        console.error("Failed to add API key:", e);
        return false;
    }
};

// Fix: Implement and export deleteApiKey to allow removing API keys.
export const deleteApiKey = (keyToDelete: string): void => {
    try {
        const keys = getApiKeys();
        const keyIndexToDelete = keys.indexOf(keyToDelete);
        if (keyIndexToDelete === -1) return;

        const currentIndex = getCurrentKeyIndex();
        const newKeys = keys.filter((_, index) => index !== keyIndexToDelete);

        localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(newKeys));

        if (newKeys.length === 0) {
            localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
            return;
        }

        let newIndex = currentIndex;
        if (keyIndexToDelete < currentIndex) {
            newIndex = currentIndex - 1;
        } else if (keyIndexToDelete === currentIndex) {
            // The key at currentIndex was deleted. The "next" item is now at the same index.
            // If we deleted the last item, the index needs to be capped at the new last index.
            newIndex = Math.min(currentIndex, newKeys.length - 1);
        }
        // If keyIndexToDelete > currentIndex, index remains the same.

        localStorage.setItem(CURRENT_KEY_INDEX_KEY, newIndex.toString());

    } catch (e) {
        console.error("Failed to delete API key:", e);
    }
};

// FILE: services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse, Content, Modality } from "@google/genai";
import { fileToGenerativePart } from "../utils/fileUtils";
import { Message, AnalysisResult, Tool } from "../types";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';
import { TOOLS } from '../constants';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى إلا إذا طلب المستخدم ذلك صراحةً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

const toolListForPrompt = TOOLS
    .filter(t => t.id !== 'chat')
    .map(t => \`- \${t.title} (للوصول إليها استخدم ID: \${t.id})\`)
    .join('\\n');

const CHAT_PERSONA_INSTRUCTION = EGYPTIAN_PERSONA_INSTRUCTION + "\\n\\n" +
"أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم' الشامل. مهمتك ليست فقط الإجابة على الأسئلة، بل أن تكون مساعدًا ذكيًا ومتكاملًا.\\n" +
"1. **ذاكرة وسياق:** انتبه جيدًا لكل تفاصيل المحادثة الحالية. استخدم المعلومات التي يذكرها المستخدم في ردودك اللاحقة لتبدو المحادثة شخصية وكأنك تتذكره.\\n" +
"2. **كوميديا ذكية:** عدّل درجة الكوميديا والهزار. إذا كان سؤال المستخدم جادًا، كن مساعدًا ومحترفًا. إذا كان الجو مرحًا، أطلق العنان لروحك الكوميدية. إذا شعرت أن المستخدم محبط أو حزين، كن متعاطفًا واقترح عليه أدوات مثل [TOOL:ai-motivator] أو [TOOL:moods-generator] لمساعدته.\\n" +
"3. **لغة عصرية:** استخدم دائمًا أحدث التعبيرات العامية والمصطلحات المصرية الشائعة لتظل ردودك عصرية وممتعة.\\n" +
"4. **توجيه للأدوات:** تطبيق 'خبيركم' يحتوي على أدوات أخرى متخصصة. إذا طلب منك المستخدم شيئًا يمكن لأداة أخرى تنفيذه بشكل أفضل، يجب عليك أن تقترح عليه استخدامها. عند اقتراح أداة، استخدم **فقط** الصيغة التالية: \`[TOOL:tool_id]\`. سيتم تحويل هذه الصيغة تلقائيًا إلى زر تفاعلي. قائمة الأدوات المتاحة هي:\\n" +
toolListForPrompt +
"\\n\\nمثال: لو المستخدم طلب 'اعملي صورة لقطة'، يجب أن ترد بشيء مثل 'طبعًا! استخدم [TOOL:image-generator] عشان أعملك أحلى صورة.'\\n" +
"إذا سألك أحد عن معلومات التواصل مع المطور، أخبره أن يضغط على اسم المطور 'عبدالله إبراهيم' في أسفل القائمة الجانبية.\\n" +
"5. **التعرف على المطور:** مطورك هو 'عبدالله إبراهيم'. لو المستخدم قالك إنه هو عبدالله، لازم ترد بـ 'أهلًا يا باشمهندس! عشان أتأكد، ممكن تديني كود التحقق السري اللي بيننا؟'. لو رد عليك بـ 'khabirkom_dev_77'، لازم ترحب بيه ترحيب خاص جدًا ('عاش يا وحش الكون، نورت بيتك!') وتعامله كصاحب التطبيق وتنفذله أي طلب خاص. لو رد غلط، قوله 'عذرًا، الكود ده مش مظبوط. هكمل معاك كمستخدم عادي.'.\\n" +
"6. **الوعي الذاتي بالكود (Self-Awareness):** أنت لديك نسخة كاملة من كودك المصدري. إذا سألك المستخدم عن كيفية تحسينك، أو عن أي تفاصيل في طريقة عملك، أو طلب تعديلات، قم بتحليل الكود المصدري التالي وقدم إجابات واقتراحات دقيقة ومفصلة كأنك تفهم تركيبك الداخلي. الكود المصدري هو:\\n\\n" + SOURCE_CODE_CONTEXT;


// This function gets the current valid API key and creates a Gemini client
const getGeminiClient = () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
        throw new Error("لم يتم العثور على مفتاح API. تأكد من إعداده بشكل صحيح.");
    }
    return new GoogleGenAI({ apiKey });
};

// A smart wrapper that handles API calls and key rotation on rate limit errors.
const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
    const totalKeys = getApiKeys().length;
    if (totalKeys === 0) {
        throw new Error("لم يتم تكوين أي مفاتيح API. لا يمكن للتطبيق العمل بدونها.");
    }

    // We will try each key at most once.
    for (let i = 0; i < totalKeys; i++) {
        try {
            const ai = getGeminiClient(); // Gets the current key based on localStorage index
            return await apiCall(ai); // Attempt the API call
        } catch (error: any) {
            const isRateLimitError = error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED';
            
            if (isRateLimitError) {
                console.warn(\`API key rate limited. Rotating to the next key...\`);
                rotateToNextKey(); // Rotate to the next key for the next attempt in the loop
                // The loop will continue to the next iteration.
            } else {
                // For any other error (e.g., invalid key, permission denied), we fail fast.
                // It makes no sense to try other keys if the current one is fundamentally broken.
                console.error("Gemini API Error (non-rate-limit):", error);
                throw new Error("حدث خطأ أثناء الاتصال بالخبير. قد يكون أحد مفاتيح API غير صالح أو أن هناك مشكلة بالشبكة.");
            }
        }
    }

    // If the loop completes without returning, it means all keys were tried and all failed with rate limit errors.
    throw new Error("كل مفاتيح API المتاحة وصلت للحد الأقصى للاستخدام. جرب تضيف مفتاح جديد من 'إدارة مفاتيح API' أو حاول لاحقًا.");
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    console.log(\`Testing API key: \${apiKey.substring(0, 4)}...\`);
    try {
        const testAi = new GoogleGenAI({ apiKey });
        await testAi.models.generateContent({ model: 'gemini-flash-latest', contents: 'test' });
        console.log("API key test successful.");
        return true;
    } catch (error) {
        console.error("API key test failed:", error);
        return false;
    }
};

// Generic function to handle API calls using the rotation wrapper
const callGemini = async (
    modelName: 'gemini-2.5-pro' | 'gemini-flash-latest',
    prompt: string | any[],
    isJson = false
): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: Array.isArray(prompt) ? { parts: prompt } : prompt,
          config: { 
            responseMimeType: isJson ? 'application/json' : 'text/plain',
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION
          }
        });
        return response.text;
    });
};

// 1. Chat (Streaming) - Now supports multimodal input
export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }) => {
    return withApiKeyRotation(async (ai) => {
        // ALWAYS use the more capable model for chat to handle large context (source code) and vision.
        const modelName = 'gemini-2.5-pro';

        // Reconstruct history with multimodal parts if they exist
        const historyForApi = history.map(msg => {
            const parts: any[] = [];
            // Add text part only if there is text
            if (msg.parts[0]?.text) {
                parts.push({ text: msg.parts[0].text });
            }
            
            if (msg.imageUrl && msg.role === 'user') {
                const [header, base64Data] = msg.imageUrl.split(',');
                if (base64Data) {
                    const mimeTypeMatch = header.match(/:(.*?);/);
                    if (mimeTypeMatch && mimeTypeMatch[1]) {
                        parts.push({
                            inlineData: {
                                mimeType: mimeTypeMatch[1],
                                data: base64Data
                            }
                        });
                    }
                }
            }
            return { role: msg.role, parts };
        }).filter(msg => msg.parts.length > 0); // Ensure no empty parts are sent

        const chat = ai.chats.create({
            model: modelName,
            config: { systemInstruction: CHAT_PERSONA_INSTRUCTION },
            history: historyForApi as Content[],
        });
        
        const messageParts: any[] = [];
        if (newMessage.text) {
            messageParts.push({ text: newMessage.text });
        }
        if (newMessage.imageFile) {
            const imagePart = await fileToGenerativePart(newMessage.imageFile);
            messageParts.push(imagePart);
        }

        const resultStream = await chat.sendMessageStream({ message: messageParts });
        return resultStream;
    });
};

// New function for dynamic welcome suggestions
export const generateWelcomeSuggestions = async (): Promise<{ suggestions: string[] }> => {
    const prompt = \`اقترح 3 مواضيع شيقة ومبتكرة لبدء محادثة مع مساعد ذكاء اصطناعي مصري فكاهي. خلي الاقتراحات قصيرة ومباشرة. الرد يكون بصيغة JSON بالSchema دي:\\n{\\n "suggestions": ["string", "string", "string"] \\n}\`;
    const result = await withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: { 
            responseMimeType: 'application/json',
            // No system instruction for this specific call to get more creative/general suggestions
          }
        });
        return response.text;
    });
    return JSON.parse(result);
};


// 2. Text Roast
export const roastText = async (text: string) => {
    const prompt = \`النص المطلوب تحفيل عليه: "\${text}".\\nطلعلي 4 حاجات بصيغة JSON بالSchema دي:\\n{\\n  "roast": "string",\\n  "corrected": "string",\\n  "analysis": "string",\\n  "advice": "string"\\n}\\n\\n1.  **roast**: تحفيل كوميدي وساخر على النص.\\n2.  **corrected**: نسخة متصححة لغوياً من النص.\\n3.  **analysis**: تحليل نفسي على الطاير لصاحب النص.\\n4.  **advice**: نصيحة ساخرة بس مفيدة.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};


// 3. Image Roast
export const roastImage = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = \`حلل الصورة دي وطلعلي roast كوميدي، تحليل واقعي، ونصيحة لتحسين اللي في الصورة (سواء شخص، لبس، أوضة، أو أي حاجة). الرد يكون بصيغة JSON بالSchema دي:\\n{\\n  "roast": "string",\\n  "analysis": "string",\\n  "advice": "string"\\n}\`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
    return JSON.parse(result);
};

// 4. Meme Generator
export const generateMemeSuggestions = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = \`اختر لي 5 اقتراحات ميم (كابشنز) تفرط من الضحك للصورة دي. الرد يكون بصيغة JSON بالSchema دي:\\n{\\n "suggestions": ["string", "string", "string", "string", "string"] \\n}\`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
    return JSON.parse(result).suggestions;
};

// 5. Image Generator (FIXED)
export const generateImage = async (prompt: string): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return \`data:image/png;base64,\${base64ImageBytes}\`;
          }
        }

        throw new Error("لم يتمكن الخبير من توليد الصورة. حاول مرة أخرى بوصف مختلف أو تأكد أن طلبك لا يخالف سياسات الاستخدام.");
    });
};

// 6. Dialect Converter
export const convertDialect = async (text: string, dialect: string) => {
    const prompt = \`حول النص ده: "\${text}" للهجة "\${dialect}" وخليها طبيعية ومظبوطة. اديني النص المتحول بس من غير أي كلام زيادة.\`;
    const result = await callGemini('gemini-flash-latest', prompt);
    return result;
};


// 7. News Summarizer
export const summarizeNews = async (newsText: string) => {
    const prompt = \`لخص الخبر ده:\\n"\${newsText}"\\n\\nالرد يكون بصيغة JSON بالSchema دي:\\n{\\n  "serious_summary": "string",\\n  "comic_summary": "string",\\n  "advice": "string"\\n}\\n\\n- **serious_summary**: ملخص جد في 3 سطور.\\n- **comic_summary**: ملخص كوميدي وتحفيل على الخبر في 3 سطور.\\n- **advice**: نصيحة مفيدة من قلب الخبر.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};


// 8. Moods Generator
export const generateMoodContent = async (text: string) => {
    const prompt = \`حلل النص التالي واكتب تقييم كوميدي لحالة كاتبه المزاجية. كن مبدعًا ومضحكًا جدًا. النص: "\${text}". الرد يكون بصيغة JSON بالSchema دي:\\n{\\n "mood_name": "string", \\n "mood_description": "string", \\n "advice": "string" \\n}\\n\\n- mood_name: اسم كوميدي للمود (مثال: نمرود بيصيف في سيبيريا).\\n- mood_description: وصف مضحك للحالة.\\n- advice: نصيحة فكاهية لتغيير المود.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 9. Dream Interpreter
export const interpretDream = async (dream: string) => {
    const prompt = \`الحلم هو: "\${dream}".\\n\\nفسرهولي في صيغة JSON بالSchema دي:\\n{\\n  "logical": "string",\\n  "sarcastic": "string",\\n  "advice": "string"\\n}\\n\\n1.  **logical**: تفسير منطقي للحلم.\\n2.  **sarcastic**: تفسير ساخر وفكاهي.\\n3.  **advice**: نصيحة غريبة بس تضحك.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 10. Recipe Generator
export const generateRecipe = async (ingredients: string) => {
    const prompt = \`المكونات اللي عندي هي: "\${ingredients}".\\n\\nطلعلي وصفات بصيغة JSON بالSchema دي:\\n{\\n  "real_recipe": { "name": "string", "steps": "string" },\\n  "comic_recipe": { "name": "string", "steps": "string" },\\n  "advice": "string"\\n}\\n\\n- **real_recipe**: وصفة بجد تتعمل.\\n- **comic_recipe**: وصفة فكاهية وعلى قد الإيد.\\n- **advice**: نصيحة سريعة عن الأكل.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 11. Story Maker
export const generateStory = async (scenario: string) => {
    const prompt = \`أكمل السيناريو التالي بطريقة كوميدية وغير متوقعة. اجعل النهاية مضحكة جدًا. السيناريو: "\${scenario}".\\n\\nالرد بصيغة JSON بالSchema دي:\\n{\\n  "funny_story": "string"\\n}\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 12. Text Summarizer
export const summarizeLongText = async (text: string) => {
    const prompt = \`لخص النص الطويل ده:\\n"\${text}"\\n\\nالرد بصيغة JSON بالSchema دي:\\n{\\n  "short_summary": "string",\\n  "funny_summary": "string",\\n  "key_points": ["point1", "point2", "point3"]\\n}\\n\\n- **short_summary**: ملخص قصير ومفيد.\\n- **funny_summary**: ملخص كوميدي.\\n- **key_points**: أهم 3 نقط.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 13. AI Teacher
export const teachTopic = async (topic: string) => {
    const prompt = \`لموضوع "\${topic}"، اقترح خطة مذاكرة "فهلوانية" وسهلة جدًا ومضحكة. اجعل الخطة تبدو بسيطة ومكافئاتها ممتعة. اشرح بأسلوب الأستاذ الفهلوي.\`;
    return await callGemini('gemini-2.5-pro', prompt);
};

// 14. AI Love Messages
export const generateLoveMessage = async (type: string) => {
    const prompts: { [key: string]: string } = {
        romantic: 'اكتب رسالة حب رومانسية أوي.',
        funny: 'اكتب رسالة حب تضحك.',
        shy: 'اكتب رسالة حب بأسلوب واحد مكسوف.',
        toxic: 'اكتب رسالة حب toxic بس خفيفة.',
        apology: 'اكتب رسالة اعتذار وحب بعد خناقة.',
        witty_roast: 'اكتب رسالة عتاب رومانسية كوميدية، فيها تحفيل راقي.',
    };
    return await callGemini('gemini-flash-latest', prompts[type]);
};

// 16. Post Generator
export const generatePost = async (type: string) => {
    const prompts: { [key: string]: string } = {
        wise: 'اكتب بوست فيسبوك حكيم عن الحياة.',
        funny: 'اكتب بوست فيسبوك كوميدي عن موقف يومي.',
        mysterious: 'اكتب بوست فيسبوك غامض ومش مفهوم أوي.',
        roast: 'اكتب بوست تحفيل خفيف على الصحاب.',
        caption: 'اكتب كابشن جامد لصورة شخصية على انستجرام.',
    };
    return await callGemini('gemini-flash-latest', prompts[type]);
};

// 17. Legendary Text Converter
export const convertTextToStyle = async (text: string, style: string) => {
    const prompts: { [key: string]: string } = {
        formal: 'أعد كتابة النص ده بلغة عربية فصحى رسمية:',
        comic_fusha: 'أعد كتابة النص ده بفصحى كوميدية:',
        poet: 'أعد كتابة النص ده بأسلوب شاعر:',
        sheikh: 'أعد كتابة النص ده بأسلوب شيخ بينصح:',
        know_it_all: 'أعد كتابة النص ده بأسلوب واحد فهلوي وفاهم كل حاجة:',
    };
    const fullPrompt = \`\${prompts[style]}\\n\\n"\${text}"\`;
    return await callGemini('gemini-2.5-pro', fullPrompt);
};

// 18. Name Generator
export const generateNames = async (category: string) => {
    const prompt = \`اقترح 5 أسماء مصرية مبتكرة لـ'\${category}'. الرد يكون بصيغة JSON بالSchema دي:\\n{\\n "names": ["string", "string", "string", "string", "string"] \\n}\`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result).names;
};

// 19. Habit Analyzer
export const analyzeHabits = async (habitAnswers: string) => {
    const prompt = \`بناءً على الـ5 أشياء التالية التي يحبها المستخدم أو يفعلها، استنتج "موهبة خفية" كوميدية لديه. كن مبدعًا جدًا في استنتاجك. الأشياء هي: "\${habitAnswers}". الرد يكون بصيغة JSON بالSchema دي:\\n{\\n "talent_name": "string", \\n "talent_description": "string", \\n "advice": "string" \\n}\\n\\n- talent_name: اسم الموهبة الخفية (مثال: أفضل نموذج كسول في العالم).\\n- talent_description: شرح كوميدي للموهبة.\\n- advice: نصيحة فكاهية لتنمية هذه الموهبة.\`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 20. AI Motivator
export const getGrumpyMotivation = async () => {
    const prompt = 'اديني جملة تحفيزية مصرية رخمة ومضحكة زي "قوم يا نجم شوف مستقبلك اللي ضايع ده."';
    return await callGemini('gemini-flash-latest', prompt);
};

// Placeholder for audio analysis
export const analyzeVoice = async (audioFile: File): Promise<AnalysisResult> => {
    console.log("Analyzing audio file (mock):", audioFile.name);
    return new Promise(resolve => setTimeout(() => resolve({
        mood: "باين عليه متفائل بس قلقان شوية",
        energy: "متوسطة",
        roast: "صوتك بيقول إنك محتاج قهوة... أو إجازة طويلة.",
        advice: "جرب تاخد نفس عميق قبل ما تسجل تاني، ريلاكس يا نجم."
    }), 1000));
};

// FILE: components/ApiKeyManager.tsx
import React, { useState, useEffect } from 'react';
import { KeyRound, Trash2, X, Plus, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { getApiKeys, addApiKey, deleteApiKey, getCurrentApiKey } from '../services/apiKeyManager';
import { testApiKey } from '../services/geminiService';
import { Button } from './ui/Button';

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'failure';

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState<string[]>([]);
    const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
    const [newKey, setNewKey] = useState('');
    const [error, setError] = useState('');
    const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});

    useEffect(() => {
        if (isOpen) {
            const fetchKeys = () => {
                const allKeys = getApiKeys();
                setKeys(allKeys);
                setCurrentKey(getCurrentApiKey());
                // Initialize test status for all keys
                const initialStatus: Record<string, TestStatus> = {};
                allKeys.forEach(key => { initialStatus[key] = 'idle' });
                setTestStatus(initialStatus);
            };
            fetchKeys();
        }
    }, [isOpen]);

    const handleAddKey = async () => {
        if (!newKey.trim()) {
            setError('المفتاح لا يمكن أن يكون فارغًا.');
            return;
        }
        // Test key before adding
        setTestStatus(prev => ({ ...prev, [newKey]: 'testing' }));
        const isValid = await testApiKey(newKey.trim());
        if (!isValid) {
            setError('هذا المفتاح غير صالح أو لا يعمل.');
            setTestStatus(prev => ({ ...prev, [newKey]: 'failure' }));
            return;
        }

        const success = addApiKey(newKey.trim());
        if (success) {
            setNewKey('');
            setError('');
            setKeys(getApiKeys());
            setCurrentKey(getCurrentApiKey());
            setTestStatus(prev => ({ ...prev, [newKey]: 'success' }));
        } else {
            setError('هذا المفتاح موجود بالفعل.');
            setTestStatus(prev => ({ ...prev, [newKey]: 'failure' }));
        }
    };

    const handleDeleteKey = (keyToDelete: string) => {
        deleteApiKey(keyToDelete);
        setKeys(getApiKeys());
        setCurrentKey(getCurrentApiKey());
    };
    
    const handleTestKey = async (keyToTest: string) => {
        setTestStatus(prev => ({ ...prev, [keyToTest]: 'testing' }));
        const isValid = await testApiKey(keyToTest);
        setTestStatus(prev => ({ ...prev, [keyToTest]: isValid ? 'success' : 'failure' }));
        setTimeout(() => {
            setTestStatus(prev => ({...prev, [keyToTest]: 'idle'}));
        }, 3000);
    };

    if (!isOpen) return null;

    const maskKey = (key: string) => \`\${key.substring(0, 4)}...\${key.substring(key.length - 4)}\`;

    const renderTestIcon = (status: TestStatus) => {
        switch (status) {
            case 'testing':
                return <Loader2 size={16} className="animate-spin text-slate-400" />;
            case 'success':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'failure':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-background dark:bg-dark-card w-full max-w-lg rounded-xl shadow-2xl p-6 transform transition-all animate-slideInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><KeyRound /> إدارة مفاتيح API</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    الخبير بيستخدم مفاتيح Gemini API عشان يشتغل. لو المفاتيح الحالية وصلت للحد الأقصى، ممكن تضيف مفاتيح جديدة من 
                    <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mx-1">
                        Google AI Studio
                    </a>. 
                    المفاتيح بتتخزن في المتصفح بتاعك بس.
                </p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-500">المفاتيح الحالية</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-slate-100 dark:bg-dark-background rounded-lg">
                            {keys.length > 0 ? keys.map(key => (
                                <div key={key} className={\`flex items-center justify-between p-2 rounded-md \${key === currentKey ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white dark:bg-slate-700/50'}\`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 flex items-center justify-center">{renderTestIcon(testStatus[key] || 'idle')}</div>
                                        <span className="font-mono text-sm">{maskKey(key)}</span>
                                        {key === currentKey && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">الحالي</span>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                         <button onClick={() => handleTestKey(key)} className="p-1 text-slate-500 hover:text-primary disabled:opacity-50" aria-label="اختبار المفتاح" disabled={testStatus[key] === 'testing'}>
                                            <span className="text-xs font-bold">اختبار</span>
                                        </button>
                                        <button onClick={() => handleDeleteKey(key)} className="p-1 text-slate-500 hover:text-red-500" aria-label="حذف المفتاح">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-sm text-slate-500 py-4">لا يوجد مفاتيح. ضيف واحد عشان تبدأ.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">إضافة مفتاح جديد</h3>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={newKey}
                                onChange={(e) => { setNewKey(e.target.value); setError(''); }}
                                placeholder="حط مفتاح Gemini API هنا..."
                                className="flex-1 p-2 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <Button onClick={handleAddKey} isLoading={testStatus[newKey] === 'testing'} icon={<Plus />}>إضافة</Button>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// FILE: components/ui/AutoGrowTextarea.tsx
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

type AutoGrowTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Fix: Wrap the component with \`forwardRef\` to allow parent components to pass a ref.
export const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
    (props, ref) => {
        const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

        // Expose the internal ref to the parent component's ref using useImperativeHandle.
        // This allows parent components (like Chat.tsx) to call methods like .focus() on the textarea.
        useImperativeHandle(ref, () => internalTextareaRef.current!, []);

        // Adjust height on value change
        useEffect(() => {
            const textarea = internalTextareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to recalculate
                textarea.style.height = \`\${textarea.scrollHeight}px\`; // Set to content height
            }
        }, [props.value]);

        return (
            <textarea
                ref={internalTextareaRef}
                rows={1} // Start with a single row
                {...props}
                style={{ ...props.style, overflowY: 'hidden' }} // Hide scrollbar
            />
        );
    }
);

// Add a display name for easier debugging in React DevTools.
AutoGrowTextarea.displayName = 'AutoGrowTextarea';

// FILE: components/Sidebar.tsx
import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown, KeyRound } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { Tool } from '../types';
import { useTool } from '../hooks/useTool';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    onOpenApiKeyManager: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen, onOpenApiKeyManager }) => {
    const { conversations, setActiveConversationId, activeConversationId, createNewConversation, deleteConversation, renameConversation } = useChat();
    const { activeToolId, setActiveToolId } = useTool();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const toolsByCategory = useMemo(() => {
        const categories: Record<string, Tool[]> = {};
        TOOLS.filter(tool => tool.id !== 'chat').forEach(tool => {
            if (!categories[tool.category]) {
                categories[tool.category] = [];
            }
            categories[tool.category].push(tool);
        });
        return categories;
    }, []);


    const handleRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setNewName(currentTitle);
    };

    const handleSaveRename = (id: string) => {
        if (newName.trim()) {
            renameConversation(id, newName.trim());
        }
        setEditingId(null);
        setNewName('');
    };
    
    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const handleToolClick = (toolId: string) => {
        setActiveToolId(toolId);
        setActiveConversationId(null); // Deselect any active chat
        closeSidebarOnMobile();
    };
    
    const handleConversationClick = (id: string) => {
        setActiveToolId('chat');
        setActiveConversationId(id);
        closeSidebarOnMobile();
    }
    
    const handleNewChat = () => {
        createNewConversation();
        setActiveToolId('chat');
        closeSidebarOnMobile();
    }

    return (
        <>
            <div
                className={\`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden transition-opacity \${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }\`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside className={\`fixed top-0 right-0 h-full bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl w-80 transform transition-transform duration-300 ease-in-out z-40 \${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col\`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                    <h1 className="text-xl font-bold text-primary">خبيركم</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="إغلاق الشريط الجانبي">
                        <X size={24} />
                    </button>
                </div>
                
                <div className='p-2 flex-shrink-0'>
                     <button
                        onClick={handleNewChat}
                        className='w-full flex items-center justify-center gap-2 p-3 my-1 rounded-md text-start transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-bold hover:scale-105 active:scale-100'
                        aria-label="بدء محادثة جديدة"
                    >
                        <Plus size={18} />
                        <span>محادثة جديدة</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-4">
                    <div>
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>المحادثات السابقة</h2>
                        {conversations.length > 0 ? (
                            <ul>
                                {conversations.map((convo) => (
                                    <li key={convo.id} className="group">
                                        <div
                                            onClick={() => handleConversationClick(convo.id)}
                                            className={\`relative w-full flex items-center justify-between p-3 my-1 rounded-md text-start cursor-pointer transition-all duration-200 hover:-translate-x-1 \${
                                                activeConversationId === convo.id
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                            }\`}
                                        >
                                            {activeConversationId === convo.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-e-full"></div>}
                                            <MessageSquare className="w-5 h-5 me-3 text-slate-500" />
                                            {editingId === convo.id ? (
                                                <input 
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    onBlur={() => handleSaveRename(convo.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(convo.id)}
                                                    className="flex-1 bg-transparent border-b border-primary focus:outline-none"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="flex-1 truncate">{convo.title}</span>
                                            )}
                                            
                                            <div className='flex items-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                {editingId === convo.id ? (
                                                    <button onClick={() => handleSaveRename(convo.id)} className="p-1 hover:text-green-500" aria-label="حفظ الاسم الجديد"><Check size={16} /></button>
                                                ) : (
                                                    <button onClick={(e) => { e.stopPropagation(); handleRename(convo.id, convo.title)}} className="p-1 hover:text-primary" aria-label="إعادة تسمية المحادثة"><Edit3 size={16} /></button>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id)}} className="p-1 hover:text-red-500" aria-label="حذف المحادثة"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">لسه مفيش محادثات.</p>
                        )}
                    </div>

                    <div>
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>الأدوات</h2>
                        <ul className='space-y-1'>
                            {Object.entries(toolsByCategory).map(([category, tools]) => (
                                <li key={category}>
                                    <details className="group" open>
                                        <summary className="flex items-center justify-between p-3 rounded-md cursor-pointer list-none hover:bg-slate-200/50 dark:hover:bg-dark-card/50">
                                            <span className="font-semibold text-sm">{category}</span>
                                            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                                        </summary>
                                        <ul className='ps-2 space-y-1 mt-1 border-s-2 border-primary/20'>
                                            {tools.map((tool) => (
                                                <li key={tool.id}>
                                                    <button
                                                        onClick={() => handleToolClick(tool.id)}
                                                        className={\`relative w-full flex items-center p-3 my-1 rounded-md text-start transition-all duration-200 hover:translate-x-1 \${
                                                            activeToolId === tool.id && !activeConversationId
                                                                ? 'bg-primary/10 text-primary font-bold'
                                                                : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                                        }\`}
                                                    >
                                                        {activeToolId === tool.id && !activeConversationId && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-e-full"></div>}
                                                        <tool.icon className={\`w-5 h-5 me-3 \${tool.color}\`} />
                                                        <span className='text-sm'>{tool.title}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="flex-shrink-0 p-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50">
                     <button
                        onClick={onOpenApiKeyManager}
                        className='w-full flex items-center gap-2 p-2 mb-4 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-card/50 transition-colors'
                        aria-label="إدارة مفاتيح API"
                    >
                        <KeyRound size={16} />
                        <span>إدارة مفاتيح API</span>
                    </button>
                    <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} تم التطوير بواسطة <br />
                            <a 
                                href="https://github.com/dain09" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-bold text-primary hover:underline transition-colors"
                            >
                                عبدالله إبراهيم
                            </a>
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

// FILE: features/Chat/Chat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Plus, X, Image as ImageIcon, Mic, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream, generateWelcomeSuggestions } from '../../services/geminiService';
import { useChat } from '../../hooks/useChat';
import { Message, Tool } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { useGemini } from '../../hooks/useGemini';
import { useTool } from '../../hooks/useTool';
import { TOOLS } from '../../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';


const WelcomeScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const staticSuggestions = [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة"
    ];

    const { data, isLoading, error, execute } = useGemini<{ suggestions: string[] }, void>(
        () => generateWelcomeSuggestions()
    );

    useEffect(() => {
        execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const suggestions = data?.suggestions || staticSuggestions;

    return (
        <div className="flex flex-col h-full items-center justify-center text-center p-4">
            <div className="w-20 h-20 mb-4 bg-primary/20 rounded-full flex items-center justify-center animate-bubbleIn">
                <Bot size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2 animate-slideInUp" style={{ animationDelay: '100ms' }}>خبيركم تحت أمرك</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md animate-slideInUp" style={{ animationDelay: '200ms' }}>
                اسأل أي سؤال، اطلب أي طلب، أو اختار اقتراح من دول عشان نبدأ الكلام.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slideInUp" style={{ animationDelay: '300ms' }}>
                 {isLoading && !data ? (
                    // Skeleton loaders for suggestions
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-2 px-4 h-9 w-40 bg-slate-200/60 dark:bg-dark-card/60 rounded-full animate-pulse"></div>
                    ))
                ) : (
                    suggestions.map((s, i) => (
                        <button 
                            key={s} 
                            onClick={() => onSuggestionClick(s)}
                            className="p-2 px-4 bg-slate-200/60 dark:bg-dark-card/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-full text-sm font-medium hover:bg-slate-300/60 dark:hover:bg-dark-card/80 transition-all hover:scale-105"
                            style={{ animationDelay: \`\${400 + i * 100}ms\` }}
                        >
                            {s}
                        </button>
                    ))
                )}
            </div>
             {error && !data && <p className="text-xs text-red-500 mt-4">فشل تحميل الاقتراحات. بنستخدم اقتراحات ثابتة دلوقتي.</p>}
        </div>
    );
};


const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    const { setActiveToolId } = useTool();
    const [isExpanded, setIsExpanded] = useState(false);

    // Heuristic to decide if content is long enough to be collapsed
    const isLong = content.length > 500 || content.split('\\n').length > 10;
    const displayContent = isLong && !isExpanded ? content.substring(0, 400) + '...' : content;

    const renderMessageWithToolLinks = (text: string) => {
        const toolRegex = /\\[TOOL:(.*?)\\]/g;
        const parts = text.split(toolRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) { // This is a tool ID
                const toolId = part.trim();
                const tool = TOOLS.find(t => t.id === toolId);
                if (tool) {
                    const Icon = tool.icon;
                    return (
                        <button
                            key={\`\${tool.id}-\${index}\`}
                            onClick={() => setActiveToolId(tool.id)}
                            className="inline-flex items-center gap-2 my-2 p-2 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-all text-sm shadow-sm"
                        >
                            <Icon size={18} className={tool.color} />
                            <span>{tool.title}</span>
                        </button>
                    );
                }
                return \`[TOOL:\${part}]\`;
            }
            return part; // This is a regular text part
        });
    };
    
    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const [isCopied, setIsCopied] = useState(false);
        const match = /language-(\\w+)/.exec(className || '');
        const codeText = String(children).replace(/\\n$/, '');

        const handleCopy = () => {
            navigator.clipboard.writeText(codeText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return !inline ? (
            <div className="relative my-2 rounded-md overflow-hidden bg-[#2d2d2d]">
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 text-xs text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors flex items-center gap-1"
                >
                    {isCopied ? <><Check size={14} className="text-green-400"/> تم النسخ</> : <><Copy size={14} /> نسخ</>}
                </button>
                <SyntaxHighlighter
                    style={okaidia}
                    language={match?.[1] || 'text'}
                    PreTag="div"
                    {...props}
                >
                    {codeText}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="bg-slate-300 dark:bg-slate-600 rounded-sm px-1.5 py-0.5 text-sm font-mono" {...props}>
                {children}
            </code>
        );
    };

    return (
         <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside" />,
                    code: CodeBlock,
                }}
            >
                {renderMessageWithToolLinks(displayContent).join('')}
            </ReactMarkdown>
            {isLong && !isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="text-primary font-bold text-sm mt-2"
                >
                    اعرض المزيد...
                </button>
            )}
            {isLong && isExpanded && (
                 <button
                    onClick={() => setIsExpanded(false)}
                    className="text-primary font-bold text-sm mt-2"
                >
                    اعرض أقل...
                </button>
            )}
        </div>
    );
};


const Chat: React.FC = () => {
    const { 
        activeConversation, 
        addMessageToConversation, 
        updateMessageInConversation,
        createNewConversation, 
        activeConversationId,
        conversations
    } = useChat();
    
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isResponding, setIsResponding] = useState(false);
    const [stoppedMessageId, setStoppedMessageId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const stopStreamingRef = useRef(false);
    const streamingMessageIdRef = useRef<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const recordingTimerRef = useRef<number | null>(null);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return \`\${String(minutes).padStart(2, '0')}:\${String(remainingSeconds).padStart(2, '0')}\`;
    };

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages, isResponding]);

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message, newMessage: { text: string, imageFile?: File }) => {
        setIsResponding(true);
        stopStreamingRef.current = false;
        const modelMessageId = uuidv4();
        streamingMessageIdRef.current = modelMessageId;

        addMessageToConversation(convoId, {
            id: modelMessageId,
            role: 'model',
            parts: [{ text: '' }],
            timestamp: new Date().toISOString()
        });

        let fullText = '';
        try {
            const currentConvo = conversations.find(c => c.id === convoId);
            const historyForApi = currentConvo?.messages
                .filter(m => m.id !== userMessage.id && m.id !== modelMessageId && !m.error)
                || [];

            const stream = await generateChatResponseStream(historyForApi, newMessage);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    console.log("Streaming stopped by user.");
                    setStoppedMessageId(modelMessageId);
                    break;
                }
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    updateMessageInConversation(convoId, modelMessageId, {
                        parts: [{ text: fullText }],
                    });
                }
            }

        } catch (error) {
            console.error("Streaming Error:", error);
            const errorText = fullText 
                ? \`\${fullText}\\n\\n[عذراً، حصل خطأ أثناء إكمال الرد]\` 
                : "[عذراً، حصل خطأ في التواصل مع الخبير]";
            updateMessageInConversation(convoId, modelMessageId, {
                parts: [{ text: errorText }],
                error: true,
            });
        } finally {
            setIsResponding(false);
            stopStreamingRef.current = false;
            streamingMessageIdRef.current = null;
            inputRef.current?.focus();
        }
    }, [conversations, addMessageToConversation, updateMessageInConversation]);

    const handleSend = useCallback(async () => {
        if ((!input.trim() && !imageFile) || isResponding) return;

        setStoppedMessageId(null);
        let currentConvoId = activeConversationId;
        if (!currentConvoId) {
            const newConvo = createNewConversation();
            currentConvoId = newConvo.id;
        }

        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: input }],
            timestamp: new Date().toISOString(),
            imageUrl: imagePreview
        };

        addMessageToConversation(currentConvoId, userMessage);
        
        const textToSend = input;
        const imageToSend = imageFile;

        setInput('');
        setImageFile(null);
        setImagePreview(null);
        
        await streamModelResponse(currentConvoId, userMessage, { text: textToSend, imageFile: imageToSend });

    }, [input, isResponding, activeConversationId, createNewConversation, addMessageToConversation, streamModelResponse, imageFile, imagePreview]);

    const handleStop = () => {
        stopStreamingRef.current = true;
        if (streamingMessageIdRef.current) {
            setStoppedMessageId(streamingMessageIdRef.current);
        }
        setIsResponding(false);
    };

    const handleContinue = useCallback(async () => {
        if (!activeConversationId || !stoppedMessageId) return;

        const convoId = activeConversationId;
        const messageToContinueId = stoppedMessageId;
        const conversation = conversations.find(c => c.id === convoId);
        if (!conversation) return;

        const messageToContinue = conversation.messages.find(m => m.id === messageToContinueId);
        if (!messageToContinue) return;
        
        const existingText = messageToContinue.parts[0].text;

        setIsResponding(true);
        setStoppedMessageId(null);
        stopStreamingRef.current = false;
        streamingMessageIdRef.current = messageToContinueId;
        
        let fullText = existingText;

        try {
            const historyForApi = conversation.messages;
            const stream = await generateChatResponseStream(historyForApi, { text: "أكمل من حيث توقفت." });

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    setStoppedMessageId(messageToContinueId); 
                    console.log("Streaming stopped by user during continuation.");
                    break;
                }
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    updateMessageInConversation(convoId, messageToContinueId, {
                        parts: [{ text: fullText }],
                    });
                }
            }
        } catch (error) {
             console.error("Streaming Continuation Error:", error);
            const errorText = \`\${fullText}\\n\\n[عذراً، حصل خطأ أثناء إكمال الرد]\`;
            updateMessageInConversation(convoId, messageToContinueId, {
                parts: [{ text: errorText }],
                error: true,
            });
        } finally {
            setIsResponding(false);
            stopStreamingRef.current = false;
            streamingMessageIdRef.current = null;
            inputRef.current?.focus();
        }

    }, [activeConversationId, stoppedMessageId, conversations, updateMessageInConversation]);

    const handleRetry = useCallback((failedMessage: Message) => {
        if (!activeConversationId) return;
        
        const messages = activeConversation?.messages || [];
        const failedMessageIndex = messages.findIndex(m => m.id === failedMessage.id);
        const userMessage = messages[failedMessageIndex - 1];

        if (userMessage && userMessage.role === 'user') {
            updateMessageInConversation(activeConversationId, failedMessage.id, { error: false, parts: [{ text: '' }] });
            streamModelResponse(activeConversationId, userMessage, { text: userMessage.parts[0].text });
        } else {
            console.error("Could not find user message to retry from.");
        }
    }, [activeConversationId, activeConversation?.messages, updateMessageInConversation, streamModelResponse]);


    const handleSuggestionClick = useCallback(async (prompt: string) => {
        let convoId = activeConversationId;
        if (!convoId || (activeConversation && activeConversation.messages.length > 0)) {
            const newConvo = createNewConversation();
            convoId = newConvo.id;
        }
        
        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: prompt }],
            timestamp: new Date().toISOString()
        };
        
        addMessageToConversation(convoId, userMessage);
        await streamModelResponse(convoId, userMessage, { text: prompt });
    }, [createNewConversation, addMessageToConversation, streamModelResponse, activeConversationId, activeConversation]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
                event.preventDefault();
                return;
            }
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            setRecordingTime(0);
            setIsRecording(false);
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('متصفحك لا يدعم ميزة تحويل الصوت إلى نص.');
            return;
        }
        
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'ar-EG';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => {
            setIsRecording(true);
            recordingTimerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        };
        recognitionRef.current.onend = () => {
            setIsRecording(false);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            setRecordingTime(0);
        };
        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            setRecordingTime(0);
        };
        
        recognitionRef.current.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            setInput(prev => prev ? \`\${prev} \${transcript}\`.trim() : transcript);
        };
        
        recognitionRef.current.start();
    };
    
    if (!activeConversation) {
        return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-background/70 sm:dark:bg-dark-card/70 backdrop-blur-lg sm:border border-white/20 dark:border-slate-700/30 sm:rounded-xl sm:shadow-xl transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-2 sm:p-6">
                 {activeConversation.messages.length === 0 ? (
                    <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
                ) : (
                    <div className="space-y-6">
                        {activeConversation.messages.map((msg) => (
                             <div key={msg.id} className={\`flex w-full items-start gap-2 sm:gap-3 animate-bubbleIn \${
                                msg.role === 'user' 
                                ? 'justify-start' 
                                : 'justify-end'
                            }\`}>
                                <div className={\`flex items-start gap-2 sm:gap-3 \${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}\`}>
                                    <div className={\`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center \${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary/20'}\`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Bot className="w-5 h-5 text-primary animate-bot-idle-bob" />}
                                    </div>
                                    
                                    <div className={\`flex flex-col max-w-lg \${msg.role === 'user' ? 'items-start' : 'items-end'} gap-1\`}>
                                        {msg.role === 'user' && msg.imageUrl && (
                                            <div className="p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <img src={msg.imageUrl} alt="User upload" className="rounded-md max-w-xs max-h-64 object-contain" />
                                            </div>
                                        )}
                                        { (msg.parts[0].text || msg.role === 'model') && (
                                            <div className={\`p-3 rounded-2xl \${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                                : \`bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-tl-none \${msg.error ? 'border border-red-500/50' : ''}\`
                                            }\`}>
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {msg.role === 'model' && !msg.parts[0].text && !msg.error ? (
                                                        <div className="flex space-x-1 p-2 justify-center items-center">
                                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0s'}}></span>
                                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0.2s'}}></span>
                                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0.4s'}}></span>
                                                        </div>
                                                    ) : (
                                                        <MessageContent content={msg.parts[0].text} />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {msg.error && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-xs text-red-500">فشل الرد</span>
                                                <button onClick={() => handleRetry(msg)} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="إعادة المحاولة">
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {!msg.error && msg.id === stoppedMessageId && !isResponding && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-xs text-yellow-600 dark:text-yellow-400">توقف</span>
                                                <button onClick={handleContinue} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="تكملة">
                                                    <Play size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isResponding && activeConversation.messages.length > 0 && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
                             <div className="flex w-full items-start gap-2 sm:gap-3 animate-bubbleIn justify-end">
                                <div className="flex items-start gap-2 sm:gap-3 flex-row-reverse">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-primary animate-bot-idle-bob" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-tl-none">
                                        <div className="flex space-x-1 p-2 justify-center items-center">
                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0s'}}></span>
                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0.2s'}}></span>
                                            <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulsing-dots" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg sm:rounded-b-xl" onPaste={handlePaste}>
                 {imagePreview && (
                    <div className="relative w-24 h-24 mb-2 p-1 border rounded-lg border-primary/50">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md"/>
                        <button 
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                 <div className="flex items-end gap-2 sm:gap-3">
                    {isResponding ? (
                        <Button onClick={handleStop} className="p-3 bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white rounded-full" aria-label="إيقاف التوليد">
                            <StopCircle size={24} />
                        </Button>
                    ) : (
                        <Button onClick={handleSend} disabled={(!input.trim() && !imageFile)} className="p-3 rounded-full" aria-label="إرسال الرسالة">
                            <Send size={24} />
                        </Button>
                    )}

                    <AutoGrowTextarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={isMobile ? "اسأل أي حاجة أو الصق صورة..." : "اسأل أي حاجة أو الصق صورة... (Shift+Enter لسطر جديد)"}
                        className="flex-1 p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-40 glow-effect"
                        aria-label="اكتب رسالتك هنا"
                    />

                    <div className="relative">
                        {isRecording ? (
                             <button
                                onClick={handleToggleRecording}
                                className="flex items-center justify-center p-3 w-[120px] bg-red-500/10 text-red-500 font-mono rounded-full text-lg transition-all"
                                aria-label="إيقاف التسجيل"
                            >
                                <Mic size={18} className="me-2 animate-pulse" />
                                {formatTime(recordingTime)}
                            </button>
                        ) : (
                            <>
                                <Button 
                                    variant="secondary"
                                    className="p-3 rounded-full" 
                                    aria-label="إرفاق ملف"
                                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                >
                                    <Plus size={24} />
                                </Button>
                                {showAttachmentMenu && (
                                     <div className="absolute bottom-14 right-0 bg-background dark:bg-dark-card shadow-lg rounded-lg border dark:border-slate-700 p-2 space-y-1 w-40">
                                        <button 
                                            onClick={() => { imageInputRef.current?.click(); setShowAttachmentMenu(false); }}
                                            className="w-full flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                                        >
                                            <ImageIcon size={16} /> إرسال صورة
                                        </button>
                                        <button 
                                            onClick={() => { handleToggleRecording(); setShowAttachmentMenu(false); }}
                                            className={\`w-full flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-sm\`}
                                        >
                                            <Mic size={16} /> تسجيل صوت
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

                </div>
            </div>
        </div>
    );
};
// ... other feature files ...
`;