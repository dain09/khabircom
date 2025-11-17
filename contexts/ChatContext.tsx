import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';

interface ChatContextType {
    conversations: Conversation[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    activeConversation: Conversation | null;
    createNewConversation: () => Conversation;
    deleteConversation: (id: string) => void;
    renameConversation: (id: string, newTitle: string) => void;
    addMessageToConversation: (id: string, message: Message) => void;
    updateMessageInConversation: (conversationId: string, messageId: string, updates: Partial<Omit<Message, 'id'>>) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const localData = localStorage.getItem('chat-conversations');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('chat-conversations', JSON.stringify(conversations));
        } catch (error) {
            console.error("Failed to save conversations to localStorage", error);
        }
    }, [conversations]);

    const createNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: uuidv4(),
            title: 'محادثة جديدة',
            messages: [],
            createdAt: new Date().toISOString(),
            toolId: 'chat',
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        return newConversation;
    }, []);

    const deleteConversation = useCallback((id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(null);
        }
    }, [activeConversationId]);
    
    const renameConversation = useCallback((id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    }, []);

    const addMessageToConversation = useCallback((id: string, message: Message) => {
        setConversations(prev => {
            return prev.map(convo => {
                if (convo.id === id) {
                    const newMessages = [...convo.messages, message];
                    // Auto-rename conversation if it's new
                    const isNew = convo.title === 'محادثة جديدة' && convo.messages.length === 0 && message.role === 'user';
                    const newTitle = isNew ? message.parts[0].text.substring(0, 30) : convo.title;
                    return { ...convo, messages: newMessages, title: newTitle };
                }
                return convo;
            });
        });
    }, []);

    const updateMessageInConversation = useCallback((conversationId: string, messageId: string, updates: Partial<Omit<Message, 'id'>>) => {
        setConversations(prev => prev.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    messages: convo.messages.map(msg => 
                        msg.id === messageId ? { ...msg, ...updates } : msg
                    )
                };
            }
            return convo;
        }));
    }, []);
    
    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId) || null;
    }, [conversations, activeConversationId]);
    
    const value = useMemo(() => ({
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        createNewConversation,
        deleteConversation,
        renameConversation,
        addMessageToConversation,
        updateMessageInConversation,
    }), [conversations, activeConversationId, activeConversation, createNewConversation, deleteConversation, renameConversation, addMessageToConversation, updateMessageInConversation]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};