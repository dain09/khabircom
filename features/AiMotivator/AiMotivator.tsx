
import React, { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { getGrumpyMotivation } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { RefreshCw } from 'lucide-react';

const AiMotivator: React.FC = () => {
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
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="محتاج دفعة بس مش من النوع التقليدي؟ الخبير هيديلك تحفيز على طريقته الخاصة... جهز نفسك."
        >
            <div className="text-center p-4 flex flex-col justify-center items-center h-full">
                {isLoading && <Loader />}
                {error && <ErrorDisplay message={error} />}
                {motivation && (
                    <ResultCard title="جرعة تحفيز على السريع">
                        <blockquote className="text-2xl lg:text-3xl font-bold italic text-center leading-relaxed">
                           "{motivation}"
                        </blockquote>
                    </ResultCard>
                )}
                <Button onClick={() => execute()} isLoading={isLoading} className="mt-8" icon={<RefreshCw />}>
                    اديني واحدة تانية
                </Button>
            </div>
        </ToolContainer>
    );
};

export default AiMotivator;
