
// This file provides a summarized context of the application's source code for the AI model.
// It helps the AI understand its own structure and capabilities to answer user questions accurately.
// NOTE: This is an automatically generated summary and will be updated with each modification request.
export const SOURCE_CODE_CONTEXT = `
// OVERVIEW: This is a React application built with TypeScript and Vite. It uses TailwindCSS for styling and Lucide icons.
// The app is a multi-tool platform powered by the Gemini API, featuring a central chat interface and various specialized tools.

// --- CORE STRUCTURE ---

// FILE: index.tsx
// DESCRIPTION: The main entry point of the application. Renders the App component within context providers.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToolProvider } from './contexts/ToolContext';
// ... Renders <App /> within providers ...

// FILE: App.tsx
// DESCRIPTION: The root component that manages layout, sidebar, navbar, and renders the active tool.
import React, { useMemo, Suspense, useEffect, useState } from 'react';
// ...
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
  // ... state for sidebar, API key manager, theme ...
  // ... logic to determine and render the active tool component ...
  return (
    // ... JSX for main layout including Sidebar, Navbar, and Suspense for the active tool ...
  );
};
export default App;

// --- DATA & TYPES ---

// FILE: types.ts
// DESCRIPTION: Contains all major TypeScript interfaces for the application's data structures.
export interface Tool { id: string; title: string; /* ... */ }
export interface Message { id: string; role: 'user' | 'model'; /* ... */ }
export interface Conversation { id: string; title: string; messages: Message[]; /* ... */ }
export interface AnalysisResult { mood: string; energy: string; /* ... */ }

// FILE: constants.ts
// DESCRIPTION: Defines the list of all available tools and their properties.
import { MessageSquare, Flame, /* ... */ Code } from 'lucide-react';
import { Tool } from './types';
export const TOOLS: Tool[] = [
    { id: 'chat', title: 'دردشة مع خبيركم', /* ... */ },
    { id: 'text-roast', title: 'تحفيل على الكلام', /* ... */ },
    { id: 'image-roast', title: 'تحفيل على الصور', /* ... */ },
    { id: 'meme-generator', title: 'صانع الميمز', /* ... */ },
    { id: 'image-generator', title: 'رسام الخبير', /* ... */ },
    { id: 'image-editor', title: 'معدل الصور', /* ... */ },
    { id: 'moods-generator', title: 'محلل المود', /* ... */ },
    { id: 'story-maker', title: 'مكمل السيناريوهات', /* ... */ },
    { id: 'ai-love-messages', title: 'رسائل الحب والغرام', /* ... */ },
    { id: 'name-generator', title: 'مولد الأسماء', /* ... */ },
    { id: 'ai-motivator', title: 'المحفز الرخم', /* ... */ },
    { id: 'post-generator', title: 'مولد بوستات السوشيال', /* ... */ },
    { id: 'dialect-converter', title: 'مترجم اللهجات', /* ... */ },
    { id: 'news-summarizer', title: 'ملخص الأخبار الفوري', /* ... */ },
    { id: 'pdf-summarizer', title: 'ملخص الملفات والنصوص', /* ... */ },
    { id: 'text-converter', title: 'محول الأساليب', /* ... */ },
    { id: 'code-explainer', title: 'شرح الأكواد', /* ... */ },
    { id: 'dream-interpreter', title: 'مفسر الأحلام الفلكي', /* ... */ },
    { id: 'ai-teacher', title: 'الأستاذ الفهلوي في التخطيط', /* ... */ },
    { id: 'habit-analyzer', title: 'المحلل الفهلوي', /* ... */ },
    { id: 'memory-manager', title: 'الذاكرة', /* ... */ },
    { id: 'khabirkom-settings', title: 'ظبّط خبيركم', /* ... */ },
    { id: 'voice-analysis', title: 'تحليل الصوت', /* ... */ },
    { id: 'recipe-generator', title: 'وصفات على قد الإيد', /* ... */ },
    { id: 'voice-commands', title: 'الأوامر الصوتية', /* ... */ },
];

// --- STATE MANAGEMENT (CONTEXTS) ---

// FILE: contexts/ChatContext.tsx
// DESCRIPTION: Manages conversations and messages state globally.
export const ChatContext = createContext<ChatContextType | undefined>(undefined);
// Provides: conversations, activeConversationId, and functions like:
// createNewConversation, deleteConversation, addMessageToConversation, updateMessageInConversation

// FILE: contexts/ToolContext.tsx
// DESCRIPTION: Manages the currently active tool.
export const ToolContext = createContext<ToolContextType | undefined>(undefined);
// Provides: activeToolId, setActiveToolId

// FILE: contexts/ThemeContext.tsx
// DESCRIPTION: Manages the light/dark theme of the application.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// Provides: theme, toggleTheme

// --- SERVICES ---

// FILE: services/geminiService.ts
// DESCRIPTION: The core service for all interactions with the Google Gemini API. Includes API key rotation logic.
import { GoogleGenAI, /* ... */ } from "@google/genai";
import { getCurrentApiKey, rotateToNextKey } from './apiKeyManager';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'...";
const CHAT_PERSONA_INSTRUCTION = EGYPTIAN_PERSONA_INSTRUCTION + "..." + SOURCE_CODE_CONTEXT;

// Handles API calls with automatic key rotation on rate-limit errors.
const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => { /* ... */ };

// Tests if a given API key is valid.
export const testApiKey = async (apiKey: string): Promise<boolean> => { /* ... */ };

// Main chat function (streaming).
export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }) => { /* ... */ };

// Function for each tool, e.g.:
export const roastText = async (text: string) => { /* ... */ };
export const roastImage = async (imageFile: File) => { /* ... */ };
export const generateImage = async (prompt: string): Promise<string> => { /* ... */ };
export const explainCode = async (code: string) => { /* ... */ };
// ... (and all other service functions for tools)

// FILE: services/apiKeyManager.ts
// DESCRIPTION: Manages storing, retrieving, adding, deleting, and rotating Gemini API keys in localStorage.
export const initializeApiKeys = () => { /* ... */ };
export const getApiKeys = (): string[] => { /* ... */ };
export const getCurrentApiKey = (): string | undefined => { /* ... */ };
export const rotateToNextKey = (): string | undefined => { /* ... */ };
export const addApiKey = (key: string): boolean => { /* ... */ };
export const deleteApiKey = (keyToDelete: string): void => { /* ... */ };

// --- UI COMPONENTS ---

// FILE: components/Sidebar.tsx
// DESCRIPTION: Renders the sidebar with conversation history and tool navigation. Includes search and recent tools.
export const Sidebar: React.FC<SidebarProps> = ({ /* ... */ }) => { /* ... */ };

// FILE: components/Navbar.tsx
// DESCRIPTION: Renders the top navigation bar, showing the current tool name and theme toggle.
export const Navbar: React.FC<NavbarProps> = ({ /* ... */ }) => { /* ... */ };

// FILE: components/ToolContainer.tsx
// DESCRIPTION: A wrapper component for all tool interfaces, providing a consistent header and layout.
export const ToolContainer: React.FC<ToolContainerProps> = ({ /* ... */ }) => { /* ... */ };

// FILE: components/ApiKeyManager.tsx
// DESCRIPTION: A modal dialog for users to add, test, and delete their Gemini API keys.
export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ /* ... */ }) => { /* ... */ };

// FILE: features/Chat/Chat.tsx
// DESCRIPTION: The main chat interface, handling message display, user input (text, image, voice), streaming responses, and the welcome screen.
const WelcomeScreen: React.FC<{ /* ... */ }> = ({ /* ... */ }) => { /* ... */ };
const MessageContent: React.FC<{ content: string }> = ({ content }) => { /* ... */ }; // Renders markdown with tool links and code blocks.
const Chat: React.FC = () => { /* ... handles all chat logic ... */ };
export default Chat;

// FILE: features/CodeExplainer/CodeExplainer.tsx
// DESCRIPTION: UI for the Code Explainer tool. Contains a textarea for code input and displays the formatted explanation.
const CodeExplainer: React.FC = () => { /* ... */ };
export default CodeExplainer;

// ... And so on for all other feature components. Each follows a similar pattern:
// - Uses ToolContainer for layout.
// - Uses useGemini hook to call the corresponding service function.
// - Manages local state for inputs.
// - Displays loading, error, and result states.
`;
