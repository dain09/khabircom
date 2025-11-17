import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, RefreshCw, StopCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream } from '../../services/geminiService';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';

const WelcomeScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const suggestions = [
        "اكتبلي نكتة عن المبرمجين",
        "لخصلي مفهوم الثقب الأسود",
        "اقترح فكرة مشروع جديدة"
    ];
    return (
        <div className="flex flex-col h-full items-center justify-center text-center p-4">
            <div className="w-20 h-20 mb-4 bg-primary/20 rounded-full flex items-center justify-center animate-bubbleIn">
                <Bot size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2 animate-slideInUp" style={{ animationDelay: '100ms' }}>خبيركم تحت أمرك</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md animate-slideInUp" style={{ animationDelay: '200ms' }}>
                اسأل أي سؤال، اطلب أي طلب، أو اختار اقتراح من دول عشان نبدأ الكلام.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slideInUp" style={{ animationDelay: '300ms' }}>
                {suggestions.map((s, i) => (
                    <button 
                        key={s} 
                        onClick={() => onSuggestionClick(s)}
                        className="p-2 px-4 bg-slate-200/60 dark:bg-dark-card/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-full text-sm font-medium hover:bg-slate-300/60 dark:hover:bg-dark-card/80 transition-all hover:scale-105"
                        style={{ animationDelay: `${400 + i * 100}ms` }}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Chat: React.FC = () => {
    const { 
        activeConversation, 
        addMessageToConversation, 
        updateMessageInConversation,
        createNewConversation, 
        activeConversationId,
        conversations
    } = useChat();
    
    const [input, setInput] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const stopStreamingRef = useRef(false);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages, isResponding]);

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message) => {
        setIsResponding(true);
        stopStreamingRef.current = false;
        const modelMessageId = uuidv4();

        addMessageToConversation(convoId, {
            id: modelMessageId,
            role: 'model',
            parts: [{ text: '' }],
            timestamp: new Date().toISOString()
        });

        let fullText = '';
        try {
            const currentConvo = conversations.find(c => c.id === convoId);
            const historyForApi = currentConvo?.messages
                .filter(m => m.id !== userMessage.id && m.id !== modelMessageId && !m.error)
                || [];

            const stream = await generateChatResponseStream(historyForApi, userMessage.parts[0].text);

            for await (const chunk of stream) {
                if (stopStreamingRef.current) {
                    console.log("Streaming stopped by user.");
                    break;
                }
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    updateMessageInConversation(convoId, modelMessageId, {
                        parts: [{ text: fullText }],
                    });
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
            stopStreamingRef.current = false;
            inputRef.current?.focus();
        }
    }, [conversations, addMessageToConversation, updateMessageInConversation]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isResponding) return;

        let currentConvoId = activeConversationId;
        if (!currentConvoId) {
            const newConvo = createNewConversation();
            currentConvoId = newConvo.id;
        }

        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: input }],
            timestamp: new Date().toISOString()
        };

        addMessageToConversation(currentConvoId, userMessage);
        setInput('');
        
        await streamModelResponse(currentConvoId, userMessage);

    }, [input, isResponding, activeConversationId, createNewConversation, addMessageToConversation, streamModelResponse]);

    const handleStop = () => {
        stopStreamingRef.current = true;
        setIsResponding(false);
    };

    const handleRetry = useCallback((failedMessage: Message) => {
        if (!activeConversationId) return;
        
        const messages = activeConversation?.messages || [];
        const failedMessageIndex = messages.findIndex(m => m.id === failedMessage.id);
        const userMessage = messages[failedMessageIndex - 1];

        if (userMessage && userMessage.role === 'user') {
            updateMessageInConversation(activeConversationId, failedMessage.id, { error: false, parts: [{ text: '' }] });
            streamModelResponse(activeConversationId, userMessage);
        } else {
            console.error("Could not find user message to retry from.");
        }
    }, [activeConversationId, activeConversation?.messages, updateMessageInConversation, streamModelResponse]);


    const handleSuggestionClick = useCallback(async (prompt: string) => {
        const newConvo = createNewConversation();
        const convoId = newConvo.id;
        
        const userMessage: Message = { 
            id: uuidv4(),
            role: 'user', 
            parts: [{ text: prompt }],
            timestamp: new Date().toISOString()
        };
        
        addMessageToConversation(convoId, userMessage);
        await streamModelResponse(convoId, userMessage);
    }, [createNewConversation, addMessageToConversation, streamModelResponse]);


    if (!activeConversation) {
        return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-transparent sm:bg-background/70 sm:dark:bg-dark-card/70 backdrop-blur-lg sm:border border-white/20 dark:border-slate-700/30 sm:rounded-xl sm:shadow-xl transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-6">
                {activeConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 sm:gap-3 animate-bubbleIn ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        {/* User messages (right-aligned in RTL) */}
                        {msg.role === 'user' && (
                            <>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div className="flex flex-col max-w-lg items-start">
                                    <div className="p-3 rounded-2xl bg-primary text-primary-foreground rounded-br-none">
                                        <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* Model messages (left-aligned in RTL) */}
                        {msg.role === 'model' && (
                            <>
                                <div className={`flex flex-col max-w-lg items-start`}>
                                    <div className={`p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-bl-none ${msg.error ? 'border border-red-500/50' : ''}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text || ' '}</p>
                                    </div>
                                    {msg.error && (
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className="text-xs text-red-500">فشل الرد</span>
                                            <button onClick={() => handleRetry(msg)} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="إعادة المحاولة">
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            </>
                        )}
                    </div>
                ))}
                 {isResponding && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
                     <div className="flex items-end gap-3 animate-bubbleIn justify-end">
                        <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                     </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 sm:p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg sm:rounded-b-xl">
                <div className="flex items-end gap-2 sm:gap-3">
                    {isResponding ? (
                        <Button onClick={handleStop} className="p-3 bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white rounded-full" aria-label="إيقاف التوليد">
                            <StopCircle size={24} />
                        </Button>
                    ) : (
                        <Button onClick={handleSend} disabled={!input.trim()} className="p-3 rounded-full" aria-label="إرسال الرسالة">
                            <Send size={24} />
                        </Button>
                    )}
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
                        placeholder="اسأل أي حاجة... (Shift+Enter لسطر جديد)"
                        className="flex-1 p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60 resize-none max-h-40 glow-effect"
                        aria-label="اكتب رسالتك هنا"
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat;