
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { interpretDream } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface DreamResult {
    logical: string;
    sarcastic: string;
    advice: string;
}

const DreamInterpreter: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'dream-interpreter')!;
    const [dream, setDream] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<DreamResult, string>(interpretDream);

    const handleSubmit = () => {
        if (!dream.trim()) return;
        execute(dream);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.dreamInterpreter.intro')}
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder={t('tools.dreamInterpreter.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!dream.trim()}>
                    {t('tools.dreamInterpreter.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={3} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={t('tools.dreamInterpreter.results.logical')} copyText={result?.logical}>{result?.logical}</ResultCard>
                    <ResultCard title={t('tools.dreamInterpreter.results.sarcastic')} copyText={result?.sarcastic}>{result?.sarcastic}</ResultCard>
                    <ResultCard title={t('tools.dreamInterpreter.results.advice')} copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default DreamInterpreter;