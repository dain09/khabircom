
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
            introText="اكتب أي موضوع أو سؤال صعب عليك، والأستاذ الفهلوي هيشرحهولك بطريقة بسيطة ومضحكة بالأمثلة اللي تفهمها."
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="عايز تفهم إيه؟ (مثال: نظرية النسبية لأينشتاين)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!topic.trim()}>
                    اشرح يا خبير
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`شرح فكاهي ومبسط عن: ${topic}`}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiTeacher;