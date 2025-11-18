import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    onDismiss: () => void;
    icon?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss, icon }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const enterTimeout = setTimeout(() => setIsVisible(true), 10);
        // Trigger exit animation before unmounting
        const exitTimeout = setTimeout(() => setIsVisible(false), 2700);
        // Unmount component
        const dismissTimeout = setTimeout(onDismiss, 3000);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
            clearTimeout(dismissTimeout);
        };
    }, [onDismiss]);

    return (
        <div
            role="alert"
            className={`flex items-center gap-3 w-full max-w-xs p-4 text-gray-900 bg-white rounded-lg shadow-lg dark:text-gray-200 dark:bg-slate-800 transition-all duration-300 ease-in-out transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
            {icon && (
                <div className="flex-shrink-0 w-8 h-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                    {icon}
                </div>
            )}
            <div className="text-sm font-normal">{message}</div>
        </div>
    );
};
