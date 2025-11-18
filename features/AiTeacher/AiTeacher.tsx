

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { teachTopic } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const AiTeacher: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'ai-teacher')!;
    const [topic, setTopic] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(teachTopic);

    const handleSubmit = () => {
        if (!topic.trim()) return;
        execute(topic);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي موضوع أو مادة صعبة عليك، والأستاذ الفهلوي هيعملك خطة مذاكرة بسيطة ومضحكة عشان تنجز."
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="عايز تذاكر إيه؟ (مثال: مادة الفيزياء الكمية)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!topic.trim()}>
                    اعملي خطة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`خطة فهلوانية لمذاكرة: ${topic}`}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiTeacher;