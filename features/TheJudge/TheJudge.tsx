
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { judgeDispute } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { Gavel, Swords, Scale } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface VerdictResult {
    guilty: string;
    verdict: string;
    punishment: string;
    advice: string;
}

const TheJudge: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'the-judge')!;
    
    const [party1, setParty1] = useState('');
    const [party2, setParty2] = useState('');
    const [problem, setProblem] = useState('');
    
    const { data: result, isLoading, error, execute } = useGemini<VerdictResult, { party1: string, party2: string, problem: string }>(judgeDispute);

    const handleSubmit = () => {
        if (!party1.trim() || !party2.trim() || !problem.trim()) return;
        execute({ party1, party2, problem });
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.theJudge.intro')}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">{t('tools.theJudge.party1Placeholder')}</label>
                        <input
                            type="text"
                            value={party1}
                            onChange={(e) => setParty1(e.target.value)}
                            className="w-full p-3 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">{t('tools.theJudge.party2Placeholder')}</label>
                        <input
                            type="text"
                            value={party2}
                            onChange={(e) => setParty2(e.target.value)}
                            className="w-full p-3 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-500">{t('tools.theJudge.problemPlaceholder')}</label>
                    <AutoGrowTextarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none resize-none min-h-[120px]"
                        rows={5}
                    />
                </div>

                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!party1.trim() || !party2.trim() || !problem.trim()} icon={<Gavel />}>
                    {t('tools.theJudge.submit')}
                </Button>
            </div>

            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            
            {result && (
                <div className="mt-8 space-y-6 animate-slideInUpFade">
                    <div className="text-center p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <Swords className="w-12 h-12 mx-auto text-red-500 mb-2" />
                        <h3 className="text-xl font-black text-red-600 dark:text-red-400">{t('tools.theJudge.results.guilty')}</h3>
                        <p className="text-2xl font-bold mt-2">{result.guilty}</p>
                    </div>

                    <ResultCard title={t('tools.theJudge.results.verdict')} copyText={result.verdict}>
                        <p className="text-lg leading-relaxed">{result.verdict}</p>
                    </ResultCard>
                    
                    <ResultCard title={t('tools.theJudge.results.punishment')} copyText={result.punishment}>
                         <div className="flex items-start gap-3">
                            <Scale className="w-6 h-6 text-slate-500 mt-1 flex-shrink-0" />
                            <p className="text-lg font-medium">{result.punishment}</p>
                         </div>
                    </ResultCard>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 rounded-lg">
                        <p className="font-bold text-blue-800 dark:text-blue-200">{t('tools.theJudge.results.advice')}</p>
                        <p className="mt-1 text-blue-700 dark:text-blue-300">{result.advice}</p>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default TheJudge;
