import React, { createContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Toast {
    id: string;
    message: string;
    options?: ToastOptions;
}

interface ToastOptions {
    duration?: number;
    icon?: React.ReactNode;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, options?: ToastOptions) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, options: ToastOptions = {}) => {
        const id = uuidv4();
        const { duration = 3000 } = options;

        const newToast: Toast = { id, message, options };
        
        setToasts(prevToasts => [newToast, ...prevToasts]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);
    
    const value = useMemo(() => ({
        toasts,
        addToast,
        removeToast
    }), [toasts, addToast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};