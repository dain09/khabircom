
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">الخبير بيحضّرلك حاجة فخمة...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">ثواني والرد هيكون عندك!</p>
        </div>
    );
};
