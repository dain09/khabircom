
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMoodContent } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface MoodResult {
    mood_name: string;
    mood_description: string;
    advice: string;
}

const MoodsGenerator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'moods-generator')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<MoodResult, string>(generateMoodContent);

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.moodsGenerator.intro')}
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('tools.moodsGenerator.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    {t('tools.moodsGenerator.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                 <div className="mt-6 space-y-4">
                    <ResultCard title={`${t('tools.moodsGenerator.results.moodDiagnosis')}: ${result.mood_name}`} copyText={result.mood_description}>
                        <p>{result.mood_description}</p>
                    </ResultCard>
                    <ResultCard title={t('tools.moodsGenerator.results.advice')} copyText={result.advice}>
                        <p>{result.advice}</p>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default MoodsGenerator;