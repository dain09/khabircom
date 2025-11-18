import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateLoveMessage } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';

const MESSAGE_TYPES = [
    { id: 'romantic', text: 'رومانسية' },
    { id: 'funny', text: 'كوميدية' },
    { id: 'shy', text: 'واحد مكسوف' },
    { id: 'toxic', text: 'توكسيك خفيفة' },
    { id: 'apology', text: 'صلح واعتذار' },
    { id: 'witty_roast', text: 'عتاب رخمة' },
];

const AiLoveMessages: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'ai-love-messages')!;
    const [currentType, setCurrentType] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generateLoveMessage);

    const handleGenerate = (type: string) => {
        const messageType = MESSAGE_TYPES.find(t => t.id === type);
        if (messageType) {
            setCurrentType(messageType.text);
            execute(type);
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="مش عارف تعبر عن مشاعرك؟ اختار نوع الرسالة اللي محتاجها، والخبير هيكتبهالك بأسلوب مناسب."
        >
            <p className="mb-4 text-center">اختار نوع الرسالة اللي على مزاجك:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MESSAGE_TYPES.map(type => (
                    <Button
                        key={type.id}
                        variant="secondary"
                        onClick={() => handleGenerate(type.id)}
                        isLoading={isLoading && currentType === type.text}
                        disabled={isLoading && currentType !== type.text}
                    >
                        {type.text}
                    </Button>
                ))}
            </div>
            {isLoading && !result && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`رسالة ${currentType}`} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiLoveMessages;