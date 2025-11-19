
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
import { AnalysisResult } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const VoiceAnalysis: React.FC = () => {
    const { t } = useLanguage();
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
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.voiceAnalysis.intro')}
        >
            <div className="space-y-4 text-center">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Mic className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            {audioFile ? audioFile.name : <span dangerouslySetInnerHTML={{ __html: t('tools.voiceAnalysis.prompt') }} />}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('tools.voiceAnalysis.supportedFormats')}</p>
                    </div>
                    <input ref={fileInputRef} id="audio-file" type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-center text-gray-500">{t('tools.voiceAnalysis.disclaimer')}</p>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!audioFile}>
                    {t('tools.voiceAnalysis.submit')}
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title={t('tools.voiceAnalysis.results.mood')} copyText={result.mood}>{result.mood}</ResultCard>
                    <ResultCard title={t('tools.voiceAnalysis.results.energy')} copyText={result.energy}>{result.energy}</ResultCard>
                    <ResultCard title={t('tools.voiceAnalysis.results.roast')} copyText={result.roast}>{result.roast}</ResultCard>
                    <ResultCard title={t('tools.voiceAnalysis.results.advice')} copyText={result.advice}>{result.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default VoiceAnalysis;