import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
    toggleSidebar: () => void;
    toggleTheme: () => void;
    theme: 'light' | 'dark';
    toolName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, toggleTheme, theme, toolName }) => {
    return (
        <header className="bg-background/60 dark:bg-dark-background/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
                 <button onClick={toggleSidebar} className="text-slate-500 hover:text-foreground dark:hover:text-white">
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground">{toolName}</h2>
            </div>
            <div className="flex items-center">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    );
};