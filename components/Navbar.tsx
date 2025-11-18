import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
    toggleSidebar: () => void;
    toggleTheme: (e: React.MouseEvent) => void;
    theme: 'light' | 'dark';
    toolName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, toggleTheme, theme, toolName }) => {
    return (
        <header className="bg-background/60 dark:bg-dark-background/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 transition-all duration-300">
            {/* Right Side (Start in RTL) */}
            <div className="flex-1 flex justify-start">
                <button onClick={toggleSidebar} className="text-slate-500 hover:text-foreground dark:hover:text-white transition-transform hover:scale-110">
                    <Menu size={24} />
                </button>
            </div>

            {/* Center */}
            <div className="flex-shrink-0">
                 <h2 className="text-lg font-bold tracking-wide text-foreground dark:text-dark-foreground">{toolName}</h2>
            </div>
            
            {/* Left Side (End in RTL) */}
            <div className="flex-1 flex justify-end">
                 <button
                    onClick={(e) => toggleTheme(e)}
                    className="relative p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors overflow-hidden group"
                    aria-label="Toggle theme"
                >
                    <div className="relative z-10">
                         {theme === 'light' ? <Moon size={20} className="group-hover:rotate-12 transition-transform duration-500" /> : <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500" />}
                    </div>
                </button>
            </div>
        </header>
    );
};