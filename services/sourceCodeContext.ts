
export const SOURCE_CODE_CONTEXT = `
// FILE: index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToolProvider } from './contexts/ToolContext';
import { MemoryProvider } from './contexts/MemoryContext';
import { PersonaProvider } from './contexts/PersonaContext';

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
            <PersonaProvider>
              <App />
            </PersonaProvider>
          </MemoryProvider>
        </ToolProvider>
      </ChatProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// FILE: App.tsx
import React, { useMemo, Suspense, useEffect, useState } from 'react';
// ...
const featureComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    'chat': React.lazy(() => import('./features/Chat/Chat')),
    'text-roast': React.lazy(() => import('./features/TextRoast/TextRoast')),
    // ... all other tools
    'image-editor': React.lazy(() => import('./features/ImageEditor/ImageEditor')),
    'khabirkom-settings': React.lazy(() => import('./features/Settings/Settings')),
};
// ... App component logic

// FILE: types.ts
import { LucideIcon } from 'lucide-react';
export interface Tool { /* ... */ }
export interface Message { /* ... */ }
export interface Conversation { /* ... */ }
export interface PersonaSettings {
    humor: number;
    verbosity: number;
    interests: string[];
}
// ...

// FILE: constants.ts
// ...
export const TOOLS: Tool[] = [
    // ... all tools
    { id: 'khabirkom-settings', title: 'ظبّط خبيركم', description: 'تحكم في شخصية الخبير وردوده', icon: SlidersHorizontal, color: 'text-cyan-500', category: 'المعرفة والمساعدة' },
];

// FILE: contexts/PersonaContext.tsx (NEW)
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PersonaSettings } from '../types';
export const PersonaContext = createContext<PersonaContextType | undefined>(undefined);
const PERSONA_STORAGE_KEY = 'khabirkom-persona-settings';
export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... Logic to manage persona settings state and sync with localStorage
};
export const usePersona = () => { /* ... */ };


// FILE: features/Settings/Settings.tsx (NEW)
import React, { useState } from 'react';
import { usePersona } from '../../hooks/usePersona';
// ... UI with sliders and inputs to control persona settings from PersonaContext

// FILE: services/geminiService.ts
// ... imports including PersonaSettings
const getChatPersonaInstruction = (memory: Record<string, string>, persona: PersonaSettings): string => {
  // ... Base prompt
  const personaContext = "\\n\\n--- إعدادات الشخصية ---\\n" +
                         \`اضبط شخصيتك بناءً على هذه الإعدادات:
- مستوى الهزار والكوميديا: \${persona.humor}/10 (1=جد, 10=تحفيل).
- مستوى التفصيل في الرد: \${persona.verbosity}/10 (1=مختصر, 10=رغاي).
- اهتمامات المستخدم: \${persona.interests.join(', ')}. ركز على هذه المواضيع.\`
  // ... Combines base prompt, memory, and new persona context.
  // Also includes new instructions for "Tool Chaining".
};

export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }, memory: Record<string, string>, persona: PersonaSettings) => {
  // ... calls getChatPersonaInstruction with all arguments.
};

export const getMorningBriefing = async (memory: Record<string, string>, persona: PersonaSettings, timeOfDay: string): Promise</* ... */> => {
  // New function to generate proactive dashboard content (greeting, news, meme prompt, challenge)
  // based on user's memory and persona interests.
};
// ... other service functions

// FILE: features/Chat/Chat.tsx
// ... imports including usePersona
const DashboardScreen: React.FC<{ /* ... */ }> = ({ /* ... */ }) => {
  // This is the new proactive welcome screen.
  // It uses getMorningBriefing service to fetch personalized content.
  // It also uses generateImage service to generate the meme of the day.
  // Renders a dashboard with greeting, news, challenge, and meme.
};

const Chat: React.FC = () => {
  const { persona } = usePersona();
  // ...
  // Passes persona object to streamModelResponse -> generateChatResponseStream.
  // Renders DashboardScreen when there are no messages.
};

// ... (summaries of other existing files)
`;