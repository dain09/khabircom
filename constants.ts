
import {
    MessageSquare, Flame, Image as ImageIcon, Smile, Languages, Newspaper, Sparkles, Mic,
    Cloud, CookingPot, BookOpen, FileText, GraduationCap, Heart, Voicemail, Send, Swords,
    Lightbulb, Target, Zap, Paintbrush
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
    { id: 'chat', title: 'دردشة مع خبيركم', description: 'اسأل، اطلب، فضفض... أنا معاك', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'text-roast', title: 'تحفيل على الكلام', description: 'ابعت أي جملة وأنا هروّق عليها', icon: Flame, color: 'text-green-500' },
    { id: 'image-roast', title: 'تحفيل على الصور', description: 'وريني أي صورة وأنا هقولك رأيي بصراحة', icon: ImageIcon, color: 'text-orange-500' },
    { id: 'meme-generator', title: 'صانع الميمز', description: 'حوّل صورك لميمز تفرط من الضحك', icon: Smile, color: 'text-red-500' },
    { id: 'image-generator', title: 'رسام الخبير', description: 'حوّل خيالك لصور فنية بالذكاء الاصطناعي', icon: Paintbrush, color: 'text-teal-500' },
    { id: 'dialect-converter', title: 'مترجم اللهجات', description: 'ترجم أي كلام لأي لهجة بمزاج', icon: Languages, color: 'text-purple-500' },
    { id: 'news-summarizer', title: 'ملخص الأخبار الفوري', description: 'لخّص أي خبر في ثواني، بجد أو بهزار', icon: Newspaper, color: 'text-yellow-500' },
    { id: 'moods-generator', title: 'مولد المود', description: 'قولي مودك وأنا هظبطك', icon: Sparkles, color: 'text-gray-500' },
    { id: 'voice-analysis', title: 'تحليل الصوت', description: 'من صوتك هقولك مودك إيه (تجريبي)', icon: Mic, color: 'text-brown-500' },
    { id: 'dream-interpreter', title: 'مفسر الأحلام الفلكي', description: 'تفسيرات منطقية وفكاهية لأحلامك', icon: Cloud, color: 'text-blue-400' },
    { id: 'recipe-generator', title: 'وصفات على قد الإيد', description: 'قولي عندك إيه وأنا هعملك أكلة', icon: CookingPot, color: 'text-green-400' },
    { id: 'story-maker', title: 'مؤلف القصص', description: 'اديني خيط وأنا هنسجلك قصة', icon: BookOpen, color: 'text-orange-400' },
    { id: 'pdf-summarizer', title: 'ملخص الملفات والنصوص', description: 'لخّص أي ملف أو كلام كتير', icon: FileText, color: 'text-red-400' },
    { id: 'ai-teacher', title: 'الأستاذ الفهلوي', description: 'افهم أي حاجة بطريقة سهلة ومضحكة', icon: GraduationCap, color: 'text-purple-400' },
    { id: 'ai-love-messages', title: 'رسائل الحب والغرام', description: 'رسائل لكل الأذواق والمناسبات', icon: Heart, color: 'text-yellow-400' },
    { id: 'voice-commands', title: 'الأوامر الصوتية', description: 'دوس واتكلم، وأنا هنفذ (تجريبي)', icon: Voicemail, color: 'text-gray-400' },
    { id: 'post-generator', title: 'مولد بوستات السوشيال', description: 'بوستات جاهزة لكل المنصات', icon: Send, color: 'text-brown-400' },
    { id: 'text-converter', title: 'محول الأساليب', description: 'غيّر أسلوب أي كلام بمزاجك', icon: Swords, color: 'text-blue-600' },
    { id: 'name-generator', title: 'مولد الأسماء', description: 'أسماء مشاريع وحسابات مبتكرة', icon: Lightbulb, color: 'text-green-600' },
    { id: 'habit-analyzer', title: 'محلل العادات', description: 'حلل عاداتك اليومية بطريقة فكاهية', icon: Target, color: 'text-orange-600' },
    { id: 'ai-motivator', title: 'المحفز الرخم', description: 'كلام يحفزك... بس على طريقتي', icon: Zap, color: 'text-red-600' },
];