
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, FileText, Plus, BrainCircuit, ArrowRight, ChevronDown, Sparkles, Terminal, Volume2, Square, ZoomIn, ZoomOut, RotateCcw, Minus, Image as ImageIcon, Languages, Smile, GraduationCap, Zap } from 'lucide-react';
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

const ToolSuggestionCard: React.FC<{ toolId: string }> = ({ toolId }) => {
    const { setActiveToolId } = useTool();
    const tool = TOOLS.find(t => t.id === toolId);

    if (!tool) return null;

    const Icon = tool.icon;

    return (
        <div 
            onClick={() => setActiveToolId(toolId)}
            className="group flex items-center gap-3 p-3 my-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-lg shadow-sm active:scale-[0.98] transition-all duration-300 w-full backdrop-blur-sm"
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
            <div className="flex-shrink-0 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-full group-hover:bg-primary group-hover:text-white transition-all rtl:rotate-180 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight size={16} />
            </div>
        </div>
    );
};

const QuickToolButton: React.FC<{ toolId: string }> = ({ toolId }) => {
    const { setActiveToolId } = useTool();
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return null;
    const Icon = tool.icon;
    
    return (
        <button 
            onClick={() => setActiveToolId(toolId)}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1 duration-300 active:scale-95 group w-full h-full"
        >
            <div className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className={tool.color} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate w-full text-center">
                {tool.title.split(' ')[0]}
            </span>
        </button>
    );
};

const DashboardScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const { memory } = useMemory();
    const { persona } = usePersona();
    const { activeToolId } = useTool();

    const isFahimkom = useMemo(() => persona.humor >= 8 && persona.verbosity <= 3, [persona]);
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';

    const context = useMemo(() => {
        const hour = new Date().getHours();
        return hour < 12 ? "الصباح" : hour < 18 ? "بعد الظهر" : "المساء";
    }, []);

    const { data: briefing, isLoading: isBriefingLoading, error: briefingError, execute: fetchBriefing } = useGemini<BriefingData, void>(
        () => getMorningBriefing(memory, persona, context, botName)
    );
    
    useEffect(() => {
        fetchBriefing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memory, persona, botName]); // Re-fetch if persona changes

    const suggestions = briefing?.suggestions || [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة",
        "إيه رأيك في الذكاء الاصطناعي؟"
    ];
    
    const quickTools = ['image-generator', 'meme-generator', 'dialect-converter', 'ai-teacher'];

    return (
        <div className="flex flex-col h-full items-center justify-start pt-10 sm:pt-16 p-6 text-center overflow-y-auto no-scrollbar">
            <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 mb-8 relative group cursor-default">
                {/* Dynamic Background Glow based on Persona */}
                <div className={`absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 ${isFahimkom ? 'bg-orange-500/30' : 'bg-blue-500/20'}`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-full h-full bg-gradient-to-br rounded-full flex items-center justify-center shadow-2xl border border-white/50 dark:border-slate-700 ${
                    isFahimkom 
                    ? 'from-white to-orange-50 dark:from-slate-800 dark:to-slate-900' 
                    : 'from-white to-slate-100 dark:from-slate-800 dark:to-slate-900'
                }`}>
                    {isFahimkom ? (
                         <Zap size={56} className="text-orange-500 drop-shadow-lg sm:w-16 sm:h-16 fill-orange-500/10" />
                    ) : (
                         <Bot size={56} className="text-primary drop-shadow-lg sm:w-16 sm:h-16" />
                    )}
                </div>
            </div>
            
            {/* Greeting */}
            {isBriefingLoading 
                ? <Skeleton className="h-10 w-64 mb-3 rounded-xl mx-auto" />
                : <h2 className={`text-2xl sm:text-4xl font-black mb-3 animate-slideInUp bg-clip-text text-transparent leading-relaxed px-2 py-1 ${
                    isFahimkom 
                    ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-yellow-400 dark:to-orange-300'
                    : 'bg-gradient-to-r from-slate-800 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-400'
                }`}>
                    {briefing?.greeting || `${botName} تحت أمرك`}
                  </h2>
            }
            
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm sm:max-w-md animate-slideInUp leading-relaxed text-base delay-100 font-medium">
                {isFahimkom ? "جاهز يا وحش. عايز تخلص إيه النهاردة؟" : "جاهز لأي مهمة. ابدأ دردشة، اسأل سؤال، أو اختار أداة سريعة:"}
            </p>

            {/* Quick Tools Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-xl mb-10 animate-slideInUp delay-200">
                {quickTools.map(id => <QuickToolButton key={id} toolId={id} />)}
            </div>

            <div className="w-full max-w-lg flex items-center gap-4 mb-6 opacity-60">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">أو جرب تسألني</span>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1"></div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 animate-slideInUp max-w-3xl pb-8 w-full delay-300">
                 {isBriefingLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-36 rounded-full" />
                    ))
                ) : (
                    suggestions.map((s, i) => (
                        <button 
                            key={s} 
                            onClick={() => onSuggestionClick(s)}
                            className={`group relative px-5 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-full text-sm font-medium shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden active:scale-95 backdrop-blur-sm ${
                                isFahimkom ? 'hover:border-orange-400/50' : 'hover:border-primary/50'
                            }`}
                        >
                            <span className={`relative z-10 text-slate-700 dark:text-slate-200 transition-colors ${
                                isFahimkom ? 'group-hover:text-orange-600 dark:group-hover:text-orange-400' : 'group-hover:text-primary'
                            }`}>{s}</span>
                            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                isFahimkom ? 'from-orange-500/5 to-yellow-500/5' : 'from-primary/5 to-purple-500/5'
                            }`} />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const content = message.parts[0].text;
    const isUser = message.role === 'user';

    const fixMarkdownSpacing = (text: string) => {
        let res = text;
        res = res.replace(/([^\s])(\*\*|__)/g, '$1 $2');
        res = res.replace(/(\*\*|__)([^\s.,،؛:?!])/g, '$1 $2');
        return res;
    };

    const processedContent = fixMarkdownSpacing(content);
    
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
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-colors opacity-0 group-hover/code:opacity-100"
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
                    a: ({ node, ...props }) => <a {...props} className={`${isUser ? 'text-white underline decoration-white/50' : 'text-primary hover:text-primary-dark underline decoration-primary/30'} font-bold transition-colors`} target="_blank" rel="noopener noreferrer" />
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

    const botName = useMemo(() => {
        if (persona.humor >= 8 && persona.verbosity <= 3) return 'فهيمكم';
        return 'خبيركم';
    }, [persona.humor, persona.verbosity]);
    
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [activeConversationId]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const timeout = setTimeout(() => {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isResponding, activeConversation?.messages.length]);

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
        const modelMessageId = uuidv4();
        streamingMessageIdRef.current = modelMessageId;
        const memoryCommandRegex = /\[SAVE_MEMORY:(.*?)\]/g;

        const isFahimkom = persona.humor >= 8 && persona.verbosity <= 3;
        const currentBotName = isFahimkom ? 'فهيمكم' : 'خبيركم';

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

            const stream = await generateChatResponseStream(historyForApi, newMessage, memory, persona);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    console.log("Streaming stopped by user.");
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
            inputRef.current?.focus();
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
        
        if (failedMessageIndex <= 0) {
             console.error("Cannot retry: No preceding message found or message not found.");
             return;
        }

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
    }, [createNewConversation, addMessageToConversation, streamModelResponse, activeConversationId, activeConversation, renameConversation]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMenuOpen(false);
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
        return <DashboardScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-white/40 sm:dark:bg-slate-900/40 sm:backdrop-blur-md sm:border border-white/20 dark:border-slate-700/30 sm:rounded-2xl sm:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-6 scroll-smooth">
                 {activeConversation.messages.length === 0 ? (
                    <DashboardScreen onSuggestionClick={handleSuggestionClick} />
                ) : (
                    <div className="space-y-5 pb-6">
                        {activeConversation.messages.map((msg) => (
                             <div key={msg.id} className={`flex w-full animate-bubbleIn group ${
                                msg.role === 'user' ? 'justify-start' : 'justify-end'
                            }`}>
                                <div className={`flex items-end gap-2.5 max-w-[95%] sm:max-w-[88%] ${
                                    msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                                }`}>
                                    
                                    <div className={`self-end flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md border border-white/20 dark:border-slate-600/30 ${
                                        msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white' 
                                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {msg.role === 'user'
                                            ? <User className="w-5 h-5" />
                                            : <Bot className="w-5 h-5 animate-bot-idle-bob" />
                                        }
                                    </div>

                                    <div className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        <span className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 px-1 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                                            {msg.role === 'user' ? 'أنت' : (msg.senderName || botName)}
                                        </span>

                                        {msg.role === 'user' && msg.imageUrl && (
                                            <div 
                                                className="p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-all hover:scale-[1.01]"
                                                onClick={() => {
                                                    setImageZoom(1);
                                                    setSelectedImage(msg.imageUrl || null);
                                                }}
                                            >
                                                <img src={msg.imageUrl} alt="User upload" className="rounded-xl max-w-xs max-h-64 object-contain" />
                                            </div>
                                        )}
                                        { (msg.parts[0].text || msg.role === 'model') && (
                                            <div className={`relative px-4 py-3.5 sm:px-6 sm:py-5 shadow-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3xl rounded-br-none' 
                                                : `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60 rounded-3xl rounded-bl-none ${msg.error ? 'border-red-500/30 bg-red-50/80 dark:bg-red-900/20' : ''}`
                                            }`}>
                                                <div className="text-[15px] sm:text-base leading-relaxed">
                                                    {msg.role === 'model' && msg.isStreaming && !msg.parts[0].text && !msg.error ? (
                                                        <div className="flex gap-1.5 justify-center items-center px-2 py-1">
                                                            <span className="w-2 h-2 bg-slate-400/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                                            <span className="w-2 h-2 bg-slate-400/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                                            <span className="w-2 h-2 bg-slate-400/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
                                                        </div>
                                                    ) : (
                                                        <MessageContent message={msg} />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {msg.role === 'model' && !msg.error && !msg.isStreaming && (
                                            <div className="flex gap-2 mt-1.5 px-1 flex-wrap justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button 
                                                    onClick={() => handleSpeak(msg.parts[0].text, msg.id)}
                                                    className={`p-1.5 rounded-full transition-all active:scale-90 ${speakingMessageId === msg.id ? 'bg-primary/20 text-primary animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                    aria-label="نطق"
                                                >
                                                    {speakingMessageId === msg.id ? <Square size={16} className="fill-current" /> : <Volume2 size={16} />}
                                                </button>
                                                <button 
                                                    onClick={() => handleCopy(msg.parts[0].text, msg.id)}
                                                    className={`p-1.5 rounded-full transition-all active:scale-90 ${copiedMessageId === msg.id ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                    aria-label="نسخ"
                                                >
                                                    {copiedMessageId === msg.id ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                                <button 
                                                    onClick={() => handleRetry(msg)} 
                                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90"
                                                    aria-label="إعادة المحاولة"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                            </div>
                                        )}
                                        
                                        {msg.error && (
                                            <div className="mt-1.5 flex items-center gap-2 animate-slideInUp">
                                                <span className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">فشل الرد</span>
                                                <button onClick={() => handleRetry(msg)} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 text-red-500 text-xs rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95 shadow-sm">
                                                    <RefreshCw size={12} /> إعادة المحاولة
                                                </button>
                                            </div>
                                        )}
                                        {!msg.error && msg.id === stoppedMessageId && !isResponding && (
                                            <div className="mt-1.5 flex items-center gap-2 animate-slideInUp">
                                                <span className="text-xs text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">تم الإيقاف</span>
                                                <button onClick={handleContinue} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-yellow-200 dark:border-yellow-900 text-yellow-600 dark:text-yellow-500 text-xs rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors active:scale-95 shadow-sm">
                                                    <Play size={12} /> إكمال الرد
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isResponding && activeConversation.messages.length > 0 && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
                             <div className="flex w-full animate-bubbleIn justify-end">
                                <div className="flex items-end gap-2 sm:gap-3 flex-row-reverse max-w-[90%]">
                                    <div className="self-end flex-shrink-0 w-9 h-9 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-md">
                                        <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-bot-idle-bob" />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full items-end">
                                         <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 ml-1">
                                            {botName} 
                                        </span>
                                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm">
                                             <div className="flex gap-1.5 justify-center items-center">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}
            </div>

            {/* Scroll to bottom button */}
            <button 
                onClick={handleScrollToBottomButton}
                className={`absolute bottom-28 right-6 p-3 bg-white dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700 rounded-full shadow-lg transition-all duration-300 z-20 hover:shadow-xl active:scale-95 hover:-translate-y-1 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <ChevronDown size={20} />
            </button>

            {/* Floating Input Bar */}
            <div className="p-3 sm:p-5 bg-transparent backdrop-blur-none" onPaste={handlePaste}>
                 {attachedFile && (
                    <div className="relative w-fit max-w-full mb-3 p-2 pr-3 pl-8 border rounded-xl border-primary/30 bg-white/90 dark:bg-slate-800/90 shadow-lg animate-slideInUp backdrop-blur-md mx-auto sm:mx-0">
                        {filePreview ? (
                            <div className="relative group">
                                <img src={filePreview} alt="Preview" className="h-24 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"/>
                                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </div>
                        ) : (
                            <div className='flex items-center gap-3 text-slate-700 dark:text-slate-200 px-2 py-1'>
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-500">
                                    <FileText size={20} />
                                </div>
                                <span className='text-sm font-bold truncate max-w-[200px]'>{attachedFile.name}</span>
                            </div>
                        )}
                        <button 
                            onClick={() => { setAttachedFile(null); setFilePreview(null); }}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all active:scale-90"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                 <div className="flex items-end gap-2 relative max-w-3xl mx-auto">
                    <div className="flex-1 relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 rounded-[26px] transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 focus-within:shadow-xl">
                        <AutoGrowTextarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={`اسأل ${botName}...`}
                            className="w-full py-3.5 pl-12 pr-4 bg-transparent border-none outline-none resize-none max-h-32 min-h-[52px] text-base text-slate-800 dark:text-slate-200 placeholder:text-slate-400 rounded-[26px] textarea-scrollbar"
                            aria-label="اكتب رسالتك هنا"
                        />
                        
                        {/* Attachment Button inside input */}
                        <div className="absolute left-2 bottom-1.5">
                            <Button
                                variant="secondary"
                                className="p-2 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary shadow-none active:scale-95 transition-all"
                                aria-label="خيارات إضافية"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                <Plus size={22} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-45 text-primary' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    <div className="self-end mb-1">
                        {isResponding ? (
                            <Button onClick={handleStop} className="w-12 h-12 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-red-500/30 transform hover:scale-105 active:scale-95 transition-all" aria-label="إيقاف التوليد">
                                <StopCircle size={22} className="fill-white/20" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleSend} 
                                disabled={(!input.trim() && !attachedFile)} 
                                className={`w-12 h-12 p-0 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-90 ${
                                    (!input.trim() && !attachedFile) 
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white hover:shadow-primary/30 hover:scale-105'
                                }`} 
                                aria-label="إرسال الرسالة"
                            >
                                <Send size={22} className={(!input.trim() && !attachedFile) ? "" : "ml-0.5"} />
                            </Button>
                        )}
                    </div>

                     {isMenuOpen && (
                        <div 
                            className="absolute bottom-full left-0 mb-3 w-56 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 p-1.5 z-30 animate-slideInUp origin-bottom-left"
                            onMouseLeave={() => setMenuOpen(false)}
                        >
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center gap-3 p-3 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-200 group"
                            >
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors"><Paperclip size={18} /></div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">ملف / صورة</span>
                                    <span className="text-[10px] text-slate-400">PDF, PNG, JPG</span>
                                </div>
                            </button>
                            <button
                                disabled
                                className="w-full flex items-center gap-3 p-3 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-200 opacity-50 cursor-not-allowed group"
                            >
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg"><Mic size={18} /></div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">تسجيل صوتي</span>
                                    <span className="text-[10px] text-slate-400">قريباً...</span>
                                </div>
                            </button>
                        </div>
                    )}
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                </div>
            </div>
            
             {/* Image Lightbox Modal with Zoom */}
             {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl transition-all animate-fadeIn"
                    role="dialog"
                    aria-label="عارض الصور"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Header/Close */}
                    <div className="absolute top-4 right-4 z-50">
                         <button 
                            className="p-3 text-white/80 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-all active:scale-90"
                            onClick={() => setSelectedImage(null)}
                            aria-label="إغلاق"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Image Container */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden p-4 animate-zoomIn">
                         <img 
                            src={selectedImage} 
                            alt="Full view" 
                            className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out origin-center shadow-2xl"
                            style={{ transform: `scale(${imageZoom})` }}
                            onClick={(e) => e.stopPropagation()} 
                            draggable={false}
                        />
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-3 bg-slate-900/80 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))}
                            className="p-2 text-white hover:text-primary transition-colors active:scale-90"
                            aria-label="تصغير"
                        >
                            <Minus size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3 w-32 sm:w-48 px-2">
                            <ZoomOut size={14} className="text-slate-400"/>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="3" 
                                step="0.1" 
                                value={imageZoom}
                                onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                             <ZoomIn size={14} className="text-slate-400"/>
                        </div>

                        <button 
                            onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))}
                            className="p-2 text-white hover:text-primary transition-colors active:scale-90"
                            aria-label="تكبير"
                        >
                            <Plus size={20} />
                        </button>

                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                        <button 
                            onClick={() => setImageZoom(1)}
                            className="p-2 text-white hover:text-yellow-400 transition-colors active:scale-90"
                            aria-label="إعادة ضبط"
                            title="إعادة ضبط الحجم"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
