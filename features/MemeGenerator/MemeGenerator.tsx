
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMemeSuggestions } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Download } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

const MemeGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'meme-generator')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedCaption, setSelectedCaption] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { data: suggestions, isLoading, error, execute } = useGemini<string[], File>(generateMemeSuggestions);

    const handleSubmit = async () => {
        if (!imageFile) return;
        setSelectedCaption('');
        const response = await execute(imageFile);
        if (response && response.length > 0) {
            setSelectedCaption(response[0]);
        }
    };
    
    const drawMeme = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !imageFile) return;

        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (!selectedCaption) return;

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = Math.max(2, canvas.width / 250);
            
            let fontSize = Math.max(30, canvas.width / 18);
            ctx.font = `bold ${fontSize}px 'Tajawal', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const words = selectedCaption.split(' ');
            let line = '';
            let y = 15;
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > canvas.width - 40 && n > 0) {
                    ctx.strokeText(line.trim(), canvas.width / 2, y);
                    ctx.fillText(line.trim(), canvas.width / 2, y);
                    line = words[n] + ' ';
                    y += fontSize * 1.2;
                } else {
                    line = testLine;
                }
            }
            ctx.strokeText(line.trim(), canvas.width / 2, y);
            ctx.fillText(line.trim(), canvas.width / 2, y);
        };
    }, [imageFile, selectedCaption]);

    useEffect(() => {
        drawMeme();
    }, [drawMeme]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع صورة، والخبير هيقترح عليك 5 كابشنات ميم تموت من الضحك. اختار اللي يعجبك ونزل الميم على طول."
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={setImageFile} />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                    ولّد ميمز
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {suggestions && suggestions.length > 0 && (
                <div className="mt-6">
                    <ResultCard title="الميم جاهز">
                        <canvas ref={canvasRef} className="w-full h-auto rounded-lg border dark:border-gray-700" />
                        <Button onClick={handleDownload} className="mt-4 w-full" icon={<Download />}>
                            نزّل الميم
                        </Button>
                    </ResultCard>
                    <ResultCard title="اقتراحات تانية">
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCaption(s)}
                                    className={`p-2 rounded-md text-sm transition-colors ${selectedCaption === s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default MemeGenerator;
