
// This file provides a summarized context of the application's source code for the AI model.
// It helps the AI understand its own structure and capabilities to answer user questions accurately.
// NOTE: This is an automatically generated summary and will be updated with each modification request.
export const SOURCE_CODE_CONTEXT = `
// OVERVIEW: This is a React application built with TypeScript and Vite. It uses TailwindCSS for styling and Lucide icons.
// The app is a multi-tool platform powered by the Gemini API.
// ARCHITECTURE: The application uses a robust internationalization (i18n) system. All user-facing strings, prompts, and persona instructions are managed centrally in 'locales/ar.json' and accessed via a 't()' function from 'localizationService'.
// **KEY CAPABILITY:** The main chat (Khabirkom/Fahimkom) has access to **Google Search Grounding**, allowing it to answer real-time questions about news, weather, dates, and prices.

// --- CORE STRUCTURE ---

// FILE: index.tsx
// DESCRIPTION: The main entry point. Renders the App component within all necessary context providers, including LanguageProvider.

// FILE: App.tsx
// DESCRIPTION: The root component that manages layout, sidebar, navbar, and renders the active tool via React.lazy for code splitting.

// FILE: contexts/LanguageContext.tsx & services/localizationService.ts
// DESCRIPTION: Core of the i18n system. Manages loading the 'ar.json' language file and provides the translation function 't()' to the entire application.

// FILE: locales/ar.json
// DESCRIPTION: A central JSON file containing ALL strings for the application, including UI text, tool descriptions, and the system instructions/prompts for the Gemini API.

// --- SERVICES ---

// FILE: services/geminiService.ts
// DESCRIPTION: The core service for all interactions with the Google Gemini API. Includes API key rotation and exponential backoff retry logic.

// FILE: services/api/chat.service.ts, image.service.ts, text.service.ts
// DESCRIPTION: These services contain the specific logic for each tool. They import the 't()' function from 'localizationService' to construct their prompts dynamically based on the selected language. For example, 't('prompts.textRoast')'.

// FILE: services/apiKeyManager.ts
// DESCRIPTION: Manages storing, retrieving, adding, deleting, and rotating Gemini API keys in localStorage.

// --- UI COMPONENTS ---

// FILE: features/Chat/Chat.tsx
// DESCRIPTION: The main chat interface. Handles the dashboard screen, message rendering (including markdown, code blocks, and tool suggestions), and user input.

// FILE: features/[ToolName]/[ToolName].tsx (e.g., features/TextRoast/TextRoast.tsx)
// DESCRIPTION: Each of the 24+ tools has its own component. They all follow a standard pattern:
// 1. Use 'ToolContainer' for consistent layout.
// 2. Use the 'useLanguage' hook to get the 't()' function for all UI text.
// 3. Use the 'useGemini' hook to make asynchronous calls to the respective service function.
// 4. Manage local state for inputs and display loading, error, and result states.
`;
