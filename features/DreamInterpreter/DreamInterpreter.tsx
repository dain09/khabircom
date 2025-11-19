
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

interface DreamResult {
    logical: string;
    sarcastic: string;
    advice: string;
}

const DreamInterpreter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'dream-interpreter')!;
    const [dream, setDream] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<DreamResult, string>(interpretDream);

    const handleSubmit = () => {
        if (!dream.trim()) return;
        execute(dream);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="احكي حلمك بالتفصيل، والخبير هيفسرهولك 3 تفسيرات: واحد منطقي، وواحد ساخر، ومعاهم نصيحة غريبة."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder="احكيلي حلمك بالتفصيل..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!dream.trim()}>
                    فسّر الحلم
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={3} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="تفسير منطقي 🧠" copyText={result?.logical}>{result?.logical}</ResultCard>
                    <ResultCard title="تفسير فكاهي 😜" copyText={result?.sarcastic}>{result?.sarcastic}</ResultCard>
                    <ResultCard title="نصيحة غريبة 💡" copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default DreamInterpreter;
