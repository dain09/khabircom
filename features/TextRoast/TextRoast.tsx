
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { roastText } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface RoastResult {
    roast: string;
    corrected: string;
    analysis: string;
    advice: string;
}

const TextRoast: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'text-roast')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<RoastResult, string>(roastText);

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي حاجة تيجي في بالك، والخبير هيحللها لك بطريقته الخاصة: تحفيل، تصحيح، وشوية نصايح على الماشي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب الجملة اللي عايز تحفّل عليها هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    ابعت
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="التحفيل 🔥" copyText={result?.roast}>{result?.roast}</ResultCard>
                    <ResultCard title="التصحيح اللغوي 🤓" copyText={result?.corrected}>{result?.corrected}</ResultCard>
                    <ResultCard title="تحليل نفسي على الماشي 🤔" copyText={result?.analysis}>{result?.analysis}</ResultCard>
                    <ResultCard title="نصيحة الخبير 💡" copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default TextRoast;
