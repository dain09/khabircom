
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, FileText, Plus, BrainCircuit, ArrowRight, ChevronDown, Sparkles, Terminal, Volume2, Square, ZoomIn, ZoomOut, RotateCcw, Minus, Image as ImageIcon, Languages, Smile, GraduationCap } from 'lucide-react';
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
            className="group flex items-center gap-3 p-3 my-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:shadow-md active:scale-[0.98] transition-all duration-200 w-full"
        >
            <div className={`flex-shrink-0 p-2.5 rounded-full bg-slate-50 dark:bg-slate-700 group-hover:bg-primary/10 transition-colors`}>
                <Icon size={20} className={`${tool.color}`} />
            </div>
            <div className="flex-1 min-w-0 text-start">
                <h4 className="font-bold text-sm text-foreground dark:text-slate-200 group-hover:text-primary truncate transition-colors">
                    {tool.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    اضغط للتجربة الآن
                </p>
            </div>
            <div className="flex-shrink-0 p-1.5 bg-slate-50 dark:bg-slate-700 rounded-full group-hover:bg-primary group-hover:text-white transition-all rtl:rotate-180">
                <ArrowRight size={14} />
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
            className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl transition-all hover:shadow-md hover:scale-105 active:scale-95"
        >
            <div className={`p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm ${tool.color.replace('text-', 'text-').replace('500', '600')}`}>
                <Icon size={20} />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate w-full text-center">
                {tool.title.split(' ')[0]}
            </span>
        </button>
    );
};

const DashboardScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const { memory } = useMemory();
    const { persona } = usePersona();
    const { activeToolId } = useTool(); // Just to trigger re-render if needed

    const context = useMemo(() => {
        const hour = new Date().getHours();
        return hour < 12 ? "الصباح" : hour < 18 ? "بعد الظهر" : "المساء";
    }, []);

    // useGemini will now utilize the caching logic implemented in getMorningBriefing
    const { data: briefing, isLoading: isBriefingLoading, error: briefingError, execute: fetchBriefing } = useGemini<BriefingData, void>(
        () => getMorningBriefing(memory, persona, context)
    );
    
    useEffect(() => {
        fetchBriefing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memory, persona]); // Re-fetch only if memory/persona changes heavily

    const suggestions = briefing?.suggestions || [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة",
        "إيه رأيك في الذكاء الاصطناعي؟"
    ];
    
    const quickTools = ['image-generator', 'meme-generator', 'dialect-converter', 'ai-teacher'];

    return (
        <div className="flex flex-col h-full items-center justify-start pt-8 sm:pt-12 p-4 text-center overflow-y-auto no-scrollbar">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center animate-bubbleIn shadow-lg shadow-primary/10">
                <Bot size={48} className="text-primary drop-shadow-md sm:w-14 sm:h-14" />
            </div>
            
            {/* Greeting */}
            {isBriefingLoading 
                ? <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-2 rounded-lg" />
                : <h2 className="text-xl sm:text-3xl font-bold mb-2 animate-slideInUp bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 px-2 leading-normal">
                    {briefing?.greeting || "خبيركم تحت أمرك"}
                  </h2>
            }
            
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs sm:max-w-md animate-slideInUp leading-relaxed text-sm sm:text-base delay-100">
                جاهز لأي مهمة. ابدأ دردشة أو اختار أداة سريعة:
            </p>

            {/* Quick Tools Grid - New Feature */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-lg mb-8 animate-slideInUp delay-200">
                {quickTools.map(id => <QuickToolButton key={id} toolId={id} />)}
            </div>

            <div className="w-full max-w-2xl border-t border-slate-200/50 dark:border-slate-700/50 mb-6"></div>

            {/* Suggestions */}
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 animate-slideInUp delay-300">
                أو جرب تسألني
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 animate-slideInUp max-w-2xl pb-4 w-full px-2 delay-300">
                 {isBriefingLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-32 sm:w-40 rounded-full" />
                    ))
                ) : (
                    suggestions.map((s, i) => (
                        <button 
                            key={s} 
                            onClick={() => onSuggestionClick(s)}
                            className="group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium hover:border-primary hover:shadow-md transition-all duration-300 overflow-hidden active:scale-95 flex-grow sm:flex-grow-0"
                        >
                            <span className="relative z-10 group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">{s}</span>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

    // Enhanced Markdown Spacing Fix
    // This explicitly targets Arabic characters followed immediately by bold/italic markers
    const fixMarkdownSpacing = (text: string) => {
        let res = text;
        // Ensure space between any word ending (including Arabic letters) and the start of bold (** or __)
        // \S matches any non-whitespace character. 
        res = res.replace(/([^\s])(\*\*|__)/g, '$1 $2');
        
        // Ensure space between end of bold (** or __) and the next word
        res = res.replace(/(\*\*|__)([^\s.,،؛:?!])/g, '$1 $2');
        
        // Specific fix for Arabic 'Alif' variants (أ، إ، آ) if stuck to non-arabic latin characters or symbols
        // (Usually the previous regex covers this, but this is a failsafe)
        return res;
    };

    const processedContent = fixMarkdownSpacing(content);
    
    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const [isCopied, setIsCopied] = useState(false);
        const match = /language-(\w+)/.exec(className || '');
        const codeText = String(children).replace(/\n$/, '');
        
        // Special handling: check if the code block is actually a tool command
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
            <div className="relative my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm dir-ltr text-left max-w-full">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Terminal size={14} className="text-slate-400 flex-shrink-0"/>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{match?.[1] || 'code'}</span>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                        {isCopied ? (
                            <><Check size={12} className="text-green-500"/> <span className="text-[10px] text-green-500">تم</span></>
                        ) : (
                            <><Copy size={12} className="text-slate-400"/> <span className="text-[10px] text-slate-400">نسخ</span></>
                        )}
                    </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match?.[1] || 'text'}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, padding: '1rem', fontSize: '0.85rem', lineHeight: '1.6', minWidth: '100%' }}
                        {...props}
                    >
                        {codeText}
                    </SyntaxHighlighter>
                </div>
            </div>
        ) : (
            <code className={`${isUser ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary-dark dark:text-primary-foreground border border-slate-200 dark:border-slate-700/50'} rounded px-1.5 py-0.5 text-sm font-mono dir-ltr mx-0.5 whitespace-pre-wrap break-all`} {...props}>
                {children}
            </code>
        );
    };

    // Reusable function to parse children for [TOOL:xyz]
    const parseChildrenForTools = (children: React.ReactNode) => {
        const childrenArray = React.Children.toArray(children);
        const newChildren: React.ReactNode[] = [];
        const toolRegex = /\[TOOL:(.*?)\]/g;
        let hasTools = false;

        childrenArray.forEach((child, childIndex) => {
            if (typeof child === 'string') {
                const parts = child.split(toolRegex);
                if (parts.length > 1) hasTools = true;
                
                parts.forEach((part, index) => {
                    if (index % 2 === 1) {
                        const toolId = part.trim();
                        newChildren.push(
                            <div key={`${toolId}-${childIndex}-${index}`} className="block w-full my-2">
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
        return { newChildren, hasTools };
    };

    // Custom paragraph renderer with enhanced spacing
    const CustomParagraph = ({ node, ...props }: any) => {
        const { newChildren } = parseChildrenForTools(props.children);
        const textColor = isUser ? 'text-white' : 'text-foreground dark:text-slate-200';
        // Increased bottom margin and line-height for Arabic readability
        return <p {...props} className={`mb-6 last:mb-0 leading-[2.2] text-base ${textColor}`}>{newChildren}</p>;
    };

    // Custom list item renderer
    const CustomListItem = ({ node, ...props }: any) => {
        const { newChildren } = parseChildrenForTools(props.children);
        const textColor = isUser ? 'text-white' : 'text-foreground dark:text-slate-200';
        return <li {...props} className={`my-2 leading-[2.2] ${textColor}`}>{newChildren}</li>;
    }

    return (
         <div className={`prose prose-base max-w-none break-words ${isUser ? 'prose-invert [&_*]:text-white' : 'dark:prose-invert prose-headings:text-primary prose-strong:text-primary prose-strong:font-bold'}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: CustomParagraph,
                    // ps-6 adds padding start (right in RTL), keeping bullets visible inside the container
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-outside ps-6 mb-6 space-y-2 marker:font-bold" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-outside ps-6 mb-6 space-y-2" />,
                    li: CustomListItem,
                    code: CodeBlock,
                    a: ({ node, ...props }) => <a {...props} className={`${isUser ? 'text-white underline' : 'text-primary hover:underline'} font-bold`} target="_blank" rel="noopener noreferrer" />
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
    
    // --- Scrolling Logic ---

    // 1. Instant scroll to bottom when switching conversations
    useEffect(() => {
        if (scrollContainerRef.current) {
             // Instant scroll for UX responsiveness when loading chat history
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [activeConversationId]);

    // 2. Smooth scroll to bottom when bot is responding or new messages arrive
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Use a small timeout to ensure content renders
            const timeout = setTimeout(() => {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isResponding, activeConversation?.messages.length]);

    // Stop speech when leaving conversation or unmounting
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [activeConversationId]);

    // Show/Hide scroll button
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
        // Remove code blocks completely (content between ```)
        let clean = text.replace(/```[\s\S]*?```/g, " (يوجد كود برمجي هنا) ");
        // Remove inline code
        clean = clean.replace(/`[^`]*`/g, "");
        // Remove tool tags
        clean = clean.replace(/\[TOOL:.*?\]/g, "");
        // Remove common markdown symbols that ruin speech
        clean = clean.replace(/[*#_\[\]]/g, "");
        // Remove links
        clean = clean.replace(/\(http.*?\)/g, "");
        return clean;
    };

    const handleSpeak = (text: string, messageId: string) => {
        if (speakingMessageId === messageId) {
            window.speechSynthesis.cancel();
            setSpeakingMessageId(null);
            return;
        }

        window.speechSynthesis.cancel(); // Stop any current speech
        setSpeakingMessageId(messageId);

        const cleanedText = cleanTextForTTS(text);
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        
        // Attempt to find a better Arabic voice
        const voices = window.speechSynthesis.getVoices();
        // Prefer "Google" voices if available as they are often higher quality
        const arabicVoice = voices.find(v => v.lang.includes('ar') && v.name.includes('Google')) ||
                            voices.find(v => v.lang.includes('ar'));

        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }
        
        utterance.lang = 'ar-SA'; // Use SA as it often defaults to a clearer Modern Standard Arabic or understood dialect
        utterance.rate = 0.9; // Slightly slower is usually clearer for Arabic
        
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

        // Capture current bot name state for persistence
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

        // Stop speech if user sends a new message
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
        
        // Smart Title Generation logic...
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
        // Also stop speech if happening
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
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-background/70 sm:dark:bg-dark-card/70 backdrop-blur-lg sm:border border-white/20 dark:border-slate-700/30 sm:rounded-xl sm:shadow-xl transition-all duration-300 relative">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 sm:p-6 scroll-smooth">
                 {activeConversation.messages.length === 0 ? (
                    <DashboardScreen onSuggestionClick={handleSuggestionClick} />
                ) : (
                    <div className="space-y-6 pb-4">
                        {activeConversation.messages.map((msg) => (
                             <div key={msg.id} className={`flex w-full animate-bubbleIn group ${
                                msg.role === 'user' ? 'justify-start' : 'justify-end'
                            }`}>
                                <div className={`flex items-end gap-2 sm:gap-3 max-w-[98%] sm:max-w-[90%] hover:scale-[1.01] transition-transform duration-200 ${
                                    msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                                }`}>
                                    
                                    <div className={`self-end flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}>
                                        {msg.role === 'user'
                                            ? <User className="w-5 h-5" />
                                            : <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-bot-idle-bob" />
                                        }
                                    </div>

                                    <div className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        <span className={`text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 px-1 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                                            {msg.role === 'user' ? 'أنت' : (msg.senderName || botName)}
                                        </span>

                                        {msg.role === 'user' && msg.imageUrl && (
                                            <div 
                                                className="p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/50 cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => {
                                                    setImageZoom(1); // Reset zoom on open
                                                    setSelectedImage(msg.imageUrl || null);
                                                }}
                                            >
                                                <img src={msg.imageUrl} alt="User upload" className="rounded-md max-w-xs max-h-64 object-contain" />
                                            </div>
                                        )}
                                        { (msg.parts[0].text || msg.role === 'model') && (
                                            <div className={`relative px-4 py-3 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden ${
                                                msg.role === 'user' 
                                                ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-none' 
                                                : `bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-foreground dark:text-dark-foreground rounded-bl-none ${msg.error ? 'border-red-500/50 bg-red-50/50 dark:bg-red-900/10' : ''}`
                                            }`}>
                                                <div className="text-sm sm:text-base">
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

                                        {/* Mobile Friendly Action Footer for Bot Messages */}
                                        {msg.role === 'model' && !msg.error && !msg.isStreaming && (
                                            <div className="flex gap-2 mt-1 px-1 flex-wrap justify-end opacity-80 hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleSpeak(msg.parts[0].text, msg.id)}
                                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-xs font-medium active:scale-95 ${speakingMessageId === msg.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                >
                                                    {speakingMessageId === msg.id ? <Square size={14} className="fill-current" /> : <Volume2 size={14} />}
                                                    <span>{speakingMessageId === msg.id ? 'إيقاف' : 'نطق'}</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleCopy(msg.parts[0].text, msg.id)}
                                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-xs font-medium active:scale-95 ${copiedMessageId === msg.id ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                >
                                                    {copiedMessageId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                                                    <span>{copiedMessageId === msg.id ? 'تم' : 'نسخ'}</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleRetry(msg)} 
                                                    className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium active:scale-95"
                                                >
                                                    <RefreshCw size={14} />
                                                    <span>توليد تاني</span>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {msg.error && (
                                            <div className="mt-1.5 flex items-center gap-2 animate-slideInUp">
                                                <span className="text-xs text-red-500 font-bold">فشل الرد</span>
                                                <button onClick={() => handleRetry(msg)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full hover:bg-red-200 transition-colors active:scale-95">
                                                    <RefreshCw size={12} /> إعادة المحاولة
                                                </button>
                                            </div>
                                        )}
                                        {!msg.error && msg.id === stoppedMessageId && !isResponding && (
                                            <div className="mt-1.5 flex items-center gap-2 animate-slideInUp">
                                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">تم الإيقاف</span>
                                                <button onClick={handleContinue} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full hover:bg-yellow-200 transition-colors active:scale-95">
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
                                    <div className="self-end flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-sm">
                                        <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-bot-idle-bob" />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full items-end">
                                         <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 ml-1">
                                            {botName} 
                                        </span>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-none shadow-sm">
                                             <div className="flex gap-1.5 justify-center items-center">
                                                <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                                <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                                <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
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
                className={`absolute bottom-24 right-4 p-2 bg-primary text-white rounded-full shadow-lg transition-all duration-300 z-20 hover:bg-primary-dark active:scale-95 ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <ChevronDown size={20} />
            </button>

            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/80 dark:bg-dark-card/80 backdrop-blur-xl sm:rounded-b-xl" onPaste={handlePaste}>
                 {attachedFile && (
                    <div className="relative w-fit max-w-full mb-3 p-2 pr-8 border rounded-lg border-primary/50 bg-primary/5 animate-slideInUp">
                        {filePreview ? (
                            <div className="relative group">
                                <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-slate-200 dark:border-slate-700"/>
                                <div className="absolute inset-0 bg-black/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </div>
                        ) : (
                            <div className='flex items-center gap-2 text-primary px-2 py-1'>
                                <FileText size={24} />
                                <span className='text-sm font-medium truncate max-w-[150px]'>{attachedFile.name}</span>
                            </div>
                        )}
                        <button 
                            onClick={() => { setAttachedFile(null); setFilePreview(null); }}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors active:scale-90"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
                 <div className="flex items-end gap-2">
                    
                    <div className="self-end mb-0.5">
                        {isResponding ? (
                            <Button onClick={handleStop} className="p-2.5 sm:p-3 bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all" aria-label="إيقاف التوليد">
                                <StopCircle size={20} />
                            </Button>
                        ) : (
                            <Button onClick={handleSend} disabled={(!input.trim() && !attachedFile)} className={`p-2.5 sm:p-3 rounded-full shadow-md transition-all duration-200 active:scale-95 ${(!input.trim() && !attachedFile) ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg transform hover:scale-105'}`} aria-label="إرسال الرسالة">
                                <Send size={20} />
                            </Button>
                        )}
                    </div>

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
                        placeholder="اسأل خبيركم..."
                        className="flex-1 p-3 sm:p-3.5 bg-slate-5 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all duration-200 shadow-inner placeholder:text-slate-400 resize-none max-h-32 min-h-[48px] glow-effect textarea-scrollbar text-base"
                        aria-label="اكتب رسالتك هنا"
                    />
                    
                    <div className='relative self-end mb-0.5'>
                        <Button
                            variant="secondary"
                            className="p-2.5 sm:p-3 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-95"
                            aria-label="خيارات إضافية"
                            onClick={() => setMenuOpen(prev => !prev)}
                        >
                            <Plus size={20} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`} />
                        </Button>
                        {isMenuOpen && (
                            <div 
                                className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 p-1.5 z-30 animate-slideInUp origin-bottom-left"
                                onMouseLeave={() => setMenuOpen(false)}
                            >
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center gap-3 p-3 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-foreground dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-600"
                                >
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-md"><Paperclip size={16} /></div>
                                    <span>إرفاق ملف / صورة</span>
                                </button>
                                <button
                                    disabled
                                    className="w-full flex items-center gap-3 p-3 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-foreground dark:text-slate-200 opacity-50 cursor-not-allowed"
                                >
                                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-md"><Mic size={16} /></div>
                                    <span>تسجيل صوتي (قريباً)</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                </div>
            </div>
            
             {/* Image Lightbox Modal with Zoom */}
             {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-2xl transition-all animate-fadeIn"
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
                            className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out origin-center"
                            style={{ transform: `scale(${imageZoom})` }}
                            onClick={(e) => e.stopPropagation()} 
                            draggable={false}
                        />
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-3 bg-black/60 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))}
                            className="p-2 text-white hover:text-primary transition-colors active:scale-90"
                            aria-label="تصغير"
                        >
                            <Minus size={20} />
                        </button>
                        
                        <div className="flex items-center gap-2 w-32 sm:w-48 px-2">
                            <ZoomOut size={14} className="text-slate-400"/>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="3" 
                                step="0.1" 
                                value={imageZoom}
                                onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
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

                        <div className="w-px h-6 bg-white/20 mx-1"></div>

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
