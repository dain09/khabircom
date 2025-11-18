import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { analyzeVoice } from '../../services/api/text.service';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { Mic } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
// Fix: Import AnalysisResult from shared types file.
import { AnalysisResult } from '../../types';

const VoiceAnalysis: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'voice-analysis')!;
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: result, isLoading, error, execute } = useGemini<AnalysisResult, File>(analyzeVoice);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioFile(file);
        }
    };

    const handleSubmit = () => {
        if (!audioFile) return;
        // NOTE: This uses a mock service function.
        execute(audioFile);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="ارفع تسجيل صوتي والخبير هيحلل مودك ومستوى طاقتك من نبرة صوتك. (ملحوظة: دي ميزة تجريبية والنتائج للمرح فقط)."
        >
            <div className="space-y-4 text-center">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Mic className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            {audioFile ? audioFile.name : <><span className="font-semibold">ارفع ملف صوتي</span> أو اسحبه هنا</>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, OGG</p>
                    </div>
                    <input ref={fileInputRef} id="audio-file" type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-center text-gray-500">ملحوظة: الميزة دي لسه تحت التجربة والتحليل هنا صوري مش حقيقي.</p>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!audioFile}>
                    حلل الصوت
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="المود بتاعك 🎭" copyText={result.mood}>{result.mood}</ResultCard>
                    <ResultCard title="مستوى الطاقة ⚡️" copyText={result.energy}>{result.energy}</ResultCard>
                    <ResultCard title="تحفيل على الصوت 🎤" copyText={result.roast}>{result.roast}</ResultCard>
                    <ResultCard title="نصيحة الخبير 🎧" copyText={result.advice}>{result.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default VoiceAnalysis;