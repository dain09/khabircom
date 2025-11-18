
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

    // Initial Load Side Effect
    useEffect(() => {
        const root = document.documentElement;
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

        // Check for View Transition support
        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        // Calculate transition origin (cursor position or center)
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;

        // Calculate the radius needed to cover the screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Set the data attribute for CSS to know which way we are going (Z-Index logic)
        document.documentElement.setAttribute('data-transition', isToDark ? 'to-dark' : 'to-light');

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            // CRITICAL: flushSync ensures React updates the DOM *immediately* inside this callback.
            // This means the "New View" snapshot will strictly have the new class applied.
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

        // The animation Logic
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        if (isToDark) {
            // Going Dark: We shrink the Old View (Light) to reveal the New View (Dark) underneath.
            // The New View (Dark) is static.
            document.documentElement.animate(
                {
                    clipPath: [...clipPath].reverse(),
                },
                {
                    duration: 600,
                    easing: 'ease-in', // Start slow, speed up
                    pseudoElement: '::view-transition-old(root)',
                }
            );
        } else {
            // Going Light: We expand the New View (Light) on top of the Old View (Dark).
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 600,
                    easing: 'ease-out', // Start fast, slow down
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        }
        
        // Cleanup attribute after animation
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
