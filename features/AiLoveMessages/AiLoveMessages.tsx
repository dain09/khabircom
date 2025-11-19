
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateLoveMessage } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

const AiLoveMessages: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'ai-love-messages')!;
    
    const MESSAGE_TYPES = t('tools.aiLoveMessages.messageTypes', { returnObjects: true }) as { id: string, text: string }[];

    const [currentType, setCurrentType] = useState('');
    const [generatedType, setGeneratedType] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generateLoveMessage);

    const handleGenerate = (type: string) => {
        const messageType = MESSAGE_TYPES.find(t => t.id === type);
        if (messageType) {
            setCurrentType(messageType.text);
            setGeneratedType(messageType.text);
            execute(type);
        }
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.aiLoveMessages.intro')}
        >
            <p className="mb-4 text-center">{t('tools.aiLoveMessages.prompt')}</p>
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
                <ResultCard title={t('tools.aiLoveMessages.resultTitle', { type: generatedType || currentType })} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default AiLoveMessages;