
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { convertDialect } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AlertTriangle, Check } from 'lucide-react';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';

const DIALECTS = [
    'مصري', 'صعيدي', 'اسكندراني', 'شامي (سوري/لبناني)', 'خليجي (سعودي/إماراتي)', 'سوداني',
    'درامي سينمائي', 'توكسيك كوميدي', 'لهجة أطفال'
];

interface ConvertParams {
    text: string;
    dialect: string;
}

const DialectConverter: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'dialect-converter')!;
    const [text, setText] = useState('');
    const [selectedDialect, setSelectedDialect] = useState(DIALECTS[0]);
    const [submittedDialect, setSubmittedDialect] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const { data: result, isLoading, error, execute } = useGemini<string, ConvertParams>(
        ({ text, dialect }) => convertDialect(text, dialect)
    );

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(() => setModalVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setModalVisible(false);
        }
    }, [showConfirmation]);

    const handleSubmit = () => {
        if (!text.trim()) return;
        if (selectedDialect === 'توكسيك كوميدي') {
            setShowConfirmation(true);
        } else {
            setSubmittedDialect(selectedDialect);
            execute({ text, dialect: selectedDialect });
        }
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        setSubmittedDialect(selectedDialect);
        execute({ text, dialect: selectedDialect });
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب أي جملة واختار اللهجة اللي عايز تحولها ليها. الخبير هيترجمهالك بطريقة طبيعية ومظبوطة."
        >
            <div className="space-y-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="اكتب النص الأصلي هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 min-h-[120px] resize-none"
                />
                <div>
                    <label className="block mb-3 text-sm font-medium">اختار اللهجة:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DIALECTS.map(dialect => (
                            <button
                                key={dialect}
                                onClick={() => setSelectedDialect(dialect)}
                                className={`flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                                    selectedDialect === dialect
                                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-800'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                {selectedDialect === dialect && <Check size={16} />}
                                {dialect}
                            </button>
                        ))}
                    </div>
                </div>

                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()}>
                    ترجم
                </Button>
            </div>

            {isLoading && <ResultCardSkeleton />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard title={`النص باللهجة (${submittedDialect || selectedDialect})`} copyText={result}>
                    <p className="text-lg leading-relaxed">{result}</p>
                </ResultCard>
            )}

            {/* Confirmation Modal for Toxic Comedy */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div 
                        className={`bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-300 ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">تحذير: محتوى توكسيك ☢️</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                اللهجة "التوكسيك كوميدي" ممكن تطلع كلام ساخر جداً أو "قصف جبهات". إحنا بنهزر، بس وجب التنويه!
                            </p>
                            <div className="flex gap-3 w-full">
                                <Button variant="secondary" onClick={() => setShowConfirmation(false)} className="flex-1">
                                    خلاص بلاش
                                </Button>
                                <Button onClick={handleConfirm} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500">
                                    أنا قدها
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default DialectConverter;
