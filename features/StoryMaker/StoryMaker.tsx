
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateStory } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface StoryResult {
    funny_story: string;
}

const StoryMaker: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'story-maker')!;
    const [scenario, setScenario] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<StoryResult, string>(generateStory);

    const canSubmit = scenario.trim();

    const handleSubmit = () => {
        if (!canSubmit) return;
        execute(scenario);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.storyMaker.intro')}
        >
            <div className="space-y-4">
                 <AutoGrowTextarea
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder={t('tools.storyMaker.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!canSubmit}>
                    {t('tools.storyMaker.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={t('tools.storyMaker.resultTitle')} copyText={result.funny_story}>{result?.funny_story}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default StoryMaker;