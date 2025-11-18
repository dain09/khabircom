
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
        // Defensive programming: default to 'dark' if storage is corrupted or empty
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        // Synchronize DOM with React state initially
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = async (e?: React.MouseEvent) => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const isToDark = nextTheme === 'dark';

        // Feature Check: View Transition API
        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        // 1. Geometry Calculation
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // 2. Set CSS Context for Z-Index handling
        document.documentElement.setAttribute('data-transition', isToDark ? 'to-dark' : 'to-light');

        // 3. Execute Transition
        // @ts-ignore
        const transition = document.startViewTransition(() => {
            // CRITICAL: flushSync forces the React render cycle to complete immediately.
            // This ensures the DOM is fully updated (class added/removed) BEFORE the browser snaps the "new" view.
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

        // 4. Animate the Clip Path
        // Consistently animate the NEW view expanding over the OLD view.
        // This creates a satisfying "ripple" or "paint" effect from the click source.
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Snappy yet smooth
                pseudoElement: '::view-transition-new(root)',
            }
        );
        
        // 5. Cleanup
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
