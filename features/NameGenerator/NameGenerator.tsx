
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateNames } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

const NameGenerator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'name-generator')!;
    const CATEGORIES = t('tools.nameGenerator.categories', { returnObjects: true }) as unknown as string[];

    const [category, setCategory] = useState('');
    const [submittedCategory, setSubmittedCategory] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string[], string>(generateNames);

    const handleSubmit = () => {
        if (!category.trim()) return;
        setSubmittedCategory(category);
        execute(category);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.nameGenerator.intro')}
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={t('tools.nameGenerator.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!category.trim()}>
                    {t('tools.nameGenerator.submit')}
                </Button>
                 <div className="text-center text-sm text-gray-500">
                    <p>{t('tools.nameGenerator.suggestionPrompt')}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className="p-1 px-3 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{c}</button>)}
                    </div>
                </div>
            </div>
            {isLoading && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={t('tools.nameGenerator.resultTitle', { category: submittedCategory })} copyText={result.join('\n')}>
                    <ul className="list-disc pe-5 space-y-2">
                        {result.map((name, index) => <li key={index}>{name}</li>)}
                    </ul>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default NameGenerator;
