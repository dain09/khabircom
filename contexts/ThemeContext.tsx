
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (e?: React.MouseEvent) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem(THEME_KEY);
            return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
        } catch (e) {
            return 'dark';
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.error("Failed to save theme to localStorage.", e);
        }
    }, [theme]);
    
    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === THEME_KEY && event.newValue) {
                const newTheme = (event.newValue === 'light' || event.newValue === 'dark') ? event.newValue : 'dark';
                if (newTheme !== theme) {
                    setTheme(newTheme);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [theme]);

    const toggleTheme = async (e?: React.MouseEvent) => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const isToDark = nextTheme === 'dark';

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        document.documentElement.setAttribute('data-transition', isToDark ? 'to-dark' : 'to-light');

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme);
                if (isToDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
        });

        await transition.ready;

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                pseudoElement: '::view-transition-new(root)',
            }
        );
        
        transition.finished.then(() => {
            document.documentElement.removeAttribute('data-transition');
        });
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
