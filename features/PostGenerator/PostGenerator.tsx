
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generatePost } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

const PostGenerator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'post-generator')!;

    const POST_TYPES = t('tools.postGenerator.postTypes', { returnObjects: true }) as unknown as { id: string, text: string }[];

    const [currentType, setCurrentType] = useState('');
    const [generatedType, setGeneratedType] = useState(''); // Store the type of the result
    const { data: result, isLoading, error, execute } = useGemini<string, string>(generatePost);

    const handleGenerate = (type: string) => {
        const postType = POST_TYPES.find(t => t.id === type);
        if (postType) {
            setCurrentType(postType.text);
            setGeneratedType(postType.text);
            execute(type);
        }
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.postGenerator.intro')}
        >
            <p className="mb-4 text-center">{t('tools.postGenerator.prompt')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {POST_TYPES.map(type => (
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
                <ResultCard title={t('tools.postGenerator.resultTitle', { type: generatedType || currentType })} copyText={result}>
                    <p>{result}</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default PostGenerator;
