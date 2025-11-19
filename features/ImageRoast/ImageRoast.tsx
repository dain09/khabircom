
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { roastImage } from '../../services/api/image.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { useLanguage } from '../../hooks/useLanguage';

interface RoastResult {
    roast: string;
    analysis: string;
    advice: string;
}

const ImageRoast: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'image-roast')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { data: result, isLoading, error, execute } = useGemini<RoastResult, File>(roastImage);

    const handleSubmit = () => {
        if (!imageFile) return;
        execute(imageFile);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.imageRoast.intro')}
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={setImageFile} />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                    {t('tools.imageRoast.submit')}
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={3} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={t('tools.imageRoast.results.roast')} copyText={result?.roast}>{result?.roast}</ResultCard>
                    <ResultCard title={t('tools.imageRoast.results.analysis')} copyText={result?.analysis}>{result?.analysis}</ResultCard>
                    <ResultCard title={t('tools.imageRoast.results.advice')} copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default ImageRoast;