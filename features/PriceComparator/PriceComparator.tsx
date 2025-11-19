
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { comparePrices } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { Tag, ExternalLink, TrendingDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../../hooks/useLanguage';

const PriceComparator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'price-comparator')!;
    const [product, setProduct] = useState('');
    const [submittedProduct, setSubmittedProduct] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<string, string>(comparePrices);

    const handleSubmit = () => {
        if (!product.trim()) return;
        setSubmittedProduct(product);
        execute(product);
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.priceComparator.intro')}
        >
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder={t('tools.priceComparator.placeholder')}
                        className="flex-1 p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary transition-colors shadow-inner"
                    />
                    <Button onClick={handleSubmit} isLoading={isLoading} disabled={!product.trim()}>
                        {t('tools.priceComparator.submit')}
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="mt-6 text-center">
                    <ResultCardSkeleton count={1} />
                    <p className="text-sm text-slate-500 animate-pulse mt-2">{t('tools.priceComparator.loading')}</p>
                </div>
            )}
            
            {error && <ErrorDisplay message={error} />}
            
            {result && (
                <div className="mt-6 p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 animate-slideInUpFade">
                    <div className="flex items-center gap-2 mb-4 text-rose-500 font-bold text-lg border-b border-slate-100 dark:border-slate-700 pb-2">
                        <Tag size={24} />
                        <h3>{t('tools.priceComparator.resultTitle', { product: submittedProduct })}</h3>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({ node, ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 no-underline hover:underline font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                                        {props.children} <ExternalLink size={12} />
                                    </a>
                                ),
                                table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-slate-700"><table {...props} className="min-w-[500px] w-full table-fixed" /></div>,
                                thead: ({ node, ...props }) => <thead {...props} className="bg-slate-50 dark:bg-slate-800" />,
                                th: ({ node, ...props }) => <th {...props} className="px-4 py-3 font-bold text-start uppercase tracking-wider text-right" style={{width: props.children?.toString().toLowerCase().includes('store') || props.children?.toString().toLowerCase().includes('متجر') ? '50%' : 'auto'}}/>,
                                td: ({ node, ...props }) => <td {...props} className="px-4 py-3 whitespace-nowrap border-t border-slate-100 dark:border-slate-700 text-right" />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500">
                        <TrendingDown size={14} />
                        <p>{t('tools.priceComparator.disclaimer')}</p>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default PriceComparator;
