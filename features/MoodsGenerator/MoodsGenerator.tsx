
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMoodContent } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface MoodResult {
    mood_name: string;
    mood_description: string;
    advice: string;
}

const MoodsGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'moods-generator')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<MoodResult, string>(generateMoodContent);

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
            introText="فضفض أو اكتب أي حاجة شاغلة بالك، والخبير هيحلل مودك ويقولك تشخيص كوميدي ونصيحة على الماشي."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب اللي حاسس بيه هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    حلل مودي
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                 <div className="mt-6 space-y-4">
                    <ResultCard title={`تشخيص المود: ${result.mood_name}`} copyText={result.mood_description}>
                        <p>{result.mood_description}</p>
                    </ResultCard>
                    <ResultCard title="نصيحة الخبير 💡" copyText={result.advice}>
                        <p>{result.advice}</p>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default MoodsGenerator;
