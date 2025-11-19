
import {
    MessageSquare, Flame, Image as ImageIcon, Smile, Languages, Newspaper, Sparkles, Mic,
    Cloud, CookingPot, BookOpen, FileText, GraduationCap, Heart, Send, Swords,
    Lightbulb, Target, Zap, Paintbrush, Code, BrainCircuit, Wand2, SlidersHorizontal,
    CheckSquare, Tag, Star, Scale
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
    // Special tool, no category
    { id: 'chat', title: 'tools.chat.title', description: 'tools.chat.description', icon: MessageSquare, color: 'text-blue-500', category: '' },
    
    // الأدوات الجديدة
    { id: 'task-manager', title: 'tools.taskManager.title', description: 'tools.taskManager.description', icon: CheckSquare, color: 'text-emerald-500', category: 'categories.knowledge' },
    { id: 'price-comparator', title: 'tools.priceComparator.title', description: 'tools.priceComparator.description', icon: Tag, color: 'text-rose-500', category: 'categories.knowledge' },
    { id: 'the-judge', title: 'tools.theJudge.title', description: 'tools.theJudge.description', icon: Scale, color: 'text-slate-600', category: 'categories.fun' },

    // المرح والإبداع
    { id: 'text-roast', title: 'tools.textRoast.title', description: 'tools.textRoast.description', icon: Flame, color: 'text-green-500', category: 'categories.fun' },
    { id: 'image-roast', title: 'tools.imageRoast.title', description: 'tools.imageRoast.description', icon: ImageIcon, color: 'text-orange-500', category: 'categories.fun' },
    { id: 'meme-generator', title: 'tools.memeGenerator.title', description: 'tools.memeGenerator.description', icon: Smile, color: 'text-red-500', category: 'categories.fun' },
    { id: 'image-generator', title: 'tools.imageGenerator.title', description: 'tools.imageGenerator.description', icon: Paintbrush, color: 'text-teal-500', category: 'categories.fun' },
    { id: 'image-editor', title: 'tools.imageEditor.title', description: 'tools.imageEditor.description', icon: Wand2, color: 'text-purple-500', category: 'categories.fun' },
    { id: 'moods-generator', title: 'tools.moodsGenerator.title', description: 'tools.moodsGenerator.description', icon: Sparkles, color: 'text-gray-500', category: 'categories.fun' },
    { id: 'story-maker', title: 'tools.storyMaker.title', description: 'tools.storyMaker.description', icon: BookOpen, color: 'text-orange-400', category: 'categories.fun' },
    { id: 'ai-love-messages', title: 'tools.aiLoveMessages.title', description: 'tools.aiLoveMessages.description', icon: Heart, color: 'text-yellow-400', category: 'categories.fun' },
    { id: 'name-generator', title: 'tools.nameGenerator.title', description: 'tools.nameGenerator.description', icon: Lightbulb, color: 'text-green-600', category: 'categories.fun' },
    { id: 'ai-motivator', title: 'tools.aiMotivator.title', description: 'tools.aiMotivator.description', icon: Zap, color: 'text-red-600', category: 'categories.fun' },
    { id: 'post-generator', title: 'tools.postGenerator.title', description: 'tools.postGenerator.description', icon: Send, color: 'text-brown-400', category: 'categories.fun' },

    // أدوات النصوص
    { id: 'dialect-converter', title: 'tools.dialectConverter.title', description: 'tools.dialectConverter.description', icon: Languages, color: 'text-purple-500', category: 'categories.text' },
    { id: 'news-summarizer', title: 'tools.newsSummarizer.title', description: 'tools.newsSummarizer.description', icon: Newspaper, color: 'text-yellow-500', category: 'categories.text' },
    { id: 'pdf-summarizer', title: 'tools.pdfSummarizer.title', description: 'tools.pdfSummarizer.description', icon: FileText, color: 'text-red-400', category: 'categories.text' },
    { id: 'text-converter', title: 'tools.textConverter.title', description: 'tools.textConverter.description', icon: Swords, color: 'text-blue-600', category: 'categories.text' },
    { id: 'code-explainer', title: 'tools.codeExplainer.title', description: 'tools.codeExplainer.description', icon: Code, color: 'text-indigo-500', category: 'categories.text' },

    // المعرفة والمساعدة
    { id: 'dream-interpreter', title: 'tools.dreamInterpreter.title', description: 'tools.dreamInterpreter.description', icon: Cloud, color: 'text-blue-400', category: 'categories.knowledge' },
    { id: 'ai-teacher', title: 'tools.aiTeacher.title', description: 'tools.aiTeacher.description', icon: GraduationCap, color: 'text-purple-400', category: 'categories.knowledge' },
    { id: 'habit-analyzer', title: 'tools.habitAnalyzer.title', description: 'tools.habitAnalyzer.description', icon: Target, color: 'text-orange-600', category: 'categories.knowledge' },
    { id: 'memory-manager', title: 'tools.memoryManager.title', description: 'tools.memoryManager.description', icon: BrainCircuit, color: 'text-pink-500', category: 'categories.knowledge' },
    { id: 'khabirkom-settings', title: 'tools.settings.title', description: 'tools.settings.description', icon: SlidersHorizontal, color: 'text-cyan-500', category: 'categories.knowledge' },

    // الإنتاجية اليومية
    { id: 'voice-analysis', title: 'tools.voiceAnalysis.title', description: 'tools.voiceAnalysis.description', icon: Mic, color: 'text-brown-500', category: 'categories.productivity' },
    { id: 'recipe-generator', title: 'tools.recipeGenerator.title', description: 'tools.recipeGenerator.description', icon: CookingPot, color: 'text-green-400', category: 'categories.productivity' },
];
