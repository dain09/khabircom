import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { convertDialect } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AlertTriangle, Check } from 'lucide-react';

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
            execute({ text, dialect: selectedDialect });
        }
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
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
                                        ? 'bg-primary text-primary-foreground shadow-md ring-primary'
                                        : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                {dialect}
                                {selectedDialect === dialect && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!text.trim()} className="w-full">
                    ترجم
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <ResultCard 
                    title={`النص باللهجة (${selectedDialect})`}
                    copyText={result}
                >
                    <p>{result}</p>
                </ResultCard>
            )}

            {showConfirmation && (
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setShowConfirmation(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    <div 
                        className={`bg-background dark:bg-dark-card rounded-lg shadow-2xl p-6 max-w-sm w-full text-center transform transition-all duration-300 ease-in-out ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">متأكد؟</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            اللهجة دي ممكن تطلع كلام 'توكسيك' على سبيل الهزار والكوميديا. هل أنت موافق تكمل؟
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setShowConfirmation(false)} variant="secondary">
                                لأ، الغي
                            </Button>
                            <Button onClick={handleConfirm} className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white">
                                أيوه، كمل
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default DialectConverter;