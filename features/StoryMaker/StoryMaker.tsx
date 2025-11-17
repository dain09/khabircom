
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateStory } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface StoryResult {
    funny_story: string;
    drama_story: string;
    kids_story: string;
}

interface StoryParams {
    name: string;
    place: string;
    idea: string;
}

const StoryMaker: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'story-maker')!;
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [idea, setIdea] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<StoryResult, StoryParams>(
        ({ name, place, idea }) => generateStory(name, place, idea)
    );

    const canSubmit = name.trim() && place.trim() && idea.trim();

    const handleSubmit = () => {
        if (!canSubmit) return;
        execute({ name, place, idea });
    };

    const baseInputClasses = "w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60";

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ادخل اسم بطل ومكان وفكرة بسيطة، وسيب الباقي على الخبير. هيألفلك 3 قصص مختلفة بنفس التفاصيل."
        >
            <div className="space-y-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم البطل" className={baseInputClasses}/>
                <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="المكان" className={baseInputClasses}/>
                <input type="text" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="فكرة بسيطة (مثال: لقى كنز)" className={baseInputClasses}/>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!canSubmit}>
                    اكتب القصة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="قصة كوميدية 😂">{result.funny_story}</ResultCard>
                    <ResultCard title="قصة دراما 😢">{result.drama_story}</ResultCard>
                    <ResultCard title="قصة أطفال 🧸">{result.kids_story}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default StoryMaker;