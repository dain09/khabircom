
import React, { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { getGrumpyMotivation } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { RefreshCw } from 'lucide-react';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

const AiMotivator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'ai-motivator')!;
    const { data: motivation, isLoading, error, execute } = useGemini<string, void>(
        () => getGrumpyMotivation()
    );

    useEffect(() => {
        execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.aiMotivator.intro')}
        >
            <div className="text-center p-4 flex flex-col justify-center items-center h-full">
                {isLoading && <ResultCardSkeleton />}
                {error && <ErrorDisplay message={error} />}
                {motivation && (
                    <ResultCard title={t('tools.aiMotivator.resultTitle')} copyText={motivation}>
                        <blockquote className="text-2xl lg:text-3xl font-bold italic text-center leading-relaxed">
                           "{motivation}"
                        </blockquote>
                    </ResultCard>
                )}
                <Button onClick={() => execute()} isLoading={isLoading} className="mt-8" icon={<RefreshCw />}>
                    {t('tools.aiMotivator.submit')}
                </Button>
            </div>
        </ToolContainer>
    );
};

export default AiMotivator;