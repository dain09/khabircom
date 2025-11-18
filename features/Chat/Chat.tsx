import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, Plus, BrainCircuit, ArrowRight, MoreVertical, Edit, Volume2, Save, FileText, Zap, Lightbulb, Sparkles, Flame, Puzzle, Link as LinkIcon, ExternalLink, Waves, ChevronDown } from 'lucide-react';
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

// --- Dashboard Sub-Components ---

const QuickToolButton: React.FC<{ toolId: string }> = ({ toolId }) => {
    const { navigateTo } = useTool();
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return null;
    const Icon = tool.icon;
    
    return (
        <button 
            onClick={() => navigateTo(toolId)}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group w-full backdrop-blur-sm"
        >
            <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className={`${tool.color}`} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                {tool.title}
            </span>
        </button>
    );
};

type BriefingData = { greeting: string; suggestions: string[] };

const DashboardScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const { memory } = useMemory();
    const { persona } = usePersona();

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
    }, [memory, persona, botName, fetchBriefing]);

    const suggestions = briefing?.suggestions || ["اكتب نكتة", "لخص مفهوم الثقب الأسود", "اقترح فكرة مشروع", "إيه رأيك في الذكاء الاصطناعي؟"];
    const quickTools = ['image-generator', 'meme-generator', 'dialect-converter', 'ai-teacher'];

    return (
        <div className="flex flex-col items-center justify-center min-h-full w-full p-4 sm:p-8">
            <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-8 sm:space-y-12">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4 animate-slideInUpFade">
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl ${isFahimkom ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                         <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 ${isFahimkom ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                        {isFahimkom ? <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 relative z-10" /> : <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-primary relative z-10" />}
                    </div>
                    
                    <div className="space-y-2">
                        {isBriefingLoading ? (
                            <Skeleton className="h-8 w-48 sm:h-10 sm:w-64 mx-auto rounded-lg" />
                        ) : (
                            <h2 className="text-2xl sm:text-4xl font-black text-foreground dark:text-white tracking-tight">
                                {briefing?.greeting || `${botName} جاهز للمساعدة`}
                            </h2>
                        )}
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                             {isFahimkom ? "ماتشيلش هم، أنا هنا عشانك." : "كيف يمكنني مساعدتك اليوم؟"}
                        </p>
                    </div>
                </div>

                {/* Suggestions Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slideInUpFade" style={{ animationDelay: '100ms' }}>
                    {isBriefingLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />) : suggestions.map((s, i) => (
                        <button 
                            key={s} 
                            onClick={() => onSuggestionClick(s)} 
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-start text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                        >
                            <span className="line-clamp-1">{s}</span>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors rtl:rotate-180 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" />
                        </button>
                    ))}
                </div>

                {/* Quick Tools */}
                <div className="w-full animate-slideInUpFade" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest px-1">أدوات مقترحة</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickTools.map(id => <QuickToolButton key={id} toolId={id} />)}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Chat Sub-Components ---

const CodeBlock: React.FC<any> = ({ inline, className, children }) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
        setIsCopied(true); setTimeout(() => setIsCopied(false), 2000);
    };

    return !inline ? (
        <div className="relative my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#1e1e1e] shadow-lg dir-ltr text-left w-full max-w-full group/code">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/10"><div className="flex items-center gap-3"><div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div>{match?.[1] && <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{match[1]}</span>}</div><button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95">{isCopied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}<span className="text-[10px] font-medium">{isCopied ? 'تم النسخ' : 'نسخ'}</span></button></div>
            <div className="overflow-x-auto custom-scrollbar w-full"><SyntaxHighlighter style={vscDarkPlus} language={match?.[1] || 'text'} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.85rem', lineHeight: '1.6', background: 'transparent', minWidth: '100%' }} wrapLines={false}>{codeText}</SyntaxHighlighter></div>
        </div>
    ) : (
        <code className="bg-slate-200/50 dark:bg-slate-700/50 text-red-500 dark:text-red-400 border border-slate-200 dark:border-slate-700/50 rounded px-1.5 py-0.5 text-sm font-mono dir-ltr mx-0.5">{children}</code>
    );
};

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const { navigateTo } = useTool();

    const ToolSuggestionCard: React.FC<{ toolId: string }> = ({ toolId }) => {
        const tool = TOOLS.find(t => t.id === toolId);
        if (!tool) return null;
        return (<div onClick={() => navigateTo(toolId)} className="group flex items-center gap-3 p-3 my-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-lg shadow-sm active:scale-[0.98] transition-all duration-300 w-full backdrop-blur-sm max-w-sm"><div className={`flex-shrink-0 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 group-hover:bg-primary/10 transition-colors`}><tool.icon size={22} className={`${tool.color}`} /></div><div className="flex-1 min-w-0 text-start"><h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary truncate transition-colors">{tool.title}</h4><p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">اضغط للتجربة الآن</p></div><ArrowRight size={16} className="text-slate-400 rtl:rotate-180" /></div>);
    };

    return (
        <div className={`prose prose-base max-w-none ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} font-sans break-words`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                p: ({ children }) => {
                    if (Array.isArray(children) && typeof children[0] === 'string' && children[0].startsWith('[TOOL:')) {
                        const toolId = children[0].match(/\[TOOL:(.*?)\]/)?.[1];
                        return toolId ? <ToolSuggestionCard toolId={toolId} /> : <p>{children}</p>;
                    }
                    return <p className={`mb-2 last:mb-0 leading-7 text-[15px] sm:text-base ${message.role === 'user' ? 'text-white/95' : 'text-slate-800 dark:text-slate-200'}`}>{children}</p>
                },
                a: ({ node, ...props }) => <a {...props} className="inline-flex items-center gap-1.5 px-2.5 py-1 mx-1 my-0.5 rounded-full text-xs font-bold transition-all no-underline transform hover:-translate-y-0.5 shadow-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800/50" target="_blank" rel="noopener noreferrer"><LinkIcon size={10} /><span className="truncate max-w-[200px]">{props.children}</span><ExternalLink size={10} className="opacity-50" /></a>,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-outside ps-5 mb-4 space-y-2 marker:font-bold" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc list-outside ps-5 mb-4 space-y-2" />,
                li: ({ node, ...props }) => <li {...props} className="my-1 leading-relaxed" />,
                code: CodeBlock,
                strong: ({ node, ...props }) => <strong {...props} className="font-extrabold" />,
            }}>{message.parts[0].text}</ReactMarkdown>
        </div>
    );
};

// --- Main Chat Component ---

export const Chat: React.FC = () => {
    const { activeConversation, addMessageToConversation, updateMessageInConversation, createNewConversation, activeConversationId, conversations, renameConversation, editUserMessageAndBranch } = useChat();
    const { memory, updateMemory, deleteMemoryItem } = useMemory();
    const { persona } = usePersona();
    const { addToast } = useToast();
    
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isResponding, setIsResponding] = useState(false);
    const [stoppedMessageId, setStoppedMessageId] = useState<string | null>(null);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [editingMessage, setEditingMessage] = useState<{id: string, text: string} | null>(null);
    const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stopStreamingRef = useRef(false);
    const recognitionRef = useRef<any>(null);
    
    const isFahimkom = useMemo(() => persona.humor > 7 && persona.verbosity < 5, [persona.humor, persona.verbosity]);
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';
    
    // Improved Auto-Scroll
    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
             scrollContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [activeConversation?.messages, isResponding]);

    const handleSpeech = (text: string, messageId: string) => {
        const synth = window.speechSynthesis;
        if (synth.speaking && speakingMessageId === messageId) {
            synth.cancel();
            setSpeakingMessageId(null);
            return;
        }
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.onend = () => setSpeakingMessageId(null);
        synth.speak(utterance);
        setSpeakingMessageId(messageId);
    };

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message) => {
        setIsResponding(true);
        stopStreamingRef.current = false;
        if (window.innerWidth < 768) inputRef.current?.blur();

        const modelMessageId = uuidv4();
        addMessageToConversation(convoId, { id: modelMessageId, role: 'model', parts: [{ text: '' }], timestamp: new Date().toISOString(), isStreaming: true, senderName: botName });

        const memorySaveRegex = /\[SAVE_MEMORY:(.*?)\]/g;
        const memoryDeleteRegex = /\[DELETE_MEMORY:(.*?)\]/g;
        let fullText = '';
        
        try {
            const currentConvo = conversations.find(c => c.id === convoId);
            const historyForApi = currentConvo?.messages.filter(m => m.id !== modelMessageId && !m.error) || [];
            
            let fileToSend: File | undefined;
            if (userMessage.imageUrl) {
                const response = await fetch(userMessage.imageUrl!);
                const blob = await response.blob();
                const mimeType = userMessage.imageUrl!.match(/data:(.*?);base64,/)?.[1] || blob.type;
                fileToSend = new File([blob], 'uploaded-image.png', { type: mimeType });
            } else if (userMessage.fileInfo) {
                const matchingFile = attachedFile;
                if (matchingFile && matchingFile.name === userMessage.fileInfo.name) {
                    fileToSend = matchingFile;
                }
            }

            const stream = await generateChatResponseStream(historyForApi, { text: userMessage.parts[0].text, file: fileToSend }, memory, persona);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) { setStoppedMessageId(modelMessageId); break; }
                let chunkText = chunk.text;
                if(chunkText){
                    chunkText.matchAll(memorySaveRegex).forEach(m => { try { const j=JSON.parse(m[1]); updateMemory(j.key, j.value); addToast(`💡 تم حفظ: ${j.key}`); } catch(e){} });
                    chunkText.matchAll(memoryDeleteRegex).forEach(m => { try { const j=JSON.parse(m[1]); deleteMemoryItem(j.key); addToast(`🗑️ تم حذف: ${j.key}`); } catch(e){} });
                    let clean = chunkText.replace(memorySaveRegex, '').replace(memoryDeleteRegex, '').trim();
                    if(clean){ fullText += clean; updateMessageInConversation(convoId, modelMessageId, { parts: [{ text: fullText }] }); }
                }
            }
        } catch (error) {
            updateMessageInConversation(convoId, modelMessageId, { parts: [{ text: fullText + "\n\n[حدث خطأ]" }], error: true });
        } finally {
            setIsResponding(false);
            updateMessageInConversation(convoId, modelMessageId, { isStreaming: false });
            setAttachedFile(null);
        }
    }, [conversations, addMessageToConversation, updateMessageInConversation, memory, persona, botName, addToast, updateMemory, deleteMemoryItem, attachedFile]);

    const submitMessage = useCallback((text: string, file?: File | null) => {
        if (!text.trim() && !file) return;
        setStoppedMessageId(null);
        let convoId = activeConversationId;
        if (!convoId) { convoId = createNewConversation().id; }
        
        const isImage = file?.type.startsWith('image/');
        const imageUrl = isImage ? URL.createObjectURL(file) : undefined;
        
        const userMessage: Message = { 
            id: uuidv4(), 
            role: 'user', 
            parts: [{ text }], 
            timestamp: new Date().toISOString(), 
            imageUrl,
            fileInfo: file && !isImage ? { name: file.name, type: file.type } : undefined,
        };

        addMessageToConversation(convoId, userMessage);
        
        const activeConvo = conversations.find(c => c.id === convoId);
        if (activeConvo?.messages.length === 0) {
            generateConversationTitle([userMessage]).then(t => t && renameConversation(convoId!, t));
        }

        streamModelResponse(convoId, userMessage);
    }, [activeConversationId, createNewConversation, addMessageToConversation, conversations, renameConversation, streamModelResponse]);
    
    const handleSend = () => {
        submitMessage(input, attachedFile);
        setInput('');
        setAttachedFile(null);
    };

    const handleListen = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            addToast('للأسف، متصفحك مش بيدعم ميزة الإدخال الصوتي.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-EG';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => { if(recognitionRef.current) setIsListening(false); };
        recognition.onerror = (event: any) => { console.error('Speech recognition error:', event.error); setIsListening(false); };
        
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                 setInput(prev => (prev ? prev + ' ' : '') + finalTranscript);
            }
        };

        recognition.start();

    }, [isListening, addToast]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAttachedFile(file);
        if (e.target) e.target.value = '';
    };

    
    const handleRegenerate = (modelMessageId: string) => {
        if (!activeConversation) return;
        const msgIndex = activeConversation.messages.findIndex(m => m.id === modelMessageId);
        if (msgIndex < 1) return;
        const userMessage = activeConversation.messages[msgIndex - 1];
        
        editUserMessageAndBranch(activeConversation.id, userMessage.id, userMessage.parts[0].text);
        setTimeout(() => streamModelResponse(activeConversation.id, userMessage), 0);
    };

    const handleSaveEdit = () => {
        if (!editingMessage || !activeConversation) return;
        editUserMessageAndBranch(activeConversation.id, editingMessage.id, editingMessage.text);
        const updatedUserMessage = { ...activeConversation.messages.find(m => m.id === editingMessage.id)!, parts: [{ text: editingMessage.text }]};
        
        setEditingMessage(null);
        setTimeout(() => streamModelResponse(activeConversation.id, updatedUserMessage), 0);
    };

    if (!activeConversation) return <DashboardScreen onSuggestionClick={(prompt) => submitMessage(prompt)} />;

    return (
        <div className="flex flex-col h-full w-full relative bg-transparent">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 pb-24 sm:pb-32 scroll-smooth">
                {activeConversation.messages.length === 0 ? <DashboardScreen onSuggestionClick={(prompt) => submitMessage(prompt)} /> : (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {activeConversation.messages.map((msg, index) => (
                            <div key={msg.id} className={`flex w-full animate-slideInUpFade group ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex items-end gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mb-1 transition-transform duration-300 hover:scale-110 ${msg.role === 'user' ? 'bg-white dark:bg-slate-700' : 'bg-white dark:bg-slate-700'}`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Bot className={`w-5 h-5 ${msg.senderName === 'فهيمكم' ? 'text-orange-500' : 'text-primary'}`} />}
                                    </div>
                                    <div className={`flex flex-col gap-1 min-w-0 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        <p className="text-[10px] font-bold text-slate-400 px-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{msg.role === 'model' ? msg.senderName : 'أنت'}</p>
                                        {editingMessage?.id === msg.id ? (
                                            <div className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-primary rounded-2xl shadow-lg">
                                                <AutoGrowTextarea value={editingMessage.text} onChange={e => setEditingMessage({...editingMessage, text: e.target.value})} className="w-full bg-transparent outline-none text-sm"/>
                                                <div className="flex justify-end gap-2 mt-2"><Button variant="secondary" size="sm" onClick={() => setEditingMessage(null)}>إلغاء</Button><Button size="sm" onClick={handleSaveEdit}>حفظ</Button></div>
                                            </div>
                                        ) : (
                                            <>
                                                {msg.imageUrl && <div className="p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-2"><img onClick={() => setSelectedImage(msg.imageUrl!)} src={msg.imageUrl} alt="upload" className="rounded-lg max-h-64 object-cover cursor-zoom-in" /></div>}
                                                {msg.fileInfo && <div className="p-3 flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-2"><FileText className="w-6 h-6 text-primary" /><span className="text-sm font-medium">{msg.fileInfo.name}</span></div>}
                                                {(msg.parts[0].text || msg.isStreaming) && (
                                                    <div className={`relative p-3.5 sm:p-5 rounded-2xl shadow-sm text-base leading-relaxed transition-all duration-300 ${
                                                        msg.role === 'user' 
                                                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white rounded-br-none' // Changed: User is Right, so Bottom-Right is sharp
                                                        : 'bg-white dark:bg-slate-800 text-foreground dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700/60 w-full' // Changed: Bot is Left, so Bottom-Left is sharp
                                                    } ${msg.error ? 'border-red-500/50 border-2' : ''}`}>
                                                        {msg.isStreaming && !msg.parts[0].text ? (
                                                            <div className="flex gap-1.5 h-6 items-center px-2"><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0s'}}/><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}/></div>
                                                        ) : (
                                                            <MessageContent message={msg} />
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {msg.error && <button onClick={() => handleRegenerate(msg.id)} className="text-red-500 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors"><RefreshCw size={12}/> فشل، حاول تاني</button>}
                                    </div>
                                    <div className="relative self-center flex-shrink-0">
                                        <button aria-label="خيارات" onClick={() => setMenuOpenFor(menuOpenFor === msg.id ? null : msg.id)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all transform hover:scale-110"><MoreVertical size={16}/></button>
                                        {menuOpenFor === msg.id && (
                                            <div className="absolute bottom-full ltr:right-0 rtl:left-0 mb-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 p-1.5 z-20 animate-zoomIn origin-bottom" onMouseLeave={() => setMenuOpenFor(null)}>
                                                <button onClick={() => { navigator.clipboard.writeText(msg.parts[0].text); addToast('تم النسخ!'); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Copy size={14}/> نسخ النص</button>
                                                {msg.role === 'user' && <button onClick={() => { setEditingMessage({id: msg.id, text: msg.parts[0].text}); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Edit size={14}/> تعديل</button>}
                                                {msg.role === 'model' && <button onClick={() => { handleRegenerate(msg.id); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><RefreshCw size={14}/> إعادة صياغة</button>}
                                                {msg.role === 'model' && <button onClick={() => handleSpeech(msg.parts[0].text, msg.id)} className="w-full flex items-center gap-3 p-2 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Volume2 size={14}/> {speakingMessageId === msg.id ? 'إيقاف القراءة' : 'قراءة بصوت عالي'}</button>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-20">
                <div className="max-w-3xl mx-auto">
                     {attachedFile && (
                        <div className="relative w-fit max-w-full mb-3 p-2 pr-10 pl-4 border rounded-2xl border-primary/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg animate-slideInUpFade">
                            <div className='flex items-center gap-3'>
                                {attachedFile.type.startsWith('image/') ? <img src={URL.createObjectURL(attachedFile)} alt="Preview" className="w-12 h-12 object-cover rounded-xl"/> : <div className="p-2 bg-primary/10 rounded-xl"><FileText size={24} className="text-primary"/></div>}
                                <div className="flex flex-col">
                                    <span className='text-xs font-bold truncate max-w-[150px]'>{attachedFile.name}</span>
                                    <span className='text-[10px] text-slate-500'>{(attachedFile.size / 1024).toFixed(1)} KB</span>
                                </div>
                            </div>
                            <button onClick={() => setAttachedFile(null)} className="absolute top-2 right-2 p-1 bg-slate-200 dark:bg-slate-700 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"><X size={14} /></button>
                        </div>
                    )}

                    <div className="relative flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-[28px] p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 glow-effect">
                        {/* Send / Mic Button - Moved to Start (Right in RTL) */}
                         {input.trim() || attachedFile ? (
                             <Button 
                                onClick={handleSend} 
                                className="p-2.5 rounded-2xl bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 flex-shrink-0 mb-1"
                                aria-label="إرسال"
                            >
                                <ArrowRight size={20} className="rtl:rotate-180" strokeWidth={3} />
                            </Button>
                         ) : (
                             <button 
                                onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : handleListen} 
                                className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 mb-1 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'}`}
                                title="تسجيل صوتي"
                            >
                                {isListening ? <StopCircle size={22} /> : <Mic size={22} />}
                            </button>
                         )}
                        
                        <AutoGrowTextarea 
                            ref={inputRef} 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                            placeholder="اكتب رسالتك هنا..." 
                            className="flex-1 max-h-40 py-3 px-2 bg-transparent border-none focus:ring-0 outline-none resize-none text-[15px] placeholder:text-slate-400 textarea-scrollbar"
                        />

                        {/* Attachment Button - Moved to End (Left in RTL) */}
                         <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="p-3 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors flex-shrink-0"
                            title="إرفاق ملف أو صورة"
                        >
                            <Plus size={22} />
                        </button>
                    </div>
                    
                    <div className="text-center mt-2">
                         <p className="text-[10px] text-slate-400 dark:text-slate-600">
                            خبيركم ممكن يغلط. راجع المعلومات المهمة.
                        </p>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf,text/plain" className="hidden" />
            </div>
            
            {selectedImage && <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-zoomIn" onClick={() => setSelectedImage(null)}><img src={selectedImage} alt="Full" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /><button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button></div>}
        </div>
    );
};

export default Chat;
