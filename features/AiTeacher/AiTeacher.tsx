
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { teachTopic } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

const AiTeacher: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'ai-teacher')!;
    const [topic, setTopic] = useState('');
    const [submittedTopic, setSubmittedTopic] = useState('');

    const { data: result, isLoading, error, execute } = useGemini<string, string>(teachTopic);

    const handleSubmit = () => {
        if (!topic.trim()) return;
        setSubmittedTopic(topic);
        execute(topic);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.aiTeacher.intro')}
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('tools.aiTeacher.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!topic.trim()}>
                    {t('tools.aiTeacher.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={t('tools.aiTeacher.resultTitle', { topic: submittedTopic || topic })} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiTeacher;