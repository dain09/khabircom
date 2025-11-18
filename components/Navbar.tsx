
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
        <header className="bg-background/80 dark:bg-dark-background/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/50 h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 transition-all duration-300 sticky top-0">
            {/* Right Side (Start in RTL) */}
            <div className="flex-1 flex justify-start">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2.5 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary shadow-sm hover:shadow-md rounded-full transition-all duration-300 active:scale-95"
                    aria-label="فتح القائمة"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Center */}
            <div className="flex-shrink-0">
                 <h2 className="text-lg font-bold tracking-wide text-foreground dark:text-dark-foreground bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">
                    {toolName}
                 </h2>
            </div>
            
            {/* Left Side (End in RTL) */}
            <div className="flex-1 flex justify-end">
                 <button
                    onClick={(e) => toggleTheme(e)}
                    className={`relative p-2.5 rounded-full transition-all duration-300 border shadow-sm hover:shadow-md group active:scale-95 overflow-hidden ${
                        theme === 'light' 
                        ? 'bg-white border-amber-200/50 text-amber-500 hover:bg-amber-50' 
                        : 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
                    }`}
                    aria-label="تبديل الوضع"
                >
                    <div className="relative z-10">
                         {theme === 'light' ? (
                            <Moon size={20} className="group-hover:rotate-12 transition-transform duration-500 fill-current" />
                         ) : (
                            <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500 fill-current" />
                         )}
                    </div>
                </button>
            </div>
        </header>
    );
};
