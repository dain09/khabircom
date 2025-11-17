
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMoodContent } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { Smile, Brain, Zap, Flame, Bomb } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const MOODS = [
    { id: 'laugh', text: 'عاوز أضحك', icon: <Smile size={20} /> },
    { id: 'wisdom', text: 'اديني حكمة', icon: <Brain size={20} /> },
    { id: 'motivation', text: 'شجعني شوية', icon: <Zap size={20} /> },
    { id: 'roast', text: 'حفّل عليا', icon: <Flame size={20} /> },
    { id: 'joke', text: 'نكتة بايخة', icon: <Bomb size={20} /> },
];

const MoodsGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'moods-generator')!;
    const [currentMood, setCurrentMood] = useState<string>('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generateMoodContent);

    const handleMoodClick = (moodId: string) => {
        const mood = MOODS.find(m => m.id === moodId);
        if (mood) {
            setCurrentMood(mood.text);
            execute(moodId);
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="مش عارف تقول إيه؟ اختار مودك من الأزرار دي، والخبير هيبعتلك حاجة تليق على حالتك بالظبط."
        >
            <p className="mb-4 text-center text-lg">إيه مودك دلوقتي؟</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {MOODS.map(mood => (
                    <Button
                        key={mood.id}
                        variant="secondary"
                        onClick={() => handleMoodClick(mood.id)}
                        isLoading={isLoading && currentMood === mood.text}
                        disabled={isLoading && currentMood !== mood.text}
                        className="flex-col h-28 text-center"
                    >
                        {mood.icon}
                        <span className="mt-2">{mood.text}</span>
                    </Button>
                ))}
            </div>
            {isLoading && !result && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`طلبك لـ "${currentMood}" جاهز`}>
                    <p className="text-lg">{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default MoodsGenerator;
