
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (e?: React.MouseEvent) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
    });

    // We keep useEffect for initial load and persisting to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Fallback for initial load
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = async (e?: React.MouseEvent) => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        const isToDark = newTheme === 'dark';

        // Check if the browser supports the View Transitions API
        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // Fallback coordinates (center of screen) if no event is provided
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;

        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Set attribute for CSS to handle Z-index BEFORE the transition starts
        document.documentElement.setAttribute('data-transition', isToDark ? 'to-dark' : 'to-light');

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            // flushSync is crucial here. It forces React to apply the state change DOM updates immediately.
            flushSync(() => {
                setTheme(newTheme);
                // Force class update instantly inside the snapshot window
                if (isToDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
        });

        // Wait for the pseudo-elements to be created
        await transition.ready;

        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        if (isToDark) {
            // Light -> Dark: 
            // The Old View (Light) sits ON TOP (z-index logic in CSS).
            // We animate the Old View shrinking to reveal the New View (Dark) underneath.
            // Since New View is static underneath, we must ensure it's already dark (handled by flushSync).
            document.documentElement.animate(
                {
                    clipPath: [...clipPath].reverse(),
                },
                {
                    duration: 500,
                    easing: 'ease-in',
                    pseudoElement: '::view-transition-old(root)',
                }
            );
        } else {
            // Dark -> Light:
            // The New View (Light) sits ON TOP.
            // We animate the New View expanding to cover the Old View (Dark).
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        }
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
