export const SOURCE_CODE_CONTEXT = `
// OVERVIEW: This is a React application built with TypeScript and Vite. It's a multi-tool platform powered by the Gemini API, featuring a central chat interface and various specialized tools. It supports PWA installation, skeleton loading, and toast notifications.

// --- CORE STRUCTURE ---

// FILE: index.tsx
// Renders the App component within context providers, including Theme, Chat, Tool, Memory, Persona, and the new ToastProvider.

// FILE: App.tsx
// The root component that manages layout and renders the active tool. It now includes the ToastContainer for global notifications.

// --- ARCHITECTURE & SERVICES (REFACTORED) ---

// FILE: services/geminiService.ts (Now gemini.core.ts conceptually)
// DESCRIPTION: Contains only the core logic for interacting with the Google Gemini API.
// Manages API client creation, and exports the withApiKeyRotation wrapper function for handling rate limits across multiple keys.

// FILE: services/api/chat.service.ts (NEW)
// DESCRIPTION: All services related to the chat feature.
// - getChatPersonaInstruction: Dynamically builds the system prompt using memory and persona settings.
// - generateChatResponseStream: Handles the main streaming chat logic.
// - getMorningBriefing: Generates the content for the proactive dashboard.

// FILE: services/api/image.service.ts (NEW)
// DESCRIPTION: All services for tools that process or generate images.
// - roastImage, generateMemeSuggestions, generateImage, editImage.

// FILE: services/api/text.service.ts (NEW)
// DESCRIPTION: All services for tools that process or generate text.
// - roastText, summarizeNews, convertDialect, interpretDream, etc.

// FILE: services/apiKeyManager.ts
// Manages storing, retrieving, adding, deleting, and rotating Gemini API keys in localStorage.

// --- STATE MANAGEMENT (CONTEXTS) ---

// FILE: contexts/ChatContext.tsx, ToolContext.tsx, ThemeContext.tsx, MemoryContext.tsx, PersonaContext.tsx
// These contexts manage their respective global states (conversations, active tool, theme, user memory, AI persona).

// FILE: contexts/ToastContext.tsx (NEW)
// Manages a global state for toast notifications, allowing any component to trigger a toast.

// --- UI & UX ENHANCEMENTS ---

// FILE: components/Sidebar.tsx
// The search input for tools is now debounced using the new useDebounce hook to improve performance.

// FILE: features/Chat/Chat.tsx
// - The welcome screen is now a proactive "DashboardScreen" that uses Skeleton components while loading.
// - After processing a [SAVE_MEMORY] command, it now triggers a toast notification for user feedback using useToast.

// FILE: components/ui/Skeleton.tsx & ResultCardSkeleton.tsx (NEW)
// New components to display skeleton/ghost UI elements while data is loading, improving perceived performance.
// All tool feature components (e.g., ImageRoast, TextRoast) have been updated to use ResultCardSkeleton instead of a generic loader.

// --- PWA SUPPORT ---

// FILE: manifest.json (NEW) & index.html (MODIFIED)
// The app is now a Progressive Web App, making it installable on user devices for a more native-like experience.

// --- HOOKS ---
// FILE: hooks/useDebounce.ts (NEW)
// A custom hook to debounce a value, used for the sidebar search.

// FILE: hooks/useToast.ts (NEW)
// A custom hook for easy access to the ToastContext's functions.
`;