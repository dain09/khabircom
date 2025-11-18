import React from 'react';
import { Wrench } from 'lucide-react';

export const MaintenancePlaceholder: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Wrench className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">تحت الصيانة</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
                الخبير بيعمل شوية تظبيطات على الأداة دي عشان ترجع أحسن من الأول. <br />
                شكرًا لصبرك!
            </p>
        </div>
    );
};
