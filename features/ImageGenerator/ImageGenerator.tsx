
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateImage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { Download } from 'lucide-react';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

const ImageGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-generator')!;
    const [prompt, setPrompt] = useState('');
    const { data: imageUrl, isLoading, error, execute } = useGemini<string, string>(generateImage);

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        execute(prompt);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي وصف يجي في خيالك، والخبير هيحولهولك لصورة فنية. كل ما كان وصفك أدق، كل ما كانت الصورة أحسن."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: قطة لابسة نظارة شمس وقاعدة على الشط..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-64"
                    rows={4}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!prompt.trim()}>
                    ولّد الصورة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {imageUrl && (
                <ResultCard title="الصورة جاهزة!">
                    <div className="flex flex-col items-center gap-4">
                        <img src={imageUrl} alt={prompt} className="rounded-lg max-w-full h-auto border dark:border-gray-700 shadow-lg" />
                        <a
                            href={imageUrl}
                            download={`${prompt.slice(0, 20).replace(/ /g, '_')}.png`}
                            className="w-full"
                        >
                            <Button className="w-full" icon={<Download />}>
                                نزّل الصورة
                            </Button>
                        </a>
                    </div>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default ImageGenerator;