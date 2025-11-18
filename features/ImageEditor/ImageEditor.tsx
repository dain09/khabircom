
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { editImage } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { Download } from 'lucide-react';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface EditImageParams {
    imageFile: File;
    prompt: string;
}

const ImageEditor: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-editor')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const { data: editedImageUrl, isLoading, error, execute } = useGemini<string, EditImageParams>(editImage);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

    const handleImageSelect = (file: File | null) => {
        setImageFile(file);
        if (file) {
            setOriginalImageUrl(URL.createObjectURL(file));
        } else {
            setOriginalImageUrl(null);
        }
    };

    const handleSubmit = () => {
        if (!imageFile || !prompt.trim()) return;
        execute({ imageFile, prompt });
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع صورة واكتب تعديل عليها (مثال: 'ضيف قبعة مضحكة' أو 'غير الخلفية لشاطئ'). الخبير هينفذ طلبك بالذكاء الاصطناعي."
        >
            <div className="space-y-4">
                <ImageUpload onImageSelect={handleImageSelect} />
                <AutoGrowTextarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب التعديل اللي عايزه هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none"
                    rows={2}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile || !prompt.trim()}>
                    عدّل الصورة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {editedImageUrl && originalImageUrl && (
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-center font-semibold mb-2">الأصلية</h3>
                            <img src={originalImageUrl} alt="Original" className="rounded-lg w-full h-auto" />
                        </div>
                        <div>
                            <h3 className="text-center font-semibold mb-2">المعدّلة</h3>
                            <img src={editedImageUrl} alt="Edited" className="rounded-lg w-full h-auto" />
                        </div>
                    </div>
                    <a
                        href={editedImageUrl}
                        download={`edited_${prompt.slice(0, 15)}.png`}
                        className="w-full mt-4 block"
                    >
                        <Button className="w-full" icon={<Download />}>
                            نزّل الصورة المعدّلة
                        </Button>
                    </a>
                </div>
            )}
        </ToolContainer>
    );
};

export default ImageEditor;
