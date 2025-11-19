
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeNews } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface SummaryResult {
    serious_summary: string;
    comic_summary: string;
    advice: string;
}

const NewsSummarizer: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'news-summarizer')!;
    const [newsText, setNewsText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<SummaryResult, string>(summarizeNews);

    const handleSubmit = () => {
        if (!newsText.trim()) return;
        execute(newsText);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.newsSummarizer.intro')}
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder={t('tools.newsSummarizer.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-80"
                    rows={6}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!newsText.trim()}>
                    {t('tools.newsSummarizer.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={3} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={t('tools.newsSummarizer.results.serious')} copyText={result?.serious_summary}>{result?.serious_summary}</ResultCard>
                    <ResultCard title={t('tools.newsSummarizer.results.comic')} copyText={result?.comic_summary}>{result?.comic_summary}</ResultCard>
                    <ResultCard title={t('tools.newsSummarizer.results.advice')} copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default NewsSummarizer;