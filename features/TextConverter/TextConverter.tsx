
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { convertTextToStyle } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface ConvertParams {
    text: string;
    style: string;
}

const TextConverter: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'text-converter')!;

    const STYLES = t('tools.textConverter.styles', { returnObjects: true }) as unknown as { id: string, text: string }[];

    const [text, setText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const [submittedStyle, setSubmittedStyle] = useState<string | null>(null);
    const { data: result, isLoading, error, execute } = useGemini<string, ConvertParams>(
        ({ text, style }) => convertTextToStyle(text, style)
    );

    const handleSubmit = () => {
        if (!text.trim()) return;
        setSubmittedStyle(selectedStyle);
        execute({ text, style: selectedStyle });
    };

    const baseInputClasses = "w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60";

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.textConverter.intro')}
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('tools.textConverter.placeholder')}
                    className={`${baseInputClasses} resize-none max-h-72`}
                    rows={5}
                />
                <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className={`${baseInputClasses} appearance-none`}
                >
                    {STYLES.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-slate-800 text-foreground dark:text-dark-foreground">{s.text}</option>)}
                </select>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    {t('tools.textConverter.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={t('tools.textConverter.resultTitle', { style: STYLES.find(s=>s.id === (submittedStyle || selectedStyle))?.text })} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default TextConverter;
