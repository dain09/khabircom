
import React, { useState } from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { usePersona } from '../../hooks/usePersona';
import { SlidersHorizontal, Info, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Settings: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'khabirkom-settings')!;
    const { persona, setHumor, setVerbosity, setInterests } = usePersona();
    const [tempInterests, setTempInterests] = useState(persona.interests.join(', '));
    
    const handleInterestsBlur = () => {
        const interestsArray = tempInterests.split(',').map(i => i.trim()).filter(Boolean);
        setInterests(interestsArray);
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
            introText="هنا تقدر تتحكم في شخصية 'خبيركم'. التغييرات اللي هتعملها هنا هتأثر على طريقة كلامه وردوده في الدردشة عشان يبقى على مزاجك بالظبط."
        >
            <div className="space-y-8">
                <SettingSlider
                    label="مؤشر الهزار"
                    value={persona.humor}
                    onChange={setHumor}
                    minLabel="جد جدًا"
                    maxLabel="تحفيل للصبح"
                />
                
                <SettingSlider
                    label="مؤشر التفاصيل"
                    value={persona.verbosity}
                    onChange={setVerbosity}
                    minLabel="مختصر ومفيد"
                    maxLabel="رغاي وبيشرح"
                />

                <div className="space-y-2">
                    <label htmlFor="interests" className="block font-semibold">اهتماماتك</label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        اكتب اهتماماتك (زي: برمجة, كورة, أفلام) مفصولة بـ "فاصلة". ده هيساعد الخبير يركز على المواضيع دي في كلامه.
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
        </ToolContainer>
    );
};

export default Settings;
