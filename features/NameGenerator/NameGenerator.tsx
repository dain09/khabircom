

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateNames } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const CATEGORIES = [
    'تطبيق موبايل', 'صفحة فيسبوك كوميدية', 'قناة يوتيوب طبخ', 'لعبة استراتيجية', 'بودكاست'
];

const NameGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'name-generator')!;
    const [category, setCategory] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string[], string>(generateNames);

    const handleSubmit = () => {
        if (!category.trim()) return;
        execute(category);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="قولنا بس إنت بتفكر في مشروع إيه، والخبير هيقترح عليك قايمة بأسماء جديدة ومبتكرة."
        >
            <div className="space-y-4">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="اكتب نوع المشروع (مثال: قناة يوتيوب)"
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!category.trim()}>
                    اقترح أسماء
                </Button>
                 <div className="text-center text-sm text-gray-500">
                    <p>أو جرب حاجة من دول:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className="p-1 px-3 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{c}</button>)}
                    </div>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`أسماء مقترحة لـ "${category}"`} copyText={result.join('\n')}>
                    <ul className="list-disc pe-5 space-y-2">
                        {result.map((name, index) => <li key={index}>{name}</li>)}
                    </ul>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default NameGenerator;
