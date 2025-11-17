
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeLongText } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

interface SummaryResult {
    short_summary: string;
    funny_summary: string;
    key_points: string[];
}

const PdfSummarizer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'pdf-summarizer')!;
    const [text, setText] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<SummaryResult, string>(summarizeLongText);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setText(`(تم اختيار ملف ${file.name}. استخراج النص من PDF مش شغال في النسخة دي، بس ممكن تلصق النص بنفسك.)`);
        }
    };

    const handleSubmit = () => {
        if (!text.trim()) return;
        execute(text);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="لو عندك ملف PDF أو نص طويل، الصق محتواه هنا عشان الخبير يلخصهولك ويديلك أهم النقط اللي فيه."
        >
            <div className="space-y-4">
                <div className="flex justify-center p-4 border border-dashed rounded-lg border-white/30 dark:border-slate-700/50">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"/>
                </div>
                <p className="text-center text-gray-500 font-semibold">أو</p>
                <AutoGrowTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="الصق النص الطويل هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-96"
                    rows={8}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    لخّص
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="ملخص سريع">{result.short_summary}</ResultCard>
                    <ResultCard title="ملخص كوميدي">{result.funny_summary}</ResultCard>
                    <ResultCard title="أهم النقط (الزبدة)">
                        <ul className="list-disc pe-5 space-y-2">
                            {result.key_points.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default PdfSummarizer;