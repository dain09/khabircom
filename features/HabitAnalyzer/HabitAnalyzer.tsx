import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { analyzeHabits } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface HabitResult {
    analysis: string;
    practical_advice: string;
    comic_advice: string;
}

const HabitAnalyzer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'habit-analyzer')!;
    const [answers, setAnswers] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<HabitResult, string>(analyzeHabits);

    const handleSubmit = () => {
        if (!answers.trim()) return;
        execute(answers);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="احكي عن عاداتك اليومية بصراحة، والخبير هيحلل شخصيتك ويديلك نصايح، منها الجد ومنها اللي يضحك."
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">احكيلي عن عاداتك اليومية عشان أحللهالك (مثال: بصحى متأخر، بقضي 5 ساعات على السوشيال ميديا، باكل أكل سريع...)</p>
                <AutoGrowTextarea
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                    placeholder="اكتب عن عاداتك اليومية هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-72"
                    rows={5}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!answers.trim()}>
                    حلل عاداتي
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="تحليل الشخصية 🧐">{result?.analysis}</ResultCard>
                    <ResultCard title="نصايح عملية 👍">{result?.practical_advice}</ResultCard>
                    <ResultCard title="نصايح كوميدية 😂">{result?.comic_advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default HabitAnalyzer;