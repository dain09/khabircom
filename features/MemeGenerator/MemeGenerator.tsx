
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateMemeSuggestions } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ImageUpload } from '../../components/ui/ImageUpload';

const MemeGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'meme-generator')!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    const { data: suggestions, isLoading, error, execute, reset } = useGemini<string[], File>(generateMemeSuggestions);

    const handleImageSelect = (file: File | null) => {
        setImageFile(file);
        reset();
        setSelectedSuggestion(null);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

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
            introText="ارفع صورة والخبير هيقترح عليك كابشنز تحولها لميم جامد."
        >
            <div className="space-y-4">
                
                {!suggestions && <ImageUpload onImageSelect={handleImageSelect} className="h-80" /> }

                {imageFile && !suggestions && !isLoading && (
                    <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile}>
                        اقترح ميمز
                    </Button>
                )}
                
                {isLoading && <Loader />}
                {error && <ErrorDisplay message={error} />}

                {imagePreview && suggestions && (
                    <div className="mt-6 space-y-4 animate-slideInUp">
                        {/* Meme Preview */}
                        <div className="relative w-full max-w-md mx-auto bg-black text-white text-center font-black text-2xl" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                            <p className="absolute top-2 left-2 right-2 p-1 break-words" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 4px #000' }}>
                                {selectedSuggestion}
                            </p>
                            <img src={imagePreview} alt="Meme preview" className="w-full" />
                        </div>
                        
                        {/* Suggestion Buttons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">اختار الكابشن:</h3>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setSelectedSuggestion(s)}
                                        className={`p-2 px-3 text-sm rounded-lg transition-colors ${selectedSuggestion === s ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Change Image Button */}
                        <Button onClick={() => handleImageSelect(null)} variant="secondary">
                            غيّر الصورة
                        </Button>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};

export default MemeGenerator;
