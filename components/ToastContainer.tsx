import React from 'react';
import { useToast } from '../hooks/useToast';
import { Toast } from './ui/Toast';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div
            aria-live="assertive"
            className="fixed inset-0 flex flex-col items-center justify-start p-4 pointer-events-none z-50"
        >
            <div className="w-full max-w-xs space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            onDismiss={() => removeToast(toast.id)}
                            icon={toast.options?.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
