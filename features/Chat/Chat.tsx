
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateChatResponseStream } from '../../services/geminiService';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { v4 as uuidv4 } from 'uuid';

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
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages, isLoading]);

    const streamModelResponse = useCallback(async (convoId: string, userMessage: Message) => {
        setIsLoading(true);
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
            updateMessageInConversation(convoId, modelMessageId, {
                parts: [{ text: fullText ? `${fullText}\n\n[عذراً، حصل خطأ أثناء توليد الرد]` : "[عذراً، حصل خطأ]" }],
                error: true,
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [conversations, addMessageToConversation, updateMessageInConversation]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;

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

    }, [input, isLoading, activeConversationId, createNewConversation, addMessageToConversation, streamModelResponse]);

    const handleRetry = useCallback((failedMessage: Message) => {
        if (!activeConversationId) return;
        updateMessageInConversation(activeConversationId, failedMessage.id, { error: false });
        streamModelResponse(activeConversationId, failedMessage);
    }, [activeConversationId, updateMessageInConversation, streamModelResponse]);

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
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 rounded-xl shadow-xl transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {activeConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 animate-bubbleIn ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        
                        {msg.role === 'model' && (
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                        )}
                        
                        <div className="flex flex-col items-end">
                            <div className={`max-w-lg p-3 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-bl-none' 
                                : `bg-slate-200 dark:bg-slate-700 text-foreground dark:text-dark-foreground rounded-br-none ${msg.error ? 'border border-red-500/50' : ''}`
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                            {msg.error && msg.role === 'user' && (
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-xs text-red-500">فشل الإرسال</span>
                                    <button onClick={() => handleRetry(msg)} className="p-1 text-primary hover:bg-primary/10 rounded-full" aria-label="إعادة المحاولة">
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-background/70 dark:bg-dark-card/70 backdrop-blur-lg rounded-b-xl">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اسأل أي حاجة..."
                        className="flex-1 p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                        aria-label="اكتب رسالتك هنا"
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3" aria-label="إرسال الرسالة">
                        {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Chat;