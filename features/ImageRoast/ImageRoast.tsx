
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { roastImage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface RoastResult {
    roast: string;
    analysis: string;
    advice: string;
}

const ImageRoast: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-roast')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { data: result, isLoading, error, execute } = useGemini<RoastResult, File>(roastImage);

    const handleSubmit = () => {
        if (!imageFile) return;
        execute(imageFile);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع أي صورة، سواء كانت صورتك، أوضتك، أو لبسك، وشوف الخبير هيقول عليها إيه. جهز نفسك لرأي صريح يضحك."
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={setImageFile} />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                    حلل الصورة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="التحفيل على الصورة 📸🔥">{result.roast}</ResultCard>
                    <ResultCard title="تحليل واقعي 🧐">{result.analysis}</ResultCard>
                    <ResultCard title="نصيحة للتطوير ✨">{result.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default ImageRoast;
