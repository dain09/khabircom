
import React from 'react';
import { Menu, Sun, Moon, Settings, ArrowRight } from 'lucide-react';
import { useTool } from '../hooks/useTool';
import { useChat } from '../hooks/useChat';

interface NavbarProps {
    toggleSidebar: () => void;
    toggleTheme: (e: React.MouseEvent) => void;
    theme: 'light' | 'dark';
    toolName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, toggleTheme, theme, toolName }) => {
    const { setActiveToolId, activeToolId } = useTool();
    const { activeConversationId, setActiveConversationId } = useChat();

    // Logic to determine if we can "Go Back"
    // 1. If we are in a specific tool (not chat), we go back to Chat (Dashboard).
    // 2. If we are in Chat but inside a specific conversation, we go back to Dashboard (New Chat/Home).
    const canGoBack = activeToolId !== 'chat' || activeConversationId !== null;

    const handleBack = () => {
        if (activeToolId !== 'chat') {
            setActiveToolId('chat');
        } else if (activeConversationId !== null) {
            setActiveConversationId(null);
        }
    };

    return (
        <header className="sticky top-0 w-full z-50 bg-background/80 dark:bg-dark-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 transition-all duration-300">
            {/* Right Side (Start in RTL) */}
            <div className="flex-1 flex justify-start items-center gap-2">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 active:scale-95"
                    aria-label="فتح القائمة"
                >
                    <Menu size={26} strokeWidth={2} />
                </button>

                {canGoBack && (
                    <button 
                        onClick={handleBack}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 active:scale-95 animate-fadeIn"
                        aria-label="رجوع"
                        title="رجوع للرئيسية"
                    >
                        <ArrowRight size={26} strokeWidth={2} className="rtl:rotate-180" />
                    </button>
                )}
            </div>

            {/* Center */}
            <div className="flex-shrink-0">
                 <h2 className="text-lg font-bold tracking-wide text-foreground dark:text-dark-foreground bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 cursor-default select-none">
                    {toolName}
                 </h2>
            </div>
            
            {/* Left Side (End in RTL) */}
            <div className="flex-1 flex justify-end items-center gap-2">
                 <button
                    onClick={() => setActiveToolId('khabirkom-settings')}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 active:scale-95 active:rotate-45"
                    aria-label="الإعدادات"
                    title="إعدادات خبيركم"
                >
                    <Settings size={24} strokeWidth={2} />
                </button>

                 <button
                    onClick={(e) => toggleTheme(e)}
                    className="group relative p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-indigo-400 transition-colors duration-200 active:scale-95"
                    aria-label="تبديل الوضع"
                >
                    <div className="relative z-10">
                         {theme === 'light' ? (
                            <Moon size={24} strokeWidth={2} className="group-hover:-rotate-12 transition-transform duration-500" />
                         ) : (
                            <Sun size={24} strokeWidth={2} className="group-hover:rotate-90 transition-transform duration-500" />
                         )}
                    </div>
                </button>
            </div>
        </header>
    );
};
