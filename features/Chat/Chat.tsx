

import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle, Play, Paperclip, X, Mic, Copy, Check, Plus, BrainCircuit, ArrowRight, MoreVertical, Edit, Volume2, Save, FileText, Zap, Lightbulb, Sparkles, Flame, Puzzle, Link as LinkIcon, ExternalLink, Waves } from 'lucide-react';
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
            className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-3 sm:p-6 bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 rounded-3xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 active:scale-95 group w-full backdrop-blur-sm"
        >
            <div className={`p-3 rounded-2xl bg-white/80 dark:bg-slate-700/80 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className={`${tool.color} sm:w-8 sm:h-8`} />
            </div>
            <span className="text-[10px] sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">
                {tool.title.split(' ')[0]} {tool.title.split(' ')[1]}
            </span>
        </button>
    );
};

// FIX: Define BriefingData type used in the useGemini hook for DashboardScreen.
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
    }, [memory, persona, botName]);

    const suggestions = briefing?.suggestions || ["اكتب نكتة", "لخص مفهوم الثقب الأسود", "اقترح فكرة مشروع", "إيه رأيك في الذكاء الاصطناعي؟"];
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
        <div className="flex flex-col items-center justify-start pt-8 sm:pt-20 p-4 text-center w-full min-h-full pb-24">
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
                <div className={`relative w-20 h-20 sm:w-28 sm:h-28 mb-4 sm:mb-6 animate-zoomIn`}>
                    <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${isFahimkom ? 'bg-orange-500/40' : 'bg-blue-500/30'}`}></div>
                    <div className={`relative w-full h-full bg-gradient-to-br rounded-full flex items-center justify-center shadow-2xl border-2 border-white dark:border-slate-700 ${isFahimkom ? 'from-white to-orange-50 dark:from-slate-800 dark:to-slate-900' : 'from-white to-slate-100 dark:from-slate-800 dark:to-slate-900'}`}>
                        {isFahimkom ? <Zap className="w-10 h-10 sm:w-16 sm:h-16 text-orange-500 drop-shadow-lg fill-orange-500/10" /> : <Bot className="w-10 h-10 sm:w-16 sm:h-16 text-primary drop-shadow-lg" />}
                    </div>
                </div>
                {isBriefingLoading ? <Skeleton className="h-10 w-48 sm:h-12 sm:w-64 mb-4 rounded-xl mx-auto" /> : <h2 className={`text-2xl sm:text-5xl font-black mb-2 sm:mb-4 animate-slideInUpFade bg-clip-text text-transparent leading-tight px-4 py-2 ${textShimmerClass}`}>{briefing?.greeting || `${botName} تحت أمرك`}</h2>}
                <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-10 max-w-xl animate-slideInUpFade leading-relaxed font-medium px-2">{isFahimkom ? "جاهز يا وحش. عايز تخلص إيه النهاردة؟" : "مساعدك الشخصي الذكي. اسأل، اطلب، أو استخدم أدواتي السحرية."}</p>
                <div className="w-full mb-6 sm:mb-10 animate-slideInUpFade delay-100"><h3 className="text-start text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 px-2 uppercase tracking-wider">أدوات شائعة</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">{quickTools.map(id => <QuickToolButton key={id} toolId={id} />)}</div></div>
                <div className="w-full animate-slideInUpFade delay-200"><h3 className="text-start text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 px-2 uppercase tracking-wider">جرب تسألني</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">{isBriefingLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-2xl" />) : suggestions.map((s, i) => <button key={s} onClick={() => onSuggestionClick(s)} className="group flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-start text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] backdrop-blur-sm"><span className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-full group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">{getSuggestionIcon(i)}</span><span className="flex-1 text-slate-700 dark:text-slate-200 line-clamp-2">{s}</span><ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors rtl:rotate-180" /></button>)}</div></div>
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
        <div className={`prose prose-base max-w-none ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} font-sans`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                p: ({ children }) => {
                    if (Array.isArray(children) && typeof children[0] === 'string' && children[0].startsWith('[TOOL:')) {
                        const toolId = children[0].match(/\[TOOL:(.*?)\]/)?.[1];
                        return toolId ? <ToolSuggestionCard toolId={toolId} /> : <p>{children}</p>;
                    }
                    return <p className={`mb-3 last:mb-0 leading-7 text-[15px] sm:text-base ${message.role === 'user' ? 'text-white/95' : 'text-slate-800 dark:text-slate-200'}`}>{children}</p>
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
    
    useLayoutEffect(() => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
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
            if (userMessage.imageUrl) { // Image was attached
                const response = await fetch(userMessage.imageUrl!);
                const blob = await response.blob();
                const mimeType = userMessage.imageUrl!.match(/data:(.*?);base64,/)?.[1] || blob.type;
                fileToSend = new File([blob], 'uploaded-image.png', { type: mimeType });
            } else if (userMessage.fileInfo) { // Other file type was attached
                const matchingFile = attachedFile; // Assume attachedFile holds the latest file
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
            setAttachedFile(null); // Clear file after processing
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
        if (e.target) e.target.value = ''; // Allow re-uploading same file
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
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-6 pb-4 scroll-smooth">
                {activeConversation.messages.length === 0 ? <DashboardScreen onSuggestionClick={(prompt) => submitMessage(prompt)} /> : (
                    <div className="space-y-6">
                        {activeConversation.messages.map((msg, index) => (
                            <div key={msg.id} className={`flex w-full animate-slideInUpFade group ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex items-start gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`mt-2 self-start flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-primary/10' : 'bg-white dark:bg-slate-700'}`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-primary" /> : <Bot className={`w-5 h-5 ${msg.senderName === 'فهيمكم' ? 'text-orange-500' : 'text-blue-500'}`} />}
                                    </div>
                                    <div className={`flex flex-col gap-1 min-w-0 w-full ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">{msg.role === 'model' ? msg.senderName : 'أنت'}</p>
                                        {editingMessage?.id === msg.id ? (
                                            <div className="w-full p-2 bg-white dark:bg-slate-800 border border-primary rounded-xl">
                                                <AutoGrowTextarea value={editingMessage.text} onChange={e => setEditingMessage({...editingMessage, text: e.target.value})} className="w-full bg-transparent focus:outline-none text-sm"/>
                                                <div className="flex justify-end gap-2 mt-2"><Button variant="secondary" onClick={() => setEditingMessage(null)}>إلغاء</Button><Button onClick={handleSaveEdit} icon={<Save size={16}/>}>حفظ</Button></div>
                                            </div>
                                        ) : (
                                            <>
                                                {msg.imageUrl && <div className="p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"><img onClick={() => setSelectedImage(msg.imageUrl!)} src={msg.imageUrl} alt="upload" className="rounded-md max-h-48 object-cover cursor-zoom-in" /></div>}
                                                {msg.fileInfo && <div className="p-2 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"><FileText className="w-5 h-5 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-300">{msg.fileInfo.name}</span></div>}
                                                {(msg.parts[0].text || msg.isStreaming) && <div className={`relative p-3 sm:p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-foreground dark:text-dark-foreground rounded-bl-none border border-slate-100 dark:border-slate-700 w-full'}`}>{msg.isStreaming && !msg.parts[0].text ? <div className="flex gap-1.5 h-6 items-center px-2"><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0s'}}/><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/><span className="w-2 h-2 bg-current opacity-50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}/></div> : <MessageContent message={msg} />}</div>}
                                            </>
                                        )}
                                        {msg.error && <button onClick={() => handleRegenerate(msg.id)} className="text-red-500 flex items-center gap-1 text-xs px-1 opacity-70"><RefreshCw size={12}/> فشل، حاول تاني</button>}
                                    </div>
                                    <div className="relative self-center flex-shrink-0">
                                        <button aria-label="خيارات الرسالة" onClick={() => setMenuOpenFor(menuOpenFor === msg.id ? null : msg.id)} className="p-2 rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"><MoreVertical size={16}/></button>
                                        {menuOpenFor === msg.id && (
                                            <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-48 bg-background dark:bg-dark-card shadow-xl rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-1.5 z-20 animate-zoomIn" onMouseLeave={() => setMenuOpenFor(null)}>
                                                <button onClick={() => { navigator.clipboard.writeText(msg.parts[0].text); addToast('تم النسخ!'); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><Copy size={14}/> نسخ</button>
                                                {msg.role === 'user' && <button onClick={() => { setEditingMessage({id: msg.id, text: msg.parts[0].text}); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><Edit size={14}/> تعديل</button>}
                                                {msg.role === 'model' && <button onClick={() => { handleRegenerate(msg.id); setMenuOpenFor(null); }} className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><RefreshCw size={14}/> إعادة توليد</button>}
                                                {msg.role === 'model' && <button onClick={() => handleSpeech(msg.parts[0].text, msg.id)} className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><Volume2 size={14}/> {speakingMessageId === msg.id ? 'إيقاف' : 'قراءة'}</button>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/80 dark:bg-dark-card/80 backdrop-blur-xl z-10">
                {attachedFile && (
                    <div className="relative w-fit max-w-full mb-2 p-2 pr-8 border rounded-lg border-primary/50 bg-primary/10 animate-slideInUpFade">
                        <div className='flex items-center gap-2 text-primary'>
                            {attachedFile.type.startsWith('image/') ? <img src={URL.createObjectURL(attachedFile)} alt="Preview" className="w-10 h-10 object-cover rounded-md"/> : <FileText size={24} />}
                            <span className='text-sm font-medium truncate'>{attachedFile.name}</span>
                        </div>
                        <button onClick={() => setAttachedFile(null)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X size={14} /></button>
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <Button 
                        onClick={handleListen} 
                        variant="secondary" 
                        aria-label="إدخال صوتي" 
                        className={`p-3 rounded-full shadow-sm relative overflow-hidden ${isListening ? 'bg-red-500 text-white' : ''}`}
                    >
                        {isListening ? <Waves size={20} /> : <Mic size={20} />}
                    </Button>
                    <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        variant="secondary" 
                        aria-label="إرفاق ملف" 
                        className="p-3 rounded-full shadow-sm"
                    >
                        <Paperclip size={20} />
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf,text/plain" className="hidden" />

                    <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/50 flex items-end">
                        <AutoGrowTextarea 
                            ref={inputRef} 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                            placeholder="اسأل خبيركم..." 
                            className="w-full max-h-32 py-3 px-4 bg-transparent border-none focus:ring-0 resize-none text-sm sm:text-base placeholder:text-slate-400 textarea-scrollbar"
                        />
                    </div>
                     <Button 
                        onClick={isResponding ? () => { stopStreamingRef.current = true; } : handleSend} 
                        disabled={!isResponding && !input.trim() && !attachedFile} 
                        className="p-3 rounded-full shadow-md"
                        aria-label={isResponding ? "إيقاف" : "إرسال"}
                    >
                        {isResponding ? <StopCircle size={20} /> : <Send size={20} />}
                    </Button>
                </div>
            </div>
            {selectedImage && <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 animate-zoomIn" onClick={() => setSelectedImage(null)}><img src={selectedImage} alt="Full" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /><button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 p-2 text-white bg-white/10 rounded-full"><X size={24} /></button></div>}
        </div>
    );
};

export default Chat;