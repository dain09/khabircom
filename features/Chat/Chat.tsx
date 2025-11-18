
import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, Plus, BrainCircuit, ArrowRight, ChevronDown, Square, Volume2, ZoomIn, ZoomOut, RotateCcw, Minus, FileText, Zap, Lightbulb, Sparkles, Flame, Puzzle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream, getMorningBriefing, generateConversationTitle } from '../../services/api/chat.service';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { useGemini } from '../../hooks/useGemini';
import { useTool } from '../../hooks/useTool';
import { TOOLS } from '../../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useMemory } from '../../hooks/useMemory';
import { usePersona } from '../../contexts/PersonaContext';
import { useToast } from '../../hooks/useToast';
import { Skeleton } from '../../components/ui/Skeleton';

type BriefingData = { greeting: string; suggestions: string[] };

// --- Components ---

const QuickToolButton: React.FC<{ toolId: string }> = ({ toolId }) => {
    const { setActiveToolId } = useTool();
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return null;
    const Icon = tool.icon;
    
    return (
        <button 
            onClick={() => setActiveToolId(toolId)}
            className="flex flex-col items-center justify-center gap-4 p-6 bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-3xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 active:scale-95 group w-full backdrop-blur-sm"
        >
            <div className={`p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} className={tool.color} />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">
                {tool.title.split(' ')[0]} {tool.title.split(' ')[1]}
            </span>
        </button>
    );
};

const DashboardScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const { memory } = useMemory();
    const { persona } = usePersona();

    // Match strict logic in service: Humor > 7 AND Verbosity < 5
    const isFahimkom = useMemo(() => persona.humor > 7 && persona.verbosity < 5, [persona]);
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';

    const context = useMemo(() => {
        const hour = new Date().getHours();
        return hour < 12 ? "الصباح" : hour < 18 ? "بعد الظهر" : "المساء";
    }, []);

    const { data: briefing, isLoading: isBriefingLoading, execute: fetchBriefing } = useGemini<BriefingData, void>(
        () => getMorningBriefing(memory, persona, context, botName)
    );
    
    useEffect(() => {
        fetchBriefing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memory, persona, botName]);

    const suggestions = briefing?.suggestions || [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة",
        "إيه رأيك في الذكاء الاصطناعي؟"
    ];
    
    const quickTools = ['image-generator', 'meme-generator', 'dialect-converter', 'ai-teacher'];

    const textShimmerClass = isFahimkom
        ? "bg-gradient-to-r from-orange-600 via-yellow-400 to-orange-600 dark:from-orange-400 dark:via-yellow-300 dark:to-orange-400 bg-[length:200%_auto] animate-shimmer"
        : "bg-gradient-to-r from-slate-800 via-blue-500 to-slate-800 dark:from-white dark:via-blue-400 dark:to-slate-200 bg-[length:200%_auto] animate-shimmer";

    const getSuggestionIcon = (index: number) => {
        const icons = [Lightbulb, Sparkles, Flame, Puzzle];
        const Icon = icons[index % icons.length];
        return <Icon size={18} className={isFahimkom ? "text-orange-500" : "text-blue-500"} />;
    };

    return (
        <div className="flex flex-col items-center justify-start pt-12 sm:pt-20 p-6 text-center relative z-0 w-full min-h-full pb-20">
            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
                {/* Logo / Avatar */}
                <div className="flex-shrink-0 w-28 h-28 mb-6 relative group cursor-default animate-zoomIn">
                    <div className={`absolute inset-0 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 ${isFahimkom ? 'bg-orange-500/40' : 'bg-blue-500/30'}`}></div>
                    
                    <div className={`relative w-full h-full bg-gradient-to-br rounded-full flex items-center justify-center shadow-2xl border-2 border-white dark:border-slate-700 ${
                        isFahimkom 
                        ? 'from-white to-orange-50 dark:from-slate-800 dark:to-slate-900' 
                        : 'from-white to-slate-100 dark:from-slate-800 dark:to-slate-900'
                    }`}>
                        {isFahimkom ? (
                            <Zap size={64} className="text-orange-500 drop-shadow-lg fill-orange-500/10" />
                        ) : (
                            <Bot size={64} className="text-primary drop-shadow-lg" />
                        )}
                    </div>
                </div>
                
                {/* Greeting */}
                {isBriefingLoading 
                    ? <Skeleton className="h-12 w-64 mb-4 rounded-xl mx-auto" />
                    : <h2 className={`text-3xl sm:text-5xl font-black mb-4 animate-slideInUp bg-clip-text text-transparent leading-tight px-4 py-2 ${textShimmerClass}`}>
                        {briefing?.greeting || `${botName} تحت أمرك`}
                    </h2>
                }
                
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-xl animate-slideInUp leading-relaxed font-medium">
                    {isFahimkom ? "جاهز يا وحش. عايز تخلص إيه النهاردة؟" : "مساعدك الشخصي الذكي. اسأل، اطلب، أو استخدم أدواتي السحرية."}
                </p>

                {/* Quick Tools Grid */}
                <div className="w-full mb-12 animate-slideInUp delay-100">
                    <h3 className="text-start text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 px-2 uppercase tracking-wider">أدوات شائعة</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickTools.map(id => <QuickToolButton key={id} toolId={id} />)}
                    </div>
                </div>

                {/* Suggestions */}
                <div className="w-full animate-slideInUp delay-200">
                    <h3 className="text-start text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 px-2 uppercase tracking-wider">جرب تسألني</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {isBriefingLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                            ))
                        ) : (
                            suggestions.map((s, i) => (
                                <button 
                                    key={s} 
                                    onClick={() => onSuggestionClick(s)}
                                    className={`group flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-start text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] backdrop-blur-sm`}
                                >
                                    <span className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-full group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">{getSuggestionIcon(i)}</span>
                                    <span className={`flex-1 text-slate-700 dark:text-slate-200`}>{s}</span>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors rtl:rotate-180" />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const content = message.parts[0].text;
    const isUser = message.role === 'user';
    const { setActiveToolId } = useTool();

    const fixMarkdownSpacing = (text: string) => {
        let res = text;
        // Fix: Ensure space BEFORE bold/italic if preceded by non-space (e.g., word**bold**)
        res = res.replace(/([^\s])(\*\*|__|\*|_)/g, '$1 $2');
        // Fix: Ensure space AFTER bold/italic if followed by non-space (e.g., **bold**word)
        res = res.replace(/(\*\*|__|\*|_)([^\s\.,،؛:?!])/g, '$1 $2');
        return res;
    };

    const processedContent = fixMarkdownSpacing(content);
    
    const ToolSuggestionCard: React.FC<{ toolId: string }> = ({ toolId }) => {
        const tool = TOOLS.find(t => t.id === toolId);
        if (!tool) return null;
        const Icon = tool.icon;
        return (
            <div 
                onClick={() => setActiveToolId(toolId)}
                className="group flex items-center gap-3 p-3 my-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-lg shadow-sm active:scale-[0.98] transition-all duration-300 w-full backdrop-blur-sm max-w-sm"
            >
                <div className={`flex-shrink-0 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 group-hover:bg-primary/10 transition-colors`}>
                    <Icon size={22} className={`${tool.color}`} />
                </div>
                <div className="flex-1 min-w-0 text-start">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary truncate transition-colors">
                        {tool.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        اضغط للتجربة الآن
                    </p>
                </div>
                <div className="flex-shrink-0 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-full group-hover:bg-primary group-hover:text-white transition-all rtl:rotate-180 opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-x-0 md:translate-x-2 md:group-hover:translate-x-0">
                    <ArrowRight size={16} />
                </div>
            </div>
        );
    };

    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const [isCopied, setIsCopied] = useState(false);
        const match = /language-(\w+)/.exec(className || '');
        const codeText = String(children).replace(/\n$/, '');
        
        const toolMatch = codeText.match(/^\[TOOL:(.*?)\]$/);
        if (toolMatch) {
            return <ToolSuggestionCard toolId={toolMatch[1]} />;
        }

        const handleCopy = () => {
            navigator.clipboard.writeText(codeText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return !inline ? (
            <div className="relative my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md dir-ltr text-left max-w-full group/code">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-2">{match?.[1] || 'code'}</span>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-colors opacity-100 md:opacity-0 md:group-hover/code:opacity-100"
                    >
                        {isCopied ? (
                            <><Check size={14} className="text-green-500"/> <span className="text-[10px] text-green-500 font-bold">منسوخ</span></>
                        ) : (
                            <><Copy size={14} className="text-slate-400"/> <span className="text-[10px] text-slate-400">نسخ</span></>
                        )}
                    </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar bg-[#1e1e1e]">
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match?.[1] || 'text'}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', lineHeight: '1.7', minWidth: '100%', background: 'transparent' }}
                        {...props}
                    >
                        {codeText}
                    </SyntaxHighlighter>
                </div>
            </div>
        ) : (
            <code className={`${isUser ? 'bg-white/20 text-white border-white/20' : 'bg-slate-100 dark:bg-slate-800 text-primary-dark dark:text-primary-foreground border-slate-200 dark:border-slate-700/50'} border rounded-md px-1.5 py-0.5 text-sm font-mono dir-ltr mx-0.5 whitespace-pre-wrap break-all`} {...props}>
                {children}
            </code>
        );
    };

    const parseChildrenForTools = (children: React.ReactNode) => {
        const childrenArray = React.Children.toArray(children);
        const newChildren: React.ReactNode[] = [];
        const toolRegex = /\[TOOL:(.*?)\]/g;

        childrenArray.forEach((child, childIndex) => {
            if (typeof child === 'string') {
                const parts = child.split(toolRegex);
                
                parts.forEach((part, index) => {
                    if (index % 2 === 1) {
                        const toolId = part.trim();
                        newChildren.push(
                            <div key={`${toolId}-${childIndex}-${index}`} className="block w-full my-3">
                                <ToolSuggestionCard toolId={toolId} />
                            </div>
                        );
                    } else if (part) { 
                        newChildren.push(part);
                    }
                });
            } else {
                newChildren.push(child);
            }
        });
        return { newChildren };
    };

    const CustomParagraph = ({ node, ...props }: any) => {
        const { newChildren } = parseChildrenForTools(props.children);
        const textColor = isUser ? 'text-white/95' : 'text-slate-800 dark:text-slate-200';
        return <p {...props} className={`mb-4 last:mb-0 leading-loose text-[15px] sm:text-base ${textColor}`}>{newChildren}</p>;
    };

    const CustomListItem = ({ node, ...props }: any) => {
        const { newChildren } = parseChildrenForTools(props.children);
        const textColor = isUser ? 'text-white/90' : 'text-slate-700 dark:text-slate-300';
        return <li {...props} className={`my-1.5 leading-loose ${textColor}`}>{newChildren}</li>;
    }

    // --- Table Components for Professional Look ---
    const CustomTable = ({ node, ...props }: any) => (
        <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table {...props} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm text-start" />
        </div>
    );
    
    const CustomThead = ({ node, ...props }: any) => (
        <thead {...props} className="bg-slate-50 dark:bg-slate-800/50" />
    );

    const CustomTh = ({ node, ...props }: any) => (
        <th {...props} className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-xs" />
    );

    const CustomTd = ({ node, ...props }: any) => (
        <td {...props} className="px-4 py-3 whitespace-pre-wrap text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800" />
    );


    return (
         <div className={`prose prose-base max-w-none break-words ${isUser ? 'prose-invert' : 'dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold'} font-sans`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: CustomParagraph,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-outside ps-5 mb-4 space-y-1 marker:font-bold marker:text-current" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-outside ps-5 mb-4 space-y-1 marker:text-current" />,
                    li: CustomListItem,
                    code: CodeBlock,
                    a: ({ node, ...props }) => <a {...props} className={`${isUser ? 'text-white underline decoration-white/50' : 'text-primary hover:text-primary-dark underline decoration-primary/30'} font-bold transition-colors`} target="_blank" rel="noopener noreferrer" />,
                    // Custom Table Components
                    table: CustomTable,
                    thead: CustomThead,
                    th: CustomTh,
                    td: CustomTd,
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

const Chat: React.FC = () => {
    const { activeConversation, addMessageToConversation, updateMessageInConversation, createNewConversation, activeConversationId, conversations, renameConversation } = useChat();
    const { memory, updateMemory } = useMemory();
    const { persona } = usePersona();
    const { addToast } = useToast();
    
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isResponding, setIsResponding] = useState(false);
    const [stoppedMessageId, setStoppedMessageId] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageZoom, setImageZoom] = useState(1);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stopStreamingRef = useRef(false);
    const streamingMessageIdRef = useRef<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Strict Match logic same as service layer
    const isFahimkom = useMemo(() => persona.humor > 7 && persona.verbosity < 5, [persona.humor, persona.verbosity]);
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';
    
    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [activeConversationId]);

    useLayoutEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            if (isNearBottom || isResponding) {
                container.scrollTo({ top: scrollHeight, behavior: isResponding ? 'auto' : 'smooth' });
            }
        }
    }, [isResponding, activeConversation?.messages.length, activeConversation?.messages[activeConversation?.messages.length-1]?.parts[0].text]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [activeConversationId]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleScrollToBottomButton = () => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }
    
    const handleCopy = (text: string, messageId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
        addToast('تم نسخ النص', { icon: <Check size={16}/>, duration: 1500 });
    };

    const cleanTextForTTS = (text: string) => {
        let clean = text.replace(/```[\s\S]*?```/g, " (يوجد كود برمجي هنا) ");
        clean = clean.replace(/`[^`]*`/g, "");
        clean = clean.replace(/\[TOOL:.*?\]/g, "");
        clean = clean.replace(/[*#_\[\]]/g, "");
        clean = clean.replace(/\(http.*?\)/g, "");
        return clean;
    };

    const handleSpeak = (text: string, messageId: string) => {
        if (speakingMessageId === messageId) {
            window.speechSynthesis.cancel();
            setSpeakingMessageId(null);
            return;
        }

        window.speechSynthesis.cancel();
        setSpeakingMessageId(messageId);

        const cleanedText = cleanTextForTTS(text);
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.includes('ar') && v.name.includes('Google')) ||
                            voices.find(v => v.lang.includes('ar'));

        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }
        
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        
        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);

        window.speechSynthesis.speak(utterance);
    };

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message, newMessage: { text: string, imageFile?: File }) => {
        setIsResponding(true);
        stopStreamingRef.current = false;
        
        if (window.innerWidth < 768) {
            inputRef.current?.blur();
        }

        const modelMessageId = uuidv4();
        streamingMessageIdRef.current = modelMessageId;
        const memoryCommandRegex = /\[SAVE_MEMORY:(.*?)\]/g;

        // Recalculate botName here based on CURRENT persona state
        const currentBotName = (persona.humor > 7 && persona.verbosity < 5) ? 'فهيمكم' : 'خبيركم';

        addMessageToConversation(convoId, {
            id: modelMessageId,
            role: 'model',
            parts: [{ text: '' }],
            timestamp: new Date().toISOString(),
            isStreaming: true,
            senderName: currentBotName,
        });

        let fullText = '';
        try {
            const currentConvo = conversations.find(c => c.id === convoId);
            const historyForApi = currentConvo?.messages
                .filter(m => m.id !== userMessage.id && m.id !== modelMessageId && !m.error)
                || [];

            // Pass the current persona object directly
            const stream = await generateChatResponseStream(historyForApi, newMessage, memory, persona);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    setStoppedMessageId(modelMessageId);
                    break;
                }
                
                let chunkText = chunk.text;
                
                if (chunkText) {
                    const matches = chunkText.matchAll(memoryCommandRegex);
                    for (const match of matches) {
                        try {
                            const jsonPayload = JSON.parse(match[1]);
                            if (jsonPayload.key && jsonPayload.value) {
                                updateMemory(jsonPayload.key, jsonPayload.value);
                                addToast(`💡 تم حفظ '${jsonPayload.key}' في الذاكرة!`, { icon: <BrainCircuit size={18} /> });
                            }
                        } catch (e) {
                            console.error("Failed to parse memory command:", e);
                        }
                    }
                    
                    const cleanChunkText = chunkText.replace(memoryCommandRegex, '').trim();
                    if (cleanChunkText) {
                        fullText += cleanChunkText;
                        updateMessageInConversation(convoId, modelMessageId, {
                            parts: [{ text: fullText }],
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Streaming Error:", error);
            const errorText = fullText 
                ? `${fullText}\n\n[عذراً، حصل خطأ أثناء إكمال الرد]` 
                : "[عذراً، حصل خطأ في التواصل مع الخبير. تأكد من إعدادات API Key.]";
            updateMessageInConversation(convoId, modelMessageId, {
                parts: [{ text: errorText }],
                error: true,
            });
        } finally {
            setIsResponding(false);
            updateMessageInConversation(convoId, modelMessageId, { isStreaming: false });
            stopStreamingRef.current = false;
            streamingMessageIdRef.current = null;
            if (window.innerWidth >= 768) {
                inputRef.current?.focus();
            }
        }
    }, [conversations, addMessageToConversation, updateMessageInConversation, memory, updateMemory, persona, addToast]);

    const handleSend = useCallback(async () => {
        if ((!input.trim() && !attachedFile) || isResponding) return;

        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);

        setStoppedMessageId(null);
        let currentConvoId = activeConversationId;
        
        const activeConvo = conversations.find(c => c.id === currentConvoId);

        if (!currentConvoId) {
            const newConvo = createNewConversation();
            currentConvoId = newConvo.id;
        }
        
        const isImage = attachedFile?.type.startsWith('image/');
        const isPdf = attachedFile?.type === 'application/pdf';
        
        let textToSend = input;
        if (isPdf || isImage) {
            textToSend = `[ملف مرفق: ${attachedFile?.name}]\n${input}`;
        }
        
        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: textToSend }],
            timestamp: new Date().toISOString(),
            imageUrl: isImage ? filePreview : undefined,
        };

        addMessageToConversation(currentConvoId, userMessage);
        
        const imageToSend = isImage ? attachedFile : undefined;

        setInput('');
        setAttachedFile(null);
        setFilePreview(null);
        
        const messagesHistory = activeConvo?.messages || [];
        const shouldGenerateTitle = messagesHistory.length >= 2 && messagesHistory.length <= 5 && activeConvo?.title === 'محادثة جديدة';
        
        if (shouldGenerateTitle) {
            const contextMessages = [...messagesHistory, userMessage];
            generateConversationTitle(contextMessages).then(smartTitle => {
                if (smartTitle && currentConvoId) {
                    renameConversation(currentConvoId, smartTitle);
                }
            }).catch(err => console.error("Failed to generate title:", err));
        }
        
        await streamModelResponse(currentConvoId, userMessage, { text: textToSend, imageFile: imageToSend });

    }, [input, isResponding, activeConversationId, createNewConversation, addMessageToConversation, streamModelResponse, attachedFile, filePreview, conversations, renameConversation]);

    const handleStop = () => {
        stopStreamingRef.current = true;
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);

        if (streamingMessageIdRef.current) {
            setStoppedMessageId(streamingMessageIdRef.current);
        }
        setIsResponding(false);
    };

    const handleContinue = useCallback(async () => {
        if (!activeConversationId || !stoppedMessageId) return;

        const convoId = activeConversationId;
        const messageToContinueId = stoppedMessageId;
        const conversation = conversations.find(c => c.id === convoId);
        if (!conversation) return;

        const messageToContinue = conversation.messages.find(m => m.id === messageToContinueId);
        if (!messageToContinue) return;
        
        const existingText = messageToContinue.parts[0].text;

        setIsResponding(true);
        setStoppedMessageId(null);
        stopStreamingRef.current = false;
        streamingMessageIdRef.current = messageToContinueId;
        
        let fullText = existingText;
        const memoryCommandRegex = /\[SAVE_MEMORY:(.*?)\]/g;

        try {
            updateMessageInConversation(convoId, messageToContinueId, { isStreaming: true });
            const historyForApi = conversation.messages;
            const stream = await generateChatResponseStream(historyForApi, { text: "أكمل من حيث توقفت." }, memory, persona);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    setStoppedMessageId(messageToContinueId); 
                    console.log("Streaming stopped by user during continuation.");
                    break;
                }
                let chunkText = chunk.text;
                if (chunkText) {
                     const matches = chunkText.matchAll(memoryCommandRegex);
                    for (const match of matches) {
                        try {
                            const jsonPayload = JSON.parse(match[1]);
                            if (jsonPayload.key && jsonPayload.value) {
                                updateMemory(jsonPayload.key, jsonPayload.value);
                                addToast(`💡 تم حفظ '${jsonPayload.key}' في الذاكرة!`, { icon: <BrainCircuit size={18} /> });
                            }
                        } catch (e) {
                            console.error("Failed to parse memory command:", e);
                        }
                    }
                    
                    const cleanChunkText = chunkText.replace(memoryCommandRegex, '').trim();

                    if(cleanChunkText) {
                        fullText += cleanChunkText;
                        updateMessageInConversation(convoId, messageToContinueId, {
                            parts: [{ text: fullText }],
                        });
                    }
                }
            }
        } catch (error) {
             console.error("Streaming Continuation Error:", error);
            const errorText = `${fullText}\n\n[عذراً، حصل خطأ أثناء إكمال الرد]`;
            updateMessageInConversation(convoId, messageToContinueId, {
                parts: [{ text: errorText }],
                error: true,
            });
        } finally {
            setIsResponding(false);
            updateMessageInConversation(convoId, messageToContinueId, { isStreaming: false });
            stopStreamingRef.current = false;
            streamingMessageIdRef.current = null;
            inputRef.current?.focus();
        }

    }, [activeConversationId, stoppedMessageId, conversations, updateMessageInConversation, memory, updateMemory, persona, addToast]);

    const handleRetry = useCallback((failedMessage: Message) => {
        if (!activeConversationId) return;
        
        const messages = activeConversation?.messages || [];
        const failedMessageIndex = messages.findIndex(m => m.id === failedMessage.id);
        const userMessage = messages[failedMessageIndex - 1];

        if (userMessage && userMessage.role === 'user') {
            updateMessageInConversation(activeConversationId, failedMessage.id, { error: false, parts: [{ text: '' }] });
            streamModelResponse(activeConversationId, userMessage, { text: userMessage.parts[0].text, imageFile: attachedFile || undefined });
        } else {
            console.error("Could not find user message to retry from.");
        }
    }, [activeConversationId, activeConversation?.messages, updateMessageInConversation, streamModelResponse, attachedFile]);


    const handleSuggestionClick = useCallback(async (prompt: string) => {
        let convoId = activeConversationId;
        if (!convoId || (activeConversation && activeConversation.messages.length > 0)) {
            const newConvo = createNewConversation();
            convoId = newConvo.id;
        }
        
        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: prompt }],
            timestamp: new Date().toISOString()
        };
        
        addMessageToConversation(convoId, userMessage);
        await streamModelResponse(convoId, userMessage, { text: prompt });
    }, [createNewConversation, addMessageToConversation, streamModelResponse, activeConversationId, activeConversation]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMenuOpen(false); // Close menu after selection
            setAttachedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };
    
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setAttachedFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setFilePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
                event.preventDefault();
                return;
            }
        }
        };
    
    const handleListen = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('للأسف، متصفحك مش بيدعم ميزة الإدخال الصوتي.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-EG';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => console.error('Speech recognition error:', event.error);
        
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                     setInput(prev => (prev ? prev + ' ' : '') + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognition.start();

    }, [isListening]);

    if (!activeConversation) {
        return (
            <div className="relative h-full overflow-y-auto w-full">
                 <div className="container mx-auto px-4 h-full">
                    <DashboardScreen onSuggestionClick={handleSuggestionClick} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-background/70 sm:dark:bg-dark-card/70 backdrop-blur-lg sm:border border-white/20 dark:border-slate-700/30 sm:rounded-xl sm:shadow-xl transition-all duration-300 relative">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 sm:p-6 relative scroll-smooth">
                 {activeConversation.messages.length === 0 ? (
                    <DashboardScreen onSuggestionClick={handleSuggestionClick} />
                ) : (
                    <div className="space-y-6 pb-4">
                        {activeConversation.messages.map((msg) => (
                             <div key={msg.id} className={`flex w-full animate-bubbleIn group ${
                                msg.role === 'user' ? 'justify-start' : 'justify-end'
                            }`}>
                                <div className={`flex items-end gap-2 sm:gap-3 max-w-[90%] ${
                                    msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                                }`}>
                                    
                                    <div className={`self-end flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                        msg.role === 'user' ? 'bg-primary/20' : 'bg-white dark:bg-slate-700'
                                    }`}>
                                        {msg.role === 'user'
                                            ? <User className="w-5 h-5 text-primary" />
                                            : <Bot className={`w-5 h-5 ${msg.senderName === 'فهيمكم' ? 'text-orange-500' : 'text-blue-500'} animate-bot-idle-bob`} />
                                        }
                                    </div>

                                    <div className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        {/* Sender Name Label */}
                                        {msg.role === 'model' && (
                                            <span className={`text-[10px] font-bold px-2 opacity-50 ${msg.senderName === 'فهيمكم' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {msg.senderName || 'خبيركم'}
                                            </span>
                                        )}

                                        {msg.role === 'user' && msg.imageUrl && (
                                            <div className="p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                                <button onClick={() => setSelectedImage(msg.imageUrl!)} className="focus:outline-none">
                                                    <img src={msg.imageUrl} alt="User upload" className="rounded-md max-w-xs max-h-64 object-contain cursor-zoom-in" />
                                                </button>
                                            </div>
                                        )}
                                        { (msg.parts[0].text || msg.role === 'model') && (
                                            <div className={`relative p-3 sm:p-4 rounded-2xl shadow-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                                : `bg-white dark:bg-slate-800 text-foreground dark:text-dark-foreground rounded-bl-none border border-slate-100 dark:border-slate-700 ${msg.error ? 'border-red-500/50 bg-red-50 dark:bg-red-900/10' : ''}`
                                            }`}>
                                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                                    {msg.role === 'model' && msg.isStreaming && !msg.parts[0].text && !msg.error ? (
                                                        <div className="flex gap-1.5 justify-center items-center px-2 py-1">
                                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
                                                        </div>
                                                    ) : (
                                                        <MessageContent message={msg} />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {msg.error && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-xs text-red-500 font-medium">فشل الرد</span>
                                                <button onClick={() => handleRetry(msg)} className="p-1 text-primary hover:bg-primary/10 rounded-full transition-colors" aria-label="إعادة المحاولة">
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {!msg.error && msg.id === stoppedMessageId && !isResponding && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">تم الإيقاف</span>
                                                <button onClick={handleContinue} className="p-1 text-primary hover:bg-primary/10 rounded-full transition-colors" aria-label="تكملة" title="إكمال الرد">
                                                    <Play size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === 'model' && !msg.error && msg.parts[0].text && (
                                        <div className="self-center flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                            <button 
                                                onClick={() => handleCopy(msg.parts[0].text, msg.id)}
                                                className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                                aria-label="نسخ الرد"
                                            >
                                                {copiedMessageId === msg.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => handleSpeak(msg.parts[0].text, msg.id)}
                                                className={`p-1.5 rounded-full transition-colors ${speakingMessageId === msg.id ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                aria-label={speakingMessageId === msg.id ? "إيقاف القراءة" : "قراءة الرد"}
                                            >
                                                {speakingMessageId === msg.id ? <Square size={12} fill="currentColor" /> : <Volume2 size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isResponding && activeConversation.messages.length > 0 && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
                             <div className="flex w-full animate-bubbleIn justify-end">
                                <div className="flex items-end gap-2 sm:gap-3 flex-row-reverse">
                                    <div className="self-end flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                        <Bot className="w-5 h-5 text-slate-400 animate-pulse" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 text-foreground dark:text-dark-foreground rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                         <div className="flex gap-1.5 justify-center items-center px-1">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="h-2" /> 
                    </div>
                 )}
            </div>
            
             {/* Scroll to Bottom Button */}
             <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button 
                    onClick={handleScrollToBottomButton}
                    className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <ChevronDown size={20} />
                </button>
            </div>

            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/80 dark:bg-dark-card/80 backdrop-blur-xl sm:rounded-b-xl z-30" onPaste={handlePaste}>
                 {attachedFile && (
                    <div className="relative w-fit max-w-full mb-2 p-2 pr-8 border rounded-lg border-primary/50 bg-primary/10 animate-slideInUp">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md shadow-sm"/>
                        ) : (
                            <div className='flex items-center gap-2 text-primary'>
                                <FileText size={24} />
                                <span className='text-sm font-medium truncate max-w-[150px]'>{attachedFile.name}</span>
                            </div>
                        )}
                        <button 
                            onClick={() => { setAttachedFile(null); setFilePreview(null); }}
                            className="absolute top-1 right-1 p-1 bg-white/80 text-red-500 rounded-full hover:bg-white shadow-sm transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                 <div className="flex items-end gap-2">
                    {/* Send / Stop Button */}
                    <div className="order-1 flex-shrink-0">
                        {isResponding ? (
                            <Button onClick={handleStop} className="p-3.5 bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white rounded-full shadow-md hover:shadow-lg" aria-label="إيقاف التوليد">
                                <StopCircle size={30} className="fill-current" />
                            </Button>
                        ) : (
                            <Button onClick={handleSend} disabled={(!input.trim() && !attachedFile)} className="p-3.5 rounded-full shadow-md hover:shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:shadow-none" aria-label="إرسال الرسالة">
                                <Send size={30} className={(!input.trim() && !attachedFile) ? "text-slate-300" : "fill-current"} strokeWidth={2.5} />
                            </Button>
                        )}
                    </div>
                    
                    {/* Input Area */}
                    <div className="order-2 flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[26px] shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-300 flex items-end overflow-hidden">
                        <AutoGrowTextarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    if (window.innerWidth >= 768) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }
                            }}
                            placeholder="اسأل خبيركم..."
                            className="w-full max-h-32 py-3.5 px-4 bg-transparent border-none focus:ring-0 resize-none text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed textarea-scrollbar"
                            aria-label="اكتب رسالتك هنا"
                        />
                    </div>

                     {/* Attachment Button */}
                    <div className='relative order-3 flex-shrink-0'>
                        <Button
                            variant="secondary"
                            className={`p-3.5 rounded-full shadow-sm hover:shadow-md transition-transform active:scale-95 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 ${isMenuOpen ? 'bg-slate-200 dark:bg-slate-700 rotate-45' : ''}`}
                            aria-label="خيارات إضافية"
                            onClick={() => setMenuOpen(prev => !prev)}
                        >
                            <Plus size={32} strokeWidth={2.5} />
                        </Button>
                        
                        {/* Attachment Menu */}
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                                <div 
                                    className="absolute bottom-full left-0 mb-3 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700 p-2 z-20 animate-slideInUp origin-bottom-left"
                                >
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                            <Paperclip size={18} />
                                        </div>
                                        <span>إرفاق ملف</span>
                                    </button>
                                    <button
                                        onClick={handleListen}
                                        className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                         <div className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                                            <Mic size={18} />
                                        </div>
                                        <span>{isListening ? 'جاري الاستماع...' : 'تسجيل صوتي'}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={selectedImage} 
                            alt="Full view" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-200"
                            style={{ transform: `scale(${imageZoom})` }}
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                            <button onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))} className="p-2 text-white hover:text-primary"><Minus size={20}/></button>
                            <button onClick={() => setImageZoom(1)} className="p-2 text-white hover:text-primary"><RotateCcw size={20}/></button>
                            <button onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))} className="p-2 text-white hover:text-primary"><Plus size={20}/></button>
                        </div>
                         <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-full"
                        >
                            <X size={30} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
