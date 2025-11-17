
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeNews } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface SummaryResult {
    serious_summary: string;
    comic_summary: string;
    advice: string;
}

const NewsSummarizer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'news-summarizer')!;
    const [newsText, setNewsText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<SummaryResult, string>(summarizeNews);

    const handleSubmit = () => {
        if (!newsText.trim()) return;
        execute(newsText);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="عندك خبر طويل ومكسل تقراه؟ الصق الخبر هنا والخبير هيديلك الزبدة بطريقتين: مرة بجد ومرة بهزار."
        >
            <div className="space-y-4">
                <textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="حط لينك الخبر أو الخبر نفسه هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 min-h-[150px] resize-none"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!newsText.trim()}>
                    لخّص الخبر
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="الملخص الجد 🧐">{result.serious_summary}</ResultCard>
                    <ResultCard title="الملخص الكوميدي 😂">{result.comic_summary}</ResultCard>
                    <ResultCard title="نصيحة الخبير 💡">{result.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default NewsSummarizer;