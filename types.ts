
import { LucideIcon } from 'lucide-react';

export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    category: string;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    parts: { text: string }[];
    timestamp: string;
    error?: boolean;
    imageUrl?: string; // For UI rendering
    isStreaming?: boolean; // To control UI during streaming
}

export interface Conversation {
    id:string;
    title: string;
    messages: Message[];
    createdAt: string;
    toolId: string;
}

// Fix: Add AnalysisResult interface for use in voice analysis feature.
export interface AnalysisResult {
    mood: string;
    energy: string;
    roast: string;
    advice: string;
}

export interface PersonaSettings {
    humor: number;
    verbosity: number;
    interests: string[];
}
