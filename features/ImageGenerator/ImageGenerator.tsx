
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateImage } from '../../services/api/image.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

const ImageGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-generator')!;
    const [prompt, setPrompt] = useState('');
    const { data: imageUrl, isLoading, error, execute } = useGemini<string, string>(generateImage);

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        execute(prompt);
    };

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `khabirkom-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="تخيل أي مشهد في دماغك واكتبه هنا بالتفصيل. الخبير هيستخدم قدراته الفنية عشان يرسمهولك في ثواني."
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">وصف الصورة (كل ما يكون مفصل، النتيجة أحلى)</label>
                    <AutoGrowTextarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="مثال: قطة فرعونية لابسة نظارة شمسية وقاعدة على عرش من الذهب في الفضاء..."
                        className="w-full p-4 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none min-h-[100px]"
                        rows={3}
                    />
                    <Button 
                        onClick={handleSubmit} 
                        isLoading={isLoading} 
                        disabled={!prompt.trim()} 
                        className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white"
                        icon={<Sparkles size={20} />}
                    >
                        ارسم يا فنان
                    </Button>
                </div>

                {error && <ErrorDisplay message={error} />}

                <div className="mt-8 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl min-h-[300px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden transition-all duration-500">
                    {isLoading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
                            <Skeleton className="w-64 h-64 rounded-lg" />
                            <p className="text-sm text-slate-500 animate-pulse">جاري الرسم... بياخد شوية وقت عشان يطلع تحفة</p>
                        </div>
                    ) : imageUrl ? (
                        <div className="relative w-full flex flex-col items-center animate-zoomIn">
                            <img 
                                src={imageUrl} 
                                alt="Generated Art" 
                                className="max-w-full max-h-[500px] rounded-lg shadow-2xl mb-4 border-4 border-white dark:border-slate-700" 
                            />
                            <Button 
                                onClick={handleDownload} 
                                variant="secondary"
                                icon={<Download size={18} />}
                            >
                                تحميل الصورة
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                            <p>الصورة هتظهر هنا</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolContainer>
    );
};

export default ImageGenerator;
