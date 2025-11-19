
import React from 'react';
import { Wrench } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const MaintenancePlaceholder: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Wrench className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('maintenance.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: t('maintenance.description')}} />
        </div>
    );
};
