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
          "uuid": "https://aistudiocdn.com/uuid@^13.0.0"
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
              botThinking: {
                '0%, 100%': { transform: 'rotate(-3deg) scale(1.05)' },
                '50%': { transform: 'rotate(3deg) scale(1.05)' },
              },
              botIdleBob: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-2px)' },
              }
            },
            animation: {
              slideInUp: 'slideInUp 0.5s ease-out forwards',
              gradient: 'gradientAnimation 15s ease infinite',
              bubbleIn: 'bubbleIn 0.3s ease-out forwards',
              'bot-thinking': 'botThinking 1s ease-in-out infinite',
              'bot-idle-bob': 'botIdleBob 3s ease-in-out infinite',
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
import React, { useMemo, Suspense, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TOOLS } from './constants';
import { Tool } from './types';
import { useTheme } from './hooks/useTheme';
import { Loader } from './components/ui/Loader';
import { initializeApiKeys } from './services/apiKeyManager';
import { useTool } from './hooks/useTool';

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
    const { activeToolId, setActiveToolId } = useTool();
    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
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
    throw new Error("كل مفاتيح API المتاحة وصلت للحد الأقصى للاستخدام. برجاء المحاولة لاحقًا.");
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
import { KeyRound, Trash2, X, Plus } from 'lucide-react';
import { getApiKeys, addApiKey, deleteApiKey, getCurrentApiKey } from '../services/apiKeyManager';
import { Button } from './ui/Button';

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState<string[]>([]);
    const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
    const [newKey, setNewKey] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchKeys = () => {
                setKeys(getApiKeys());
                setCurrentKey(getCurrentApiKey());
            };
            fetchKeys();
        }
    }, [isOpen]);

    const handleAddKey = () => {
        if (!newKey.trim()) {
            setError('المفتاح لا يمكن أن يكون فارغًا.');
            return;
        }
        const success = addApiKey(newKey.trim());
        if (success) {
            setNewKey('');
            setError('');
            setKeys(getApiKeys());
            setCurrentKey(getCurrentApiKey());
        } else {
            setError('هذا المفتاح موجود بالفعل.');
        }
    };

    const handleDeleteKey = (keyToDelete: string) => {
        deleteApiKey(keyToDelete);
        setKeys(getApiKeys());
        setCurrentKey(getCurrentApiKey());
    };

    if (!isOpen) return null;

    const maskKey = (key: string) => \`\${key.substring(0, 4)}...\${key.substring(key.length - 4)}\`;

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
                                    <span className="font-mono text-sm">{maskKey(key)}</span>
                                    {key === currentKey && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">الحالي</span>}
                                    <button onClick={() => handleDeleteKey(key)} className="p-1 text-slate-500 hover:text-red-500" aria-label="حذف المفتاح">
                                        <Trash2 size={16}/>
                                    </button>
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
                            <Button onClick={handleAddKey} icon={<Plus />}>إضافة</Button>
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

// FILE: features/Chat/Chat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Plus, X, Image as ImageIcon, Mic } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream, generateWelcomeSuggestions } from '../../services/geminiService';
import { useChat } from '../../hooks/useChat';
import { Message, Tool } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { useGemini } from '../../hooks/useGemini';
import { useTool } from '../../hooks/useTool';
import { TOOLS } from '../../constants';

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

const Chat: React.FC = () => {
    const { 
        activeConversation, 
        addMessageToConversation, 
        updateMessageInConversation,
        createNewConversation, 
        activeConversationId,
        conversations
    } = useChat();
    const { setActiveToolId } = useTool();
    
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
            // Send the entire history including the partial message for context
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
            let imageFile: File | undefined = undefined;
            if (userMessage.imageUrl) {
                console.warn("Retrying with images from data URL might have limitations.");
            }
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
    
    const renderMessageWithToolLinks = (text: string) => {
        const toolRegex = /\\[TOOL:(.*?)\\]/g;
        const parts = text.split(toolRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) {
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
            return <span key={index}>{part}</span>;
        });
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
                                        <div className={\`p-3 rounded-2xl \${
                                            msg.role === 'user' 
                                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                            : \`bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-tl-none \${msg.error ? 'border border-red-500/50' : ''}\`
                                        }\`}>
                                            <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                                                {msg.role === 'model' ? renderMessageWithToolLinks(msg.parts[0].text || ' ') : msg.parts[0].text}
                                            </div>
                                        </div>
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
                        {isResponding && activeConversation.messages[activeConversation.messages.length - 1]?.role !== 'model' && (
                             <div className="flex items-end gap-3 animate-bubbleIn justify-end">
                                <div className={\`flex items-start gap-2 sm:gap-3 flex-row-reverse\`}>
                                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-tl-none">
                                        <div className="flex items-center justify-center p-2">
                                            <Bot className="w-6 h-6 text-primary animate-bot-thinking" />
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

export default Chat;

// FILE: features/TextRoast/TextRoast.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { roastText } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface RoastResult {
    roast: string;
    corrected: string;
    analysis: string;
    advice: string;
}

const TextRoast: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'text-roast')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<RoastResult, string>(roastText);

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي حاجة تيجي في بالك، والخبير هيحللها لك بطريقته الخاصة: تحفيل، تصحيح، وشوية نصايح على الماشي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب الجملة اللي عايز تحفّل عليها هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    ابعت
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="التحفيل 🔥">{result?.roast}</ResultCard>
                    <ResultCard title="التصحيح اللغوي 🤓">{result?.corrected}</ResultCard>
                    <ResultCard title="تحليل نفسي على الماشي 🤔">{result?.analysis}</ResultCard>
                    <ResultCard title="نصيحة الخبير 💡">{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default TextRoast;

// FILE: features/ImageRoast/ImageRoast.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { roastImage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface RoastResult {
    roast: string;
    analysis: string;
    advice: string;
}

const ImageRoast: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-roast')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { data: result, isLoading, error, execute } = useGemini<RoastResult, File>(roastImage);

    const handleSubmit = () => {
        if (!imageFile) return;
        execute(imageFile);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع أي صورة، سواء كانت صورتك، أوضتك، أو لبسك، وشوف الخبير هيقول عليها إيه. جهز نفسك لرأي صريح يضحك."
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={setImageFile} />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                    حلل الصورة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="التحفيل على الصورة 📸🔥">{result?.roast}</ResultCard>
                    <ResultCard title="تحليل واقعي 🧐">{result?.analysis}</ResultCard>
                    <ResultCard title="نصيحة للتطوير ✨">{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default ImageRoast;

// FILE: features/MemeGenerator/MemeGenerator.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMemeSuggestions } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Download } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const MemeGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'meme-generator')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedCaption, setSelectedCaption] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { data: suggestions, isLoading, error, execute } = useGemini<string[], File>(generateMemeSuggestions);

    const handleSubmit = async () => {
        if (!imageFile) return;
        setSelectedCaption('');
        const response = await execute(imageFile);
        if (response && response.length > 0) {
            setSelectedCaption(response[0]);
        }
    };
    
    const drawMeme = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !imageFile) return;

        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (!selectedCaption) return;

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = Math.max(2, canvas.width / 250);
            
            let fontSize = Math.max(30, canvas.width / 18);
            ctx.font = \`bold \${fontSize}px 'Tajawal', sans-serif\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const words = selectedCaption.split(' ');
            let line = '';
            let y = 15;
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > canvas.width - 40 && n > 0) {
                    ctx.strokeText(line.trim(), canvas.width / 2, y);
                    ctx.fillText(line.trim(), canvas.width / 2, y);
                    line = words[n] + ' ';
                    y += fontSize * 1.2;
                } else {
                    line = testLine;
                }
            }
            ctx.strokeText(line.trim(), canvas.width / 2, y);
            ctx.fillText(line.trim(), canvas.width / 2, y);
        };
    }, [imageFile, selectedCaption]);

    useEffect(() => {
        drawMeme();
    }, [drawMeme]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع صورة، والخبير هيقترح عليك 5 كابشنات ميم تموت من الضحك. اختار اللي يعجبك ونزل الميم على طول."
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={setImageFile} />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                    ولّد ميمز
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {suggestions && suggestions.length > 0 && (
                <div className="mt-6">
                    <ResultCard title="الميم جاهز">
                        <canvas ref={canvasRef} className="w-full h-auto rounded-lg border dark:border-gray-700" />
                        <Button onClick={handleDownload} className="mt-4 w-full" icon={<Download />}>
                            نزّل الميم
                        </Button>
                    </ResultCard>
                    <ResultCard title="اقتراحات تانية">
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCaption(s)}
                                    className={\`p-2 rounded-md text-sm transition-colors \${selectedCaption === s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}\`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default MemeGenerator;

// FILE: features/DialectConverter/DialectConverter.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { convertDialect } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AlertTriangle, Check } from 'lucide-react';

const DIALECTS = [
    'مصري', 'صعيدي', 'اسكندراني', 'شامي (سوري/لبناني)', 'خليجي (سعودي/إماراتي)', 'سوداني',
    'درامي سينمائي', 'توكسيك كوميدي', 'لهجة أطفال'
];

interface ConvertParams {
    text: string;
    dialect: string;
}

const DialectConverter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'dialect-converter')!;
    const [text, setText] = useState('');
    const [selectedDialect, setSelectedDialect] = useState(DIALECTS[0]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const { data: result, isLoading, error, execute } = useGemini<string, ConvertParams>(
        ({ text, dialect }) => convertDialect(text, dialect)
    );

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(() => setModalVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setModalVisible(false);
        }
    }, [showConfirmation]);

    const handleSubmit = () => {
        if (!text.trim()) return;
        if (selectedDialect === 'توكسيك كوميدي') {
            setShowConfirmation(true);
        } else {
            execute({ text, dialect: selectedDialect });
        }
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        execute({ text, dialect: selectedDialect });
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي جملة واختار اللهجة اللي عايز تحولها ليها. الخبير هيترجمهالك بطريقة طبيعية ومظبوطة."
        >
            <div className="space-y-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب النص الأصلي هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 min-h-[120px] resize-none"
                />
                <div>
                    <label className="block mb-3 text-sm font-medium">اختار اللهجة:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DIALECTS.map(dialect => (
                            <button
                                key={dialect}
                                onClick={() => setSelectedDialect(dialect)}
                                className={\`flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card \${
                                    selectedDialect === dialect
                                        ? 'bg-primary text-primary-foreground shadow-md ring-primary'
                                        : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }\`}
                            >
                                {dialect}
                                {selectedDialect === dialect && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()} className="w-full">
                    ترجم
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard 
                    title={\`النص باللهجة (\${selectedDialect})\`}
                    copyText={result}
                >
                    <p>{result}</p>
                </ResultCard>
            )}

            {showConfirmation && (
                <div 
                    className={\`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out \${isModalVisible ? 'opacity-100' : 'opacity-0'}\`}
                    onClick={() => setShowConfirmation(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    <div 
                        className={\`bg-background dark:bg-dark-card rounded-lg shadow-2xl p-6 max-w-sm w-full text-center transform transition-all duration-300 ease-in-out \${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}\`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">متأكد؟</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            اللهجة دي ممكن تطلع كلام 'توكسيك' على سبيل الهزار والكوميديا. هل أنت موافق تكمل؟
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setShowConfirmation(false)} variant="secondary">
                                لأ، الغي
                            </Button>
                            <Button onClick={handleConfirm} className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white">
                                أيوه، كمل
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default DialectConverter;

// FILE: features/NewsSummarizer/NewsSummarizer.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeNews } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface SummaryResult {
    serious_summary: string;
    comic_summary: string;
    advice: string;
}

const NewsSummarizer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'news-summarizer')!;
    const [newsText, setNewsText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<SummaryResult, string>(summarizeNews);

    const handleSubmit = () => {
        if (!newsText.trim()) return;
        execute(newsText);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="عندك خبر طويل ومكسل تقراه؟ الصق الخبر هنا والخبير هيديلك الزبدة بطريقتين: مرة بجد ومرة بهزار."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="حط لينك الخبر أو الخبر نفسه هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-80"
                    rows={6}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!newsText.trim()}>
                    لخّص الخبر
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="الملخص الجد 🧐">{result?.serious_summary}</ResultCard>
                    <ResultCard title="الملخص الكوميدي 😂">{result?.comic_summary}</ResultCard>
                    <ResultCard title="نصيحة الخبير 💡">{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default NewsSummarizer;

// FILE: features/MoodsGenerator/MoodsGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMoodContent } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface MoodResult {
    mood_name: string;
    mood_description: string;
    advice: string;
}

const MoodsGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'moods-generator')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<MoodResult, string>(generateMoodContent);

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="فضفض أو اكتب أي حاجة شاغلة بالك، والخبير هيحلل مودك ويقولك تشخيص كوميدي ونصيحة على الماشي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب اللي حاسس بيه هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    حلل مودي
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                 <div className="mt-6 space-y-4">
                    <ResultCard title={\`تشخيص المود: \${result.mood_name}\`}>
                        <p>{result.mood_description}</p>
                    </ResultCard>
                    <ResultCard title="نصيحة الخبير 💡">
                        <p>{result.advice}</p>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default MoodsGenerator;

// FILE: features/VoiceAnalysis/VoiceAnalysis.tsx
import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { analyzeVoice } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { Mic } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
// Fix: Import AnalysisResult from shared types file.
import { AnalysisResult } from '../../types';

const VoiceAnalysis: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'voice-analysis')!;
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: result, isLoading, error, execute } = useGemini<AnalysisResult, File>(analyzeVoice);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioFile(file);
        }
    };

    const handleSubmit = () => {
        if (!audioFile) return;
        // NOTE: This uses a mock service function.
        execute(audioFile);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع تسجيل صوتي والخبير هيحلل مودك ومستوى طاقتك من نبرة صوتك. (ملحوظة: دي ميزة تجريبية والنتائج للمرح فقط)."
        >
            <div className="space-y-4 text-center">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Mic className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            {audioFile ? audioFile.name : <><span className="font-semibold">ارفع ملف صوتي</span> أو اسحبه هنا</>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, OGG</p>
                    </div>
                    <input ref={fileInputRef} id="audio-file" type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-center text-gray-500">ملحوظة: الميزة دي لسه تحت التجربة والتحليل هنا صوري مش حقيقي.</p>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!audioFile}>
                    حلل الصوت
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="المود بتاعك 🎭">{result.mood}</ResultCard>
                    <ResultCard title="مستوى الطاقة ⚡️">{result.energy}</ResultCard>
                    <ResultCard title="تحفيل على الصوت 🎤">{result.roast}</ResultCard>
                    <ResultCard title="نصيحة الخبير 🎧">{result.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default VoiceAnalysis;

// FILE: features/DreamInterpreter/DreamInterpreter.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { interpretDream } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface DreamResult {
    logical: string;
    sarcastic: string;
    advice: string;
}

const DreamInterpreter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'dream-interpreter')!;
    const [dream, setDream] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<DreamResult, string>(interpretDream);

    const handleSubmit = () => {
        if (!dream.trim()) return;
        execute(dream);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="احكي حلمك بالتفصيل، والخبير هيفسرهولك 3 تفسيرات: واحد منطقي، وواحد ساخر، ومعاهم نصيحة غريبة."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder="احكيلي حلمك بالتفصيل..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!dream.trim()}>
                    فسّر الحلم
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="تفسير منطقي 🧠">{result?.logical}</ResultCard>
                    <ResultCard title="تفسير فكاهي 😜">{result?.sarcastic}</ResultCard>
                    <ResultCard title="نصيحة غريبة 💡">{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default DreamInterpreter;

// FILE: features/RecipeGenerator/RecipeGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateRecipe } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface RecipeResult {
    real_recipe: { name: string; steps: string; };
    comic_recipe: { name: string; steps: string; };
    advice: string;
}

const RecipeGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'recipe-generator')!;
    const [ingredients, setIngredients] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<RecipeResult, string>(generateRecipe);

    const handleSubmit = () => {
        if (!ingredients.trim()) return;
        execute(ingredients);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب المكونات اللي عندك في التلاجة، مهما كانت بسيطة، والخبير هيخترعلك بيها أكلة بجد وأكلة تانية كوميدية."
        >
            <div className="space-y-4">
                 <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="اكتب المكونات اللي في تلاحتك، زي: بيض، طماطم، جبنة..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!ingredients.trim()}>
                    اخترعلي أكلة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={\`وصفة بجد: \${result?.real_recipe?.name}\`}>
                       <p>{result?.real_recipe?.steps}</p>
                    </ResultCard>
                    <ResultCard title={\`وصفة فكاهية: \${result?.comic_recipe?.name}\`}>
                       <p>{result?.comic_recipe?.steps}</p>
                    </ResultCard>
                    <ResultCard title="نصيحة الشيف 🧑‍🍳">{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default RecipeGenerator;

// FILE: features/StoryMaker/StoryMaker.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateStory } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface StoryResult {
    funny_story: string;
}

const StoryMaker: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'story-maker')!;
    const [scenario, setScenario] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<StoryResult, string>(generateStory);

    const canSubmit = scenario.trim();

    const handleSubmit = () => {
        if (!canSubmit) return;
        execute(scenario);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب بداية أي موقف أو سيناريو، وسيب الخبير يكملك النهاية بطريقة كوميدية ومفاجئة."
        >
            <div className="space-y-4">
                 <AutoGrowTextarea
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="ابدأ السيناريو هنا (مثال: صحيت الصبح لقيت نفسي...)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!canSubmit}>
                    كمل السيناريو
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="السيناريو الكوميدي 😂" copyText={result.funny_story}>{result?.funny_story}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default StoryMaker;

// FILE: features/PdfSummarizer/PdfSummarizer.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeLongText } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface SummaryResult {
    short_summary: string;
    funny_summary: string;
    key_points: string[];
}

const PdfSummarizer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'pdf-summarizer')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<SummaryResult, string>(summarizeLongText);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setText(\`(تم اختيار ملف \${file.name}. استخراج النص من PDF مش شغال في النسخة دي، بس ممكن تلصق النص بنفسك.)\`);
        }
    };

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="لو عندك ملف PDF أو نص طويل، الصق محتواه هنا عشان الخبير يلخصهولك ويديلك أهم النقط اللي فيه."
        >
            <div className="space-y-4">
                <div className="flex justify-center p-4 border border-dashed rounded-lg border-white/30 dark:border-slate-700/50">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"/>
                </div>
                <p className="text-center text-gray-500 font-semibold">أو</p>
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="الصق النص الطويل هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-96"
                    rows={8}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    لخّص
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="ملخص سريع">{result?.short_summary}</ResultCard>
                    <ResultCard title="ملخص كوميدي">{result?.funny_summary}</ResultCard>
                    <ResultCard title="أهم النقط (الزبدة)">
                        <ul className="list-disc pe-5 space-y-2">
                            {result?.key_points?.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default PdfSummarizer;

// FILE: features/AiTeacher/AiTeacher.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { teachTopic } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const AiTeacher: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'ai-teacher')!;
    const [topic, setTopic] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(teachTopic);

    const handleSubmit = () => {
        if (!topic.trim()) return;
        execute(topic);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي موضوع أو مادة صعبة عليك، والأستاذ الفهلوي هيعملك خطة مذاكرة بسيطة ومضحكة عشان تنجز."
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="عايز خطة فهلوانية لمذاكرة إيه؟ (مثال: الفيزياء الكمية)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!topic.trim()}>
                    اعملي خطة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={\`خطة فهلوانية لمذاكرة: \${topic}\`} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiTeacher;

// FILE: features/AiLoveMessages/AiLoveMessages.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateLoveMessage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const MESSAGE_TYPES = [
    { id: 'romantic', text: 'رومانسية' },
    { id: 'funny', text: 'كوميدية' },
    { id: 'shy', text: 'واحد مكسوف' },
    { id: 'toxic', text: 'توكسيك خفيفة' },
    { id: 'apology', text: 'صلح واعتذار' },
    { id: 'witty_roast', text: 'عتاب رخمة' },
];

const AiLoveMessages: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'ai-love-messages')!;
    const [currentType, setCurrentType] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generateLoveMessage);

    const handleGenerate = (type: string) => {
        const messageType = MESSAGE_TYPES.find(t => t.id === type);
        if (messageType) {
            setCurrentType(messageType.text);
            execute(type);
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="مش عارف تعبر عن مشاعرك؟ اختار نوع الرسالة اللي محتاجها، والخبير هيكتبهالك بأسلوب مناسب."
        >
            <p className="mb-4 text-center">اختار نوع الرسالة اللي على مزاجك:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MESSAGE_TYPES.map(type => (
                    <Button
                        key={type.id}
                        variant="secondary"
                        onClick={() => handleGenerate(type.id)}
                        isLoading={isLoading && currentType === type.text}
                        disabled={isLoading && currentType !== type.text}
                    >
                        {type.text}
                    </Button>
                ))}
            </div>
            {isLoading && !result && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={\`رسالة \${currentType}\`} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiLoveMessages;

// FILE: features/VoiceCommands/VoiceCommands.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Mic, MicOff } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { ResultCard } from '../../components/ui/ResultCard';

const VoiceCommands: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'voice-commands')!;
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('دوس على المايك واتكلم...');

    const handleListen = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatus('للأسف، متصفحك مش بيدعم الميزة دي.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-EG';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setStatus('سامعك... قول اللي انت عايزه');
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            setStatus('تمام، حولت صوتك لنص. الرد التلقائي لسه تحت التطوير.');
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setStatus(\`حصل خطأ: \${event.error === 'no-speech' ? 'مسمعتش حاجة' : event.error}\`);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
             if(status === 'سامعك... قول اللي انت عايزه') {
                setStatus('خلصت استماع. دوس تاني عشان تتكلم.');
            }
        };
        
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }

    }, [isListening, status]);

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="دوس على زرار المايك واتكلم. الخبير هيحول صوتك لنص. (ملحوظة: الميزة دي لسه تجريبية)."
        >
            <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
                <Button
                    onClick={handleListen}
                    className={\`w-24 h-24 rounded-full transition-all duration-300 shadow-lg \${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}\`}
                >
                    {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                </Button>
                <p className="text-lg font-semibold h-6">{status}</p>
                <p className="text-sm text-gray-500">ملحوظة: الميزة دي تجريبية وممكن متشتغلش على كل المتصفحات.</p>
            </div>
            {transcript && (
                <ResultCard title="الكلام اللي اتقال">
                    <p>"{transcript}"</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default VoiceCommands;

// FILE: features/PostGenerator/PostGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generatePost } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const POST_TYPES = [
    { id: 'wise', text: 'بوست حكمة' },
    { id: 'funny', text: 'بوست كوميدي' },
    { id: 'mysterious', text: 'بوست غامض' },
    { id: 'roast', text: 'بوست تحفيل' },
    { id: 'caption', text: 'كابشن لصور' },
];

const PostGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'post-generator')!;
    const [currentType, setCurrentType] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generatePost);

    const handleGenerate = (type: string) => {
        const postType = POST_TYPES.find(t => t.id === type);
        if (postType) {
            setCurrentType(postType.text);
            execute(type);
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="محتاج بوست جديد للسوشيال ميديا؟ اختار نوع البوست اللي عايزه، والخبير هيكتبهولك فورًا."
        >
            <p className="mb-4 text-center">اختار نوع البوست:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {POST_TYPES.map(type => (
                    <Button
                        key={type.id}
                        variant="secondary"
                        onClick={() => handleGenerate(type.id)}
                        isLoading={isLoading && currentType === type.text}
                        disabled={isLoading && currentType !== type.text}
                    >
                        {type.text}
                    </Button>
                ))}
            </div>
            {isLoading && !result && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={\`بوست \${currentType} جاهز\`}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default PostGenerator;

// FILE: features/TextConverter/TextConverter.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { convertTextToStyle } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

const STYLES = [
    { id: 'formal', text: 'فصحى رسمية' },
    { id: 'comic_fusha', text: 'فصحى كوميدية' },
    { id: 'poet', text: 'أسلوب شاعر' },
    { id: 'sheikh', text: 'أسلوب شيخ بينصح' },
    { id: 'know_it_all', text: 'أسلوب فهلوي' },
];

interface ConvertParams {
    text: string;
    style: string;
}

const TextConverter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'text-converter')!;
    const [text, setText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const { data: result, isLoading, error, execute } = useGemini<string, ConvertParams>(
        ({ text, style }) => convertTextToStyle(text, style)
    );

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute({ text, style: selectedStyle });
    };

    const baseInputClasses = "w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60";

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي نص واختار الأسلوب اللي عايزه، شوف الخبير هيحول كلامك العادي لكلام فخم أو كوميدي إزاي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب النص الأصلي هنا..."
                    className={\`\${baseInputClasses} resize-none max-h-72\`}
                    rows={5}
                />
                <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className={\`\${baseInputClasses} appearance-none\`}
                >
                    {STYLES.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-slate-800 text-foreground dark:text-dark-foreground">{s.text}</option>)}
                </select>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    حوّل
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={\`النص بأسلوب: \${STYLES.find(s=>s.id === selectedStyle)?.text}\`}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default TextConverter;

// FILE: features/NameGenerator/NameGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateNames } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const CATEGORIES = [
    'تطبيق موبايل', 'صفحة فيسبوك كوميدية', 'قناة يوتيوب طبخ', 'لعبة استراتيجية', 'بودكاست'
];

const NameGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'name-generator')!;
    const [category, setCategory] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string[], string>(generateNames);

    const handleSubmit = () => {
        if (!category.trim()) return;
        execute(category);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="قولنا بس إنت بتفكر في مشروع إيه، والخبير هيقترح عليك قايمة بأسماء جديدة ومبتكرة."
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="اكتب نوع المشروع (مثال: قناة يوتيوب)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!category.trim()}>
                    اقترح أسماء
                </Button>
                 <div className="text-center text-sm text-gray-500">
                    <p>أو جرب حاجة من دول:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className="p-1 px-3 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{c}</button>)}
                    </div>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={\`أسماء مقترحة لـ "\${category}"\`}>
                    <ul className="list-disc pe-5 space-y-2">
                        {result.map((name, index) => <li key={index}>{name}</li>)}
                    </ul>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default NameGenerator;

// FILE: features/HabitAnalyzer/HabitAnalyzer.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { analyzeHabits } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface TalentResult {
    talent_name: string;
    talent_description: string;
    advice: string;
}

const HabitAnalyzer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'habit-analyzer')!;
    const [answers, setAnswers] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<TalentResult, string>(analyzeHabits);

    const handleSubmit = () => {
        if (!answers.trim()) return;
        execute(answers);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="قولنا على 5 حاجات بتحبها أو بتعملها في يومك، والخبير الفهلوي هيكتشفلك موهبتك الخفية اللي محدش يعرفها."
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">اكتب 5 حاجات عنك (مثال: بحب النوم، باكل شطة كتير، بتفرج على مسلسلات تركي، بعرف أصلح أي حاجة، ...)</p>
                <AutoGrowTextarea
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                    placeholder="اكتب الخمس حاجات هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!answers.trim()}>
                    اكتشف موهبتي
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={\`موهبتك الخفية هي: \${result?.talent_name}\`}>
                        <p>{result?.talent_description}</p>
                    </ResultCard>
                    <ResultCard title="نصيحة لتنمية الموهبة 🚀">
                        <p>{result?.advice}</p>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default HabitAnalyzer;

// FILE: features/AiMotivator/AiMotivator.tsx
import React, { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { getGrumpyMotivation } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { RefreshCw } from 'lucide-react';

const AiMotivator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'ai-motivator')!;
    const { data: motivation, isLoading, error, execute } = useGemini<string, void>(
        () => getGrumpyMotivation()
    );

    useEffect(() => {
        execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="محتاج دفعة بس مش من النوع التقليدي؟ الخبير هيديلك تحفيز على طريقته الخاصة... جهز نفسك."
        >
            <div className="text-center p-4 flex flex-col justify-center items-center h-full">
                {isLoading && <Loader />}
                {error && <ErrorDisplay message={error} />}
                {motivation && (
                    <ResultCard title="جرعة تحفيز على السريع">
                        <blockquote className="text-2xl lg:text-3xl font-bold italic text-center leading-relaxed">
                           "{motivation}"
                        </blockquote>
                    </ResultCard>
                )}
                <Button onClick={() => execute()} isLoading={isLoading} className="mt-8" icon={<RefreshCw />}>
                    اديني واحدة تانية
                </Button>
            </div>
        </ToolContainer>
    );
};

export default AiMotivator;

// FILE: features/ImageGenerator/ImageGenerator.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateImage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { Download } from 'lucide-react';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

const ImageGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-generator')!;
    const [prompt, setPrompt] = useState('');
    const { data: imageUrl, isLoading, error, execute } = useGemini<string, string>(generateImage);

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        execute(prompt);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي وصف يجي في خيالك، والخبير هيحولهولك لصورة فنية. كل ما كان وصفك أدق، كل ما كانت الصورة أحسن."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: قطة لابسة نظارة شمس وقاعدة على الشط..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-64"
                    rows={4}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!prompt.trim()}>
                    ولّد الصورة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {imageUrl && (
                <ResultCard title="الصورة جاهزة!">
                    <div className="flex flex-col items-center gap-4">
                        <img src={imageUrl} alt={prompt} className="rounded-lg max-w-full h-auto border dark:border-gray-700 shadow-lg" />
                        <a
                            href={imageUrl}
                            download={\`\${prompt.slice(0, 20).replace(/ /g, '_')}.png\`}
                            className="w-full"
                        >
                            <Button className="w-full" icon={<Download />}>
                                نزّل الصورة
                            </Button>
                        </a>
                    </div>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default ImageGenerator;
`;
