
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';
import { useTool } from '../hooks/useTool';

interface ChatContextType {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    createNewConversation: () => Conversation;
    deleteConversation: (id: string) => void;
    renameConversation: (id: string, newTitle: string) => void;
    addMessageToConversation: (id: string, message: Message) => void;
    updateMessageInConversation: (conversationId: string, messageId: string, updates: Partial<Omit<Message, 'id'>>) => void;
    editUserMessageAndBranch: (conversationId: string, messageId: string, newText: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeConversationId, navigateTo, goBack } = useTool();

    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const localData = localStorage.getItem('chat-conversations');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

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
        navigateTo(`chat/${newConversation.id}`);
        return newConversation;
    }, [navigateTo]);

    const deleteConversation = useCallback((id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            goBack(); // Go back to the previous screen (likely the chat dashboard)
        }
    }, [activeConversationId, goBack]);
    
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

    const editUserMessageAndBranch = useCallback((conversationId: string, messageId: string, newText: string) => {
        setConversations(prev =>
            prev.map(convo => {
                if (convo.id === conversationId) {
                    const messageIndex = convo.messages.findIndex(m => m.id === messageId);
                    // Ensure we found the message and it's a user message
                    if (messageIndex === -1 || convo.messages[messageIndex].role !== 'user') {
                        return convo;
                    }

                    // Get all messages before the one being edited
                    const messagesBefore = convo.messages.slice(0, messageIndex);
                    
                    // Create the updated message
                    const editedMessage = {
                        ...convo.messages[messageIndex],
                        parts: [{ text: newText }],
                    };
                    
                    // Create the new message history, effectively branching from this point
                    const newMessages = [...messagesBefore, editedMessage];
                    
                    return { ...convo, messages: newMessages };
                }
                return convo;
            })
        );
    }, []);
    
    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId) || null;
    }, [conversations, activeConversationId]);
    
    const value = useMemo(() => ({
        conversations,
        activeConversation,
        createNewConversation,
        deleteConversation,
        renameConversation,
        addMessageToConversation,
        updateMessageInConversation,
        editUserMessageAndBranch,
    }), [conversations, activeConversation, createNewConversation, deleteConversation, renameConversation, addMessageToConversation, updateMessageInConversation, editUserMessageAndBranch]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
