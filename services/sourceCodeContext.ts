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
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAEcElEQVR4nO3dO29cVRzH8e/MA3gBkyYlBDSFgFDSi4CIkGgoKiJ8AYqEipQyFSoKBEQFIv+AImqpdEgJASGlkIiA5G0gNk3SgAW4YQ+wYw/nlB+Su92997wze2b2e84n2fnszPzOmdk5Y/yAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAPwO++8/f/j05P7u/8uMfnz169J8T5/vTMyPj07OjE+f783OjU+cHz/ZnPj/+7NlnJ2dHpwZf3p/4+P3Hn/345Pxs5eO3Dxx8+dnh8fnVwZf3R6enPj6/Mvjyo/Mzw+ff3vj4/Kpw+M9p4AMHHn65vzz88uDLOzPjZz/++O2T0+f7s9fnVwdf3p/Y+Pj9yX0P/3ny5cn52cn10Zf35/88efI/256dHF38wQMfPnx6+GcPvjxy+F9vA35x8GcP3nj4Zw++PHz/p/eBPz/48vDAh18ePvgvHn/24P3J3dnhfP/24MvDAx9+efDg/eT+5vDA/b9aA3598L/rQ+B7D/57DQB+efD/bQ+B7z/47/EA8KuD/wUfAu89+C8eAH558L/nQ+B9B/+LhwBfv+yC5w/eP/+V9vXnBz68v3A++N/4+NnD9ycffvl7D/8LnwPeA27e8+C5g/fPT67Pn+/Pfrw++PC+wvnA+4cHH375+9+P/wP2PvD+xMfnFwcf3p+cHhw4P+f5wfszVwffHpycn52eHhw4P/c88P7s2XMnZwdf3h9cH5z//Dzw/vTUM4MvD5/vz368Pjg/+fyTz/7+NnD5x+dn+7P3589+fPLh539rDvy74MKXn58ZePz2+fnVsYMP70+cPn/h47dnP/746+Dze89+fPKXm0D+XfDl+cnh+flnTw/v/974+O3B2dH5+dXR/9k3PvgHwG8Pvvyz7+CD/wH89uDLf/oOvvAHgN8cfPln38EH/+2/fPgn/Jc3/8g/uQ/4xQG/PPgT/p82/2yQf/Lf8G+Afxnwo3/yD98fAAB+Z8AP/pW/Af/lT/8G+JUAP/hb/gb4Vz79G+D/C/jR//D3wN+fGZy+N98Df35m8PnfBwC8/3HwP+c88P7s+fkz4Pvnz89fBwDAX33wP+f8v5f/fv7gPz357DkTgH8GvP/x088eAEC/77/yD34X/L89+B/+LgAAnwJ+9r/x+T/5LgAADwO/+594/19wFwAAh8D/5NdfBwDgd8A/9+svAAC8Dfz//+VzANAP/J///hYAAN8B3/3n30//AgDAk+C7f/398z8A4O/wX8AnDgAAv+c//5cDAED+Hnj/wz9/33/hL/+d/58BAAB+C/zp2dGpQwAAvAv+6Wf3R3f/BADg1/DX//8P8G9v/u/9XQAA/h7817/8/P78VwEAuD94/+PjJwAA/hP403/yLwAA/BP403/xTwAA+IHg+w/4iQAA8P/h++8/4CcDAOB74D/hLwIAwM+D5//kLwEAgNfA+z/4SwCA4K3g/cEPHAAAvAnen9wfAQAA/wD+6dmRw/8EAAAM3gq+O3/wf8w/YMCAAAAAAAAAAPBf/gC9D77fUv1D4AAAAABJRU5ErkJggg==" />
    <link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAEcElEQVR4nO3dO29cVRzH8e/MA3gBkyYlBDSFgFDSi4CIkGgoKiJ8AYqEipQyFSoKBEQFIv+AImqpdEgJASGlkIiA5G0gNk3SgAW4YQ+wYw/nlB+Su92997wze2b2e84n2fnszPzOmdk5Y/yAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAPwO++8/f/j05P7u/8uMfnz169J8T5/vTMyPj07OjE+f783OjU+cHz/ZnPj/+7NlnJ2dHpwZf3p/4+P3Hn/345Pxs5eO3Dxx8+dnh8fnVwZf3R6enPj6/Mvjyo/Mzw+ff3vj4/Kpw+M9p4AMHHn65vzz88uDLOzPjZz/++O2T0+f7s9fnVwdf3p/Y+Pj9yX0P/3ny5cn52cn10Zf35/88efI/256dHF38wQMfPnx6+GcPvjxy+F9vA35x8GcP3nj4Zw++PHz/p/eBPz/48vDAh18ePvgvHn/24P3J3dnhfP/24MvDAx9+efDg/eT+5vDA/b9aA3598L/rQ+B7D/57DQB+efD/bQ+B7z/47/EA8KuD/wUfAu89+C8eAH558L/nQ+B9B/+LhwBfv+yC5w/eP/+V9vXnBz68v3A++N/4+NnD9ycffvl7D/8LnwPeA27e8+C5g/fPT67Pn+/Pfrw++PC+wvnA+4cHH375+9+P/wP2PvD+xMfnFwcf3p+cHhw4P+f5wfszVwffHpycn52eHhw4P/c88P7s2XMnZwdf3h9cH5z//Dzw/vTUM4MvD5/vz368Pjg/+fyTz/7+NnD5x+dn+7P3589+fPLh539rDvy74MKXn58ZePz2+fnVsYMP70+cPn/h47dnP/746+Dze89+fPKXm0D+XfDl+cnh+flnTw/v/974+O3B2dH5+dXR/9k3PvgHwG8Pvvyz7+CD/wH89uDLf/oOvvAHgN8cfPln38EH/+2/fPgn/Jc3/8g/uQ/4xQG/PPgT/p82/2yQf/Lf8G+Afxnwo3/yD98fAAB+Z8AP/pW/Af/lT/8G+JUAP/hb/gb4Vz79G+D/C/jR//D3wN+fGZy+N98Df35m8PnfBwC8/3HwP+c88P7s+fkz4Pvnz89fBwDAX33wP+f8v5f/fv7gPz357DkTgH8GvP/x088eAEC/77/yD34X/L89+B/+LgAAnwJ+9r/x+T/5LgAADwO/+594/19wFwAAh8D/5NdfBwDgd8A/9+svAAC8Dfz//+VzANAP/J///hYAAN8B3/3n30//AgDAk+C7f/398z8A4O/wX8AnDgAAv+c//5cDAED+Hnj/wz9/33/hL/+d/58BAAB+C/zp2dGpQwAAvAv+6Wf3R3f/BADg1/DX//8P8G9v/u/9XQAA/h7817/8/P78VwEAuD94/+PjJwAA/hP403/yLwAA/BP403/xTwAA+IHg+w/4iQAA8P/h++8/4CcDAOB74D/hLwIAwM+D5//kLwEAgNfA+z/4SwCA4K3g/cEPHAAAvAnen9wfAQAA/wD+6dmRw/8EAAAM3gq+O3/wf8w/YMCAAAAAAAAAAPBf/gC9D77fUv1D4AAAAABJRU5ErkJggg==" />
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

// FILE: components/Sidebar.tsx
import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { Tool } from '../types';
import { useTool } from '../hooks/useTool';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
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
                                            className={\`w-full flex items-center justify-between p-3 my-1 rounded-md text-start cursor-pointer transition-all duration-200 hover:-translate-x-1 \${
                                                activeConversationId === convo.id
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                            }\`}
                                        >
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
                                                        className={\`w-full flex items-center p-3 my-1 rounded-md text-start transition-all duration-200 hover:translate-x-1 \${
                                                            activeToolId === tool.id && !activeConversationId
                                                                ? 'bg-primary/10 text-primary font-bold'
                                                                : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                                        }\`}
                                                    >
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
// ... other files ...
`;
