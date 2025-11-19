
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    const { t } = useLanguage();
    return (
        <div className="flex items-center gap-4 p-4 mt-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-lg">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
                <p className="font-bold">{t('errors.genericTitle')}</p>
                <p>{message}</p>
            </div>
        </div>
    );
};
