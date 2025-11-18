
// This file provides a summarized context of the application's source code for the AI model.
// It helps the AI understand its own structure and capabilities to answer user questions accurately.
// NOTE: This is an automatically generated summary and will be updated with each modification request.
export const SOURCE_CODE_CONTEXT = `
// OVERVIEW: This is a React application built with TypeScript and Vite. It uses TailwindCSS for styling and Lucide icons.
// The app is a multi-tool platform powered by the Gemini API.
// **KEY CAPABILITY:** The main chat (Khabirkom/Fahimkom) has access to **Google Search Grounding**, allowing it to answer real-time questions about news, weather, dates, and prices.

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
    // ... other tools ...
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

// --- SERVICES ---

// FILE: services/geminiService.ts
// DESCRIPTION: The core service for all interactions with the Google Gemini API. Includes API key rotation and exponential backoff retry logic for network stability.

// FILE: services/api/chat.service.ts
// DESCRIPTION: Specific chat logic, persona management (Khabirkom vs Fahimkom).
// **IMPORTANT:** The \`generateChatResponseStream\` function creates the chat session with \`tools: [{ googleSearch: {} }]\`, enabling real-time internet access.
// The system instructions enforce "Authentic Egyptian" personas (Khabirkom = Wise Engineer, Fahimkom = Street Smart Youth).

// FILE: services/apiKeyManager.ts
// DESCRIPTION: Manages storing, retrieving, adding, deleting, and rotating Gemini API keys in localStorage.

// --- UI COMPONENTS ---

// FILE: features/Chat/Chat.tsx
// DESCRIPTION: The main chat interface.
// - DashboardScreen: Shows cached greeting and Quick Tools grid.
// - Chat: Handles all chat logic, streaming, and UI updates.
const Chat: React.FC = () => { /* ... handles all chat logic ... */ };
export default Chat;
`;
