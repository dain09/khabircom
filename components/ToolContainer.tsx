
import React, { useState } from 'react';
import { LucideIcon, Info, X } from 'lucide-react';

interface ToolContainerProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    children: React.ReactNode;
    introText?: string;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ title, description, icon: Icon, iconColor, children, introText }) => {
    const [isIntroVisible, setIntroVisible] = useState(true);
    
    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col transition-all duration-300 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <div className={`p-3 bg-primary/10 rounded-full`}>
                    <Icon size={28} className={iconColor} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground dark:text-white">{title}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className="bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 p-4 sm:p-6 rounded-xl shadow-xl flex-1">
                {introText && isIntroVisible && (
                    <div className="relative p-3 mb-4 bg-primary/10 backdrop-blur-sm border-s-4 border-primary text-primary-dark dark:text-primary rounded-lg">
                        <button
                            onClick={() => setIntroVisible(false)}
                            className="absolute top-1.5 end-1.5 p-1 rounded-full hover:bg-primary/20 transition-colors"
                            aria-label="إخفاء الإرشادات"
                        >
                            <X size={16} />
                        </button>
                        <div className="flex items-start gap-3">
                            <Info size={20} className="flex-shrink-0 mt-0.5 text-primary" />
                            <p className="text-sm pe-6 text-foreground/80 dark:text-dark-foreground/80">{introText}</p>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};