import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { explainCode } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';

interface CodeResult {
    explanation: string;
    breakdown: string;
    language: string;
}

const CodeExplainer: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'code-explainer')!;
    const [code, setCode] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<CodeResult, string>(explainCode);

    const handleSubmit = () => {
        if (!code.trim()) return;
        execute(code);
    };
    
    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline ? (
            <div className="relative my-2 rounded-md overflow-hidden bg-[#2d2d2d]">
                <SyntaxHighlighter
                    style={okaidia}
                    language={match?.[1] || 'text'}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="bg-slate-300 dark:bg-slate-600 rounded-sm px-1.5 py-0.5 text-sm font-mono" {...props}>
                {children}
            </code>
        );
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="عندك كود برمجي مش فاهمه؟ الصقه هنا والخبير هيفصصهولك حتة حتة وبلغة بسيطة تقدر تفهمها."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="الصق الكود هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-96 font-mono text-sm"
                    rows={8}
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!code.trim()}>
                    اشرحلي الكود
                </Button>
            </div>
            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard title="الخلاصة (الكود ده بيعمل إيه؟)" copyText={result?.explanation}>
                        <p>{result?.explanation}</p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400"><strong>اللغة المكتشفة:</strong> {result?.language}</p>
                    </ResultCard>
                    <ResultCard title="التفصيل (شرح خطوة بخطوة)" copyText={result?.breakdown}>
                         <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code: CodeBlock,
                                ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside" />,
                                ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside" />,
                            }}
                        >
                            {result?.breakdown}
                        </ReactMarkdown>
                    </ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default CodeExplainer;