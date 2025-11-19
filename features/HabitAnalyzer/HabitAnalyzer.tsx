
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { analyzeHabits } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface TalentResult {
    talent_name: string;
    talent_description: string;
    advice: string;
}

const HabitAnalyzer: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'habit-analyzer')!;
    const [answers, setAnswers] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<TalentResult, string>(analyzeHabits);

    const handleSubmit = () => {
        if (!answers.trim()) return;
        execute(answers);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.habitAnalyzer.intro')}
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('tools.habitAnalyzer.prompt')}</p>
                <AutoGrowTextarea
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                    placeholder={t('tools.habitAnalyzer.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!answers.trim()}>
                    {t('tools.habitAnalyzer.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={`${t('tools.habitAnalyzer.results.talent')}: ${result?.talent_name}`} copyText={result?.talent_description}>
                        <p>{result?.talent_description}</p>
                    </ResultCard>
                    <ResultCard title={t('tools.habitAnalyzer.results.advice')} copyText={result?.advice}>
                        <p>{result?.advice}</p>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default HabitAnalyzer;