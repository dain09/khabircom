import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, FileText, Plus, BrainCircuit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream, getMorningBriefing } from '../../services/api/chat.service';
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
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useMemory } from '../../hooks/useMemory';
import { usePersona } from '../../hooks/usePersona';
import { useToast } from '../../hooks/useToast';
import { Skeleton } from '../../components/ui/Skeleton';

type BriefingData = { greeting: string; suggestions: string[] };

const DashboardScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const { memory } = useMemory();
    const { persona } = usePersona();

    const context = useMemo(() => {
        const hour = new Date().getHours();
        return hour < 12 ? "الصباح" : hour < 18 ? "بعد الظهر" : "المساء";
    }, []);

    const { data: briefing, isLoading: isBriefingLoading, error: briefingError, execute: fetchBriefing } = useGemini<BriefingData, void>(
        () => getMorningBriefing(memory, persona, context)
    );
    
    useEffect(() => {
        fetchBriefing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memory, persona]);

    const suggestions = briefing?.suggestions || [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة",
        "إيه رأيك في الذكاء الاصطناعي؟"
    ];

    return (
        <div className="flex flex-col h-full items-center justify-center p-4 text-center">
            <div className="w-20 h-20 mb-4 bg-primary/20 rounded-full flex items-center justify-center animate-bubbleIn">
                <Bot size={48} className="text-primary" />
            </div>
            {isBriefingLoading 
                ? <Skeleton className="h-9 w-56 mb-2" />
                : <h2 className="text-3xl font-bold mb-2 animate-slideInUp">{briefing?.greeting || "خبيركم تحت أمرك"}</h2>
            }
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md animate-slideInUp" style={{ animationDelay: '200ms' }}>
                اختار اقتراح من دول عشان نبدأ الكلام.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slideInUp" style={{ animationDelay: '300ms' }}>
                 {isBriefingLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-40 rounded-full" />
                    ))
                ) : (
                    suggestions.map((s, i) => (
                        <button 
                            key={s} 
                            onClick={() => onSuggestionClick(s)}
                            className="p-2 px-4 bg-slate-200/60 dark:bg-dark-card/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-full text-sm font-medium hover:bg-slate-300/60 dark:hover:bg-dark-card/80 transition-all hover:scale-105"
                            style={{ animationDelay: `${400 + i * 100}ms` }}
                        >
                            {s}
                        </button>
                    ))
                )}
            </div>
            {briefingError && <p className="text-xs text-red-500 mt-4">فشل تحميل الاقتراحات. بنستخدم اقتراحات ثابتة دلوقتي.</p>}
        </div>
    );
};

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const { setActiveToolId } = useTool();
    const content = message.parts[0].text;

    const fixMarkdownSpacing = (text: string) => {
        const regex = /(\*\*.*?\*\*|\*.*?\*)(?=\S)/g;
        return text.replace(regex, '$1 ');
    };

    const processedContent = fixMarkdownSpacing(content);
    
    const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
        const [isCopied, setIsCopied] = useState(false);
        const match = /language-(\w+)/.exec(className || '');
        const codeText = String(children).replace(/\n$/, '');

        const handleCopy = () => {
            navigator.clipboard.writeText(codeText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return !inline ? (
            <div className="relative my-2 rounded-md overflow-hidden bg-[#2d2d2d]">
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 text-xs text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors flex items-center gap-1"
                >
                    {isCopied ? <><Check size={14} className="text-green-400"/> تم النسخ</> : <><Copy size={14} /> نسخ</>}
                </button>
                <SyntaxHighlighter
                    style={okaidia}
                    language={match?.[1] || 'text'}
                    PreTag="div"
                    {...props}
                >
                    {codeText}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="bg-slate-300 dark:bg-slate-600 rounded-sm px-1.5 py-0.5 text-sm font-mono" {...props}>
                {children}
            </code>
        );
    };

    const ParagraphWithToolLinks = ({ node, ...props }: any) => {
        const children = React.Children.toArray(props.children);
        const newChildren: React.ReactNode[] = [];
        const toolRegex = /\[TOOL:(.*?)\]/g;

        children.forEach((child, childIndex) => {
            if (typeof child === 'string') {
                const parts = child.split(toolRegex);
                parts.forEach((part, index) => {
                    if (index % 2 === 1) {
                        const toolId = part.trim();
                        const tool = TOOLS.find(t => t.id === toolId);
                        if (tool) {
                            const Icon = tool.icon;
                            newChildren.push(
                                <button
                                    key={`${tool.id}-${childIndex}-${index}`}
                                    onClick={() => setActiveToolId(tool.id)}
                                    className="inline-flex items-center gap-2 mx-1 my-1 p-2 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-all text-sm shadow-sm"
                                >
                                    <Icon size={18} className={tool.color} />
                                    <span>{tool.title}</span>
                                </button>
                            );
                        } else {
                            newChildren.push(`[TOOL:${part}]`);
                        }
                    } else if (part) { 
                        newChildren.push(part);
                    }
                });
            } else {
                newChildren.push(child);
            }
        });
        
        return <p {...props} className="mb-2 last:mb-0">{newChildren}</p>;
    };

    return (
         <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ParagraphWithToolLinks,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside" />,
                    code: CodeBlock,
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

const Chat: React.FC = () => {
    const { activeConversation, addMessageToConversation, updateMessageInConversation, createNewConversation, activeConversationId, conversations } = useChat();
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
    const [isMenuOpen, setMenuOpen] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stopStreamingRef = useRef(false);
    const streamingMessageIdRef = useRef<string | null>(null);
    const recognitionRef = useRef<any>(null);
    
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const timer = setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [activeConversationId, activeConversation?.messages, isResponding]);
    
    const handleCopy = (text: string, messageId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message, newMessage: { text: string, imageFile?: File }) => {
        setIsResponding(true);
        stopStreamingRef.current = false;
        const modelMessageId = uuidv4();
        streamingMessageIdRef.current = modelMessageId;
        const memoryCommandRegex = /\[SAVE_MEMORY:(.*?)\]/g;

        addMessageToConversation(convoId, {
            id: modelMessageId,
            role: 'model',
            parts: [{ text: '' }],
            timestamp: new Date().toISOString(),
            isStreaming: true,
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
                : "[عذراً، حصل خطأ في التواصل مع الخبير]";
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

        setStoppedMessageId(null);
        let currentConvoId = activeConversationId;
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
        
        await streamModelResponse(currentConvoId, userMessage, { text: textToSend, imageFile: imageToSend });

    }, [input, isResponding, activeConversationId, createNewConversation, addMessageToConversation, streamModelResponse, attachedFile, filePreview]);

    const handleStop = () => {
        stopStreamingRef.current = true;
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
        return <DashboardScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-background/70 sm:dark:bg-dark-card/70 backdrop-blur-lg sm:border border-white/20 dark:border-slate-700/30 sm:rounded-xl sm:shadow-xl transition-all duration-300">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 sm:p-6">
                 {activeConversation.messages.length === 0 ? (
                    <DashboardScreen onSuggestionClick={handleSuggestionClick} />
                ) : (
                    <div className="space-y-6">
                        {activeConversation.messages.map((msg) => (
                             <div key={msg.id} className={`flex w-full animate-bubbleIn group ${
                                msg.role === 'user' ? 'justify-start' : 'justify-end'
                            }`}>
                                <div className={`flex items-end gap-2 sm:gap-3 max-w-[90%] ${
                                    msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                                }`}>
                                    
                                    <div className={`self-end flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                        msg.role === 'user' ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}>
                                        {msg.role === 'user'
                                            ? <User className="w-5 h-5 text-primary" />
                                            : <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-bot-idle-bob" />
                                        }
                                    </div>

                                    <div className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        {msg.role === 'user' && msg.imageUrl && (
                                            <div className="p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                 <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src={msg.imageUrl} alt="User upload" className="rounded-md max-w-xs max-h-64 object-contain cursor-pointer" />
                                                </a>
                                            </div>
                                        )}
                                        { (msg.parts[0].text || msg.role === 'model') && (
                                            <div className={`relative p-3 rounded-2xl ${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                                : `bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-bl-none ${msg.error ? 'border border-red-500/50' : ''}`
                                            }`}>
                                                <div className="text-sm whitespace-pre-wrap">
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
                                                <span className="text-xs text-red-500">فشل الرد</span>
                                                <button onClick={() => handleRetry(msg)} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="إعادة المحاولة">
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {!msg.error && msg.id === stoppedMessageId && !isResponding && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-xs text-yellow-600 dark:text-yellow-400">توقف</span>
                                                <button onClick={handleContinue} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="تكملة">
                                                    <Play size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === 'model' && !msg.error && msg.parts[0].text && (
                                        <div className="self-center flex-shrink-0">
                                            <button 
                                                onClick={() => handleCopy(msg.parts[0].text, msg.id)}
                                                className="p-1.5 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                                                aria-label="نسخ الرد"
                                            >
                                                {copiedMessageId === msg.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isResponding && activeConversation.messages.length > 0 && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
                             <div className="flex w-full animate-bubbleIn justify-end">
                                <div className="flex items-end gap-2 sm:gap-3 flex-row-reverse">
                                    <div className="self-end flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300 animate-bot-idle-bob" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-bl-none">
                                         <div className="flex gap-1.5 justify-center items-center px-2 py-1">
                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0s'}}></span>
                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.2s'}}></span>
                                            <span className="w-2 h-2 bg-primary/80 rounded-full animate-bouncing-dots" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}
            </div>

            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg sm:rounded-b-xl" onPaste={handlePaste}>
                 {attachedFile && (
                    <div className="relative w-fit max-w-full mb-2 p-2 pr-8 border rounded-lg border-primary/50 bg-primary/10">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md"/>
                        ) : (
                            <div className='flex items-center gap-2 text-primary'>
                                <FileText size={24} />
                                <span className='text-sm font-medium truncate'>{attachedFile.name}</span>
                            </div>
                        )}
                        <button 
                            onClick={() => { setAttachedFile(null); setFilePreview(null); }}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                 <div className="flex items-start gap-2 sm:gap-3">
                    <div className="order-1 self-end">
                        {isResponding ? (
                            <Button onClick={handleStop} className="p-3 bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white rounded-full" aria-label="إيقاف التوليد">
                                <StopCircle size={24} />
                            </Button>
                        ) : (
                            <Button onClick={handleSend} disabled={(!input.trim() && !attachedFile)} className="p-3 rounded-full" aria-label="إرسال الرسالة">
                                <Send size={24} />
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
                        placeholder="اسأل أي حاجة أو الصق صورة... (Shift+Enter لسطر جديد)"
                        className="order-2 flex-1 p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-40 glow-effect textarea-scrollbar"
                        aria-label="اكتب رسالتك هنا"
                    />
                    <div className='relative order-3 self-end'>
                        <Button
                            variant="secondary"
                            className="p-3 rounded-full"
                            aria-label="خيارات إضافية"
                            onClick={() => setMenuOpen(prev => !prev)}
                        >
                            <Plus size={24} />
                        </Button>
                        {isMenuOpen && (
                            <div 
                                className="absolute bottom-full right-0 mb-2 w-48 bg-background dark:bg-dark-card shadow-lg rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-2 z-10 animate-slideInUp"
                                onMouseLeave={() => setMenuOpen(false)}
                            >
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-200/50 dark:hover:bg-dark-card/80"
                                >
                                    <Paperclip size={18} />
                                    <span>إرفاق ملف</span>
                                </button>
                                <button
                                    disabled
                                    className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-200/50 dark:hover:bg-dark-card/80 opacity-50 cursor-not-allowed"
                                >
                                    <Mic size={18} />
                                    <span>تسجيل صوتي</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                </div>
            </div>
        </div>
    );
};

export default Chat;