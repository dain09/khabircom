

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { convertTextToStyle } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

const STYLES = [
    { id: 'formal', text: 'فصحى رسمية' },
    { id: 'comic_fusha', text: 'فصحى كوميدية' },
    { id: 'poet', text: 'أسلوب شاعر' },
    { id: 'sheikh', text: 'أسلوب شيخ بينصح' },
    { id: 'know_it_all', text: 'أسلوب فهلوي' },
];

interface ConvertParams {
    text: string;
    style: string;
}

const TextConverter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'text-converter')!;
    const [text, setText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const { data: result, isLoading, error, execute } = useGemini<string, ConvertParams>(
        ({ text, style }) => convertTextToStyle(text, style)
    );

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute({ text, style: selectedStyle });
    };

    const baseInputClasses = "w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60";

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي نص واختار الأسلوب اللي عايزه، شوف الخبير هيحول كلامك العادي لكلام فخم أو كوميدي إزاي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب النص الأصلي هنا..."
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
                    حوّل
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`النص بأسلوب: ${STYLES.find(s=>s.id === selectedStyle)?.text}`} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default TextConverter;
