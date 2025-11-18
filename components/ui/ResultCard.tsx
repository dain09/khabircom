
import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface ResultCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    copyText?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, children, className = '', copyText }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!copyText || !navigator.clipboard) return;
        navigator.clipboard.writeText(copyText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className={`mt-6 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 bg-gray-50/80 dark:bg-dark-background/80 backdrop-blur-sm transition-all duration-300 animate-slideInUpFade ${className}`}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="flex items-center text-lg font-semibold text-primary">
                    <Sparkles className="w-5 h-5 me-2" />
                    {title}
                </h3>
                {copyText && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 p-1.5 text-xs text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                        aria-label="نسخ النص"
                    >
                        {isCopied ? (
                            <>
                                <Check size={14} className="text-green-500" />
                                <span className="text-green-500">تم النسخ!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                <span>نسخ</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap text-foreground dark:text-dark-foreground">
                {children}
            </div>
        </div>
    );
};
