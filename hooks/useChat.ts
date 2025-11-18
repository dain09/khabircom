
import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import { useTool } from './useTool';

export const useChat = () => {
    const chatContext = useContext(ChatContext);
    const { activeConversationId, navigateTo } = useTool();

    if (chatContext === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    
    return {
        ...chatContext,
        activeConversationId, // Provide the ID derived from navigation
        setActiveConversationId: (id: string | null) => {
            navigateTo(id ? `chat/${id}` : 'chat/');
        },
    };
};
