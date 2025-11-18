
import React, { useState, useRef, useMemo } from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { usePersona } from '../../contexts/PersonaContext';
import { useTool } from '../../hooks/useTool';
import { SlidersHorizontal, Heart, Zap, User, BrainCircuit, Download, Upload, KeyRound, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { ApiKeyManager } from '../../components/ApiKeyManager';

const Settings: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'khabirkom-settings')!;
    const { persona, setHumor, setVerbosity, setInterests, setPersona } = usePersona();
    const { setActiveToolId } = useTool();
    const { addToast } = useToast();
    const [tempInterests, setTempInterests] = useState(persona.interests.join(', '));
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const fileImportRef = useRef<HTMLInputElement>(null);
    
    // Determine active persona for UI feedback
    // Fahimkom Logic: Humor > 7 AND Verbosity < 5
    const activePersona = useMemo(() => {
        if (persona.humor > 7 && persona.verbosity < 5) return 'fahimkom';
        return 'khabirkom';
    }, [persona.humor, persona.verbosity]);

    const handleInterestsBlur = () => {
        const interestsArray = tempInterests.split(',').map(i => i.trim()).filter(Boolean);
        setInterests(interestsArray);
    };

    const handlePreset = (type: 'khabirkom' | 'fahimkom') => {
        if (type === 'khabirkom') {
            setPersona({ ...persona, humor: 5, verbosity: 8 });
            addToast('تمام، رجعتلك خبيركم الرزين والمفصل! 🧐');
        } else {
            setPersona({ ...persona, humor: 10, verbosity: 2 });
            addToast('أهلين! أنا فهيمكم، هات من الآخر! 😂');
        }
    };

    const handleMoralSupport = () => {
        addToast("جدع يا خبيركم، عاش يا وحش! 🔋❤️", { 
            icon: <Heart className="text-red-500 fill-red-500 animate-pulse" />,
            duration: 4000
        });
    };

    const handleExportData = () => {
        const data = {
            conversations: localStorage.getItem('chat-conversations'),
            memory: localStorage.getItem('khabirkom-user-memory'),
            persona: localStorage.getItem('khabirkom-persona-settings'),
            recentTools: localStorage.getItem('khabirkom-recent-tools'),
            theme: localStorage.getItem('theme'),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `khabirkom-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);
                
                if (data.conversations) localStorage.setItem('chat-conversations', data.conversations);
                if (data.memory) localStorage.setItem('khabirkom-user-memory', data.memory);
                if (data.persona) localStorage.setItem('khabirkom-persona-settings', data.persona);
                if (data.recentTools) localStorage.setItem('khabirkom-recent-tools', data.recentTools);
                if (data.theme) localStorage.setItem('theme', data.theme);
                
                alert('تم استعادة البيانات بنجاح! سيتم إعادة تحميل الصفحة.');
                window.location.reload();
            } catch (error) {
                console.error("Import failed", error);
                alert('فشل استيراد الملف. تأكد أنه ملف نسخ احتياطي صالح.');
            }
        };
        reader.readAsText(file);
        if (fileImportRef.current) fileImportRef.current.value = '';
    };

    const SettingSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void; minLabel: string; maxLabel: string; }> = ({ label, value, onChange, minLabel, maxLabel }) => (
        <div className="space-y-2">
            <label className="block font-semibold">{label}</label>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{minLabel}</span>
                <span className="font-bold text-primary">{value}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="هنا غرفة التحكم في مخي. عايزني رزين؟ عايزني مسخره؟ عايز أخويا الصغير 'فهيمكم'؟ كله بإيدك."
        >
            <div className="space-y-10">
                
                {/* Presets Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary"/> اختر الشخصية
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => handlePreset('khabirkom')}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                                activePersona === 'khabirkom'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-[1.02]' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 opacity-70 hover:opacity-100'
                            }`}
                        >
                            {activePersona === 'khabirkom' && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle2 size={20} /></div>}
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <BrainCircuit size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">خبيركم (الأصلي)</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">رزين، بيشرح بالتفصيل، وكوميديا موزونة.</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => handlePreset('fahimkom')}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                                activePersona === 'fahimkom'
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-[1.02]' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 opacity-70 hover:opacity-100'
                            }`}
                        >
                             {activePersona === 'fahimkom' && <div className="absolute top-2 right-2 text-orange-500"><CheckCircle2 size={20} /></div>}
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                                <Zap size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">فهيمكم (أخويا الصغير)</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">سريع، بيجيب من الآخر، وبيموت في الهزار.</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Fine Tuning Section */}
                <div>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <SlidersHorizontal size={20} className="text-primary"/> التظبيط اليدوي
                    </h3>
                    <div className="space-y-8">
                        <SettingSlider
                            label="مؤشر الهزار"
                            value={persona.humor}
                            onChange={setHumor}
                            minLabel="جد جدًا 😐"
                            maxLabel="تحفيل للصبح 😂"
                        />
                        
                        <SettingSlider
                            label="مؤشر التفاصيل"
                            value={persona.verbosity}
                            onChange={setVerbosity}
                            minLabel="كلمة ورد غطاها ⚡"
                            maxLabel="اشرحلي قصة حياتك 📜"
                        />

                        <div className="space-y-2">
                            <label htmlFor="interests" className="block font-semibold">اهتماماتك</label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                اكتب اهتماماتك (زي: برمجة, كورة, أفلام) مفصولة بـ "فاصلة". ده هيساعدني أركز عليها وأنا برغي معاك.
                            </p>
                            <input
                                id="interests"
                                type="text"
                                value={tempInterests}
                                onChange={(e) => setTempInterests(e.target.value)}
                                onBlur={handleInterestsBlur}
                                placeholder="برمجة, كورة, أفلام..."
                                className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Admin Zone - Data & Keys */}
                <div className="relative p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="absolute -top-3 right-6 px-3 bg-background dark:bg-dark-card text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-primary" /> المنطقة الإدارية
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* API Keys */}
                        <div className="flex flex-col gap-2">
                            <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300">إعدادات الاتصال</h4>
                            <Button 
                                onClick={() => setApiKeyManagerOpen(true)} 
                                className="w-full justify-start bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                                icon={<KeyRound size={18} className="text-green-500"/>}
                            >
                                إدارة مفاتيح API
                            </Button>
                            <Button 
                                onClick={() => setActiveToolId('memory-manager')} 
                                className="w-full justify-start bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                                icon={<Database size={18} className="text-pink-500"/>}
                            >
                                إدارة الذاكرة (البيانات المحفوظة)
                            </Button>
                        </div>

                        {/* Data Export/Import */}
                        <div className="flex flex-col gap-2">
                            <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300">النسخ الاحتياطي</h4>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={handleExportData} 
                                    className="flex-1 justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                                    icon={<Download size={18} className="text-blue-500"/>}
                                >
                                    تصدير
                                </Button>
                                <Button 
                                    onClick={() => fileImportRef.current?.click()} 
                                    className="flex-1 justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                                    icon={<Upload size={18} className="text-purple-500"/>}
                                >
                                    استيراد
                                </Button>
                                <input type="file" ref={fileImportRef} onChange={handleImportData} accept=".json" className="hidden" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                                احفظ نسخة من بياناتك (المحادثات، الذاكرة، الإعدادات) عشان ما تضعش.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Moral Support Section */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 rounded-xl border border-pink-500/20 text-center">
                    <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-2">منطقة الدعم المعنوي</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        لو حسيت إني عملت شغل عالي النهاردة، دوس هنا عشان ترفع معنوياتي (السيرفر بيفرح والله).
                    </p>
                    <Button 
                        onClick={handleMoralSupport} 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:-translate-y-1"
                        icon={<Heart className="fill-white" />}
                    >
                        شحن معنوي
                    </Button>
                </div>

            </div>
            <ApiKeyManager isOpen={isApiKeyManagerOpen} onClose={() => setApiKeyManagerOpen(false)} />
        </ToolContainer>
    );
};

export default Settings;
