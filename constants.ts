
import {
    MessageSquare, Flame, Image as ImageIcon, Smile, Languages, Newspaper, Sparkles, Mic,
    Cloud, CookingPot, BookOpen, FileText, GraduationCap, Heart, Voicemail, Send, Swords,
    Lightbulb, Target, Zap, Paintbrush
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
    // Special tool, no category
    { id: 'chat', title: 'دردشة مع خبيركم', description: 'اسأل، اطلب، فضفض... أنا معاك', icon: MessageSquare, color: 'text-blue-500', category: '' },
    
    // المرح والإبداع
    { id: 'text-roast', title: 'تحفيل على الكلام', description: 'ابعت أي جملة وأنا هروّق عليها', icon: Flame, color: 'text-green-500', category: 'المرح والإبداع' },
    { id: 'image-roast', title: 'تحفيل على الصور', description: 'وريني أي صورة وأنا هقولك رأيي بصراحة', icon: ImageIcon, color: 'text-orange-500', category: 'المرح والإبداع' },
    { id: 'meme-generator', title: 'صانع الميمز', description: 'حوّل صورك لميمز تفرط من الضحك', icon: Smile, color: 'text-red-500', category: 'المرح والإبداع' },
    { id: 'image-generator', title: 'رسام الخبير', description: 'حوّل خيالك لصور فنية بالذكاء الاصطناعي', icon: Paintbrush, color: 'text-teal-500', category: 'المرح والإبداع' },
    { id: 'moods-generator', title: 'محلل المود', description: 'اكتب أي حاجة والخبير هيحلل مودك بطريقة كوميدية', icon: Sparkles, color: 'text-gray-500', category: 'المرح والإبداع' },
    { id: 'story-maker', title: 'مكمل السيناريوهات', description: 'ابدأ أي سيناريو وأنا هكملهولك بنهاية كوميدية', icon: BookOpen, color: 'text-orange-400', category: 'المرح والإبداع' },
    { id: 'ai-love-messages', title: 'رسائل الحب والغرام', description: 'رسائل لكل الأذواق والمناسبات، حتى العتاب الرخم', icon: Heart, color: 'text-yellow-400', category: 'المرح والإبداع' },
    { id: 'name-generator', title: 'مولد الأسماء', description: 'أسماء مشاريع وحسابات مبتكرة', icon: Lightbulb, color: 'text-green-600', category: 'المرح والإبداع' },
    { id: 'ai-motivator', title: 'المحفز الرخم', description: 'كلام يحفزك... بس على طريقتي', icon: Zap, color: 'text-red-600', category: 'المرح والإبداع' },
    { id: 'post-generator', title: 'مولد بوستات السوشيال', description: 'بوستات جاهزة لكل المنصات', icon: Send, color: 'text-brown-400', category: 'المرح والإبداع' },

    // أدوات النصوص
    { id: 'dialect-converter', title: 'مترجم اللهجات', description: 'ترجم أي كلام لأي لهجة بمزاج', icon: Languages, color: 'text-purple-500', category: 'أدوات النصوص' },
    { id: 'news-summarizer', title: 'ملخص الأخبار الفوري', description: 'لخّص أي خبر في ثواني, بجد أو بهزار', icon: Newspaper, color: 'text-yellow-500', category: 'أدوات النصوص' },
    { id: 'pdf-summarizer', title: 'ملخص الملفات والنصوص', description: 'لخّص أي ملف أو كلام كتير', icon: FileText, color: 'text-red-400', category: 'أدوات النصوص' },
    { id: 'text-converter', title: 'محول الأساليب', description: 'غيّر أسلوب أي كلام بمزاجك', icon: Swords, color: 'text-blue-600', category: 'أدوات النصوص' },

    // المعرفة والمساعدة
    { id: 'dream-interpreter', title: 'مفسر الأحلام الفلكي', description: 'تفسيرات منطقية وفكاهية لأحلامك', icon: Cloud, color: 'text-blue-400', category: 'المعرفة والمساعدة' },
    { id: 'ai-teacher', title: 'الأستاذ الفهلوي في التخطيط', description: 'اديني اسم موضوع صعب وأنا هعملك خطة مذاكرة فهلوانية', icon: GraduationCap, color: 'text-purple-400', category: 'المعرفة والمساعدة' },
    { id: 'habit-analyzer', title: 'المحلل الفهلوي', description: 'قول 5 حاجات عنك وأنا هطلعلك موهبتك الخفية', icon: Target, color: 'text-orange-600', category: 'المعرفة والمساعدة' },

    // الإنتاجية اليومية
    { id: 'voice-analysis', title: 'تحليل الصوت', description: 'من صوتك هقولك مودك إيه (تجريبي)', icon: Mic, color: 'text-brown-500', category: 'الإنتاجية اليومية' },
    { id: 'recipe-generator', title: 'وصفات على قد الإيد', description: 'قولي عندك إيه وأنا هعملك أكلة', icon: CookingPot, color: 'text-green-400', category: 'الإنتاجية اليومية' },
    { id: 'voice-commands', title: 'الأوامر الصوتية', description: 'دوس واتكلم، وأنا هنفذ (تجريبي)', icon: Voicemail, color: 'text-gray-400', category: 'الإنتاجية اليومية' },
];