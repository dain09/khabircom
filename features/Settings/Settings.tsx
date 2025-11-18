
import React, { useState } from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { usePersona } from '../../contexts/PersonaContext';
import { SlidersHorizontal, Heart, Zap, User, BrainCircuit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';

const Settings: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'khabirkom-settings')!;
    const { persona, setHumor, setVerbosity, setInterests, setPersona } = usePersona();
    const { addToast } = useToast();
    const [tempInterests, setTempInterests] = useState(persona.interests.join(', '));
    
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
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                                persona.verbosity > 5 
                                ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                            }`}
                        >
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
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                                persona.verbosity <= 3 && persona.humor >= 8
                                ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                            }`}
                        >
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
        </ToolContainer>
    );
};

export default Settings;
