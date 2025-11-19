
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const Loader: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loader.title')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('loader.subtitle')}</p>
        </div>
    );
};
