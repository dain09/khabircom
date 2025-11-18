
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