
import React, { useState, useRef, useMemo } from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { usePersona } from '../../contexts/PersonaContext';
import { useTool } from '../../hooks/useTool';
import { SlidersHorizontal, Heart, Zap, User, BrainCircuit, Download, Upload, KeyRound, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { ApiKeyManager } from '../../components/ApiKeyManager';
import { useLanguage } from '../../hooks/useLanguage';

const Settings: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'khabirkom-settings')!;
    const { persona, setHumor, setVerbosity, setInterests, setPersona } = usePersona();
    const { navigateTo } = useTool();
    const { addToast } = useToast();
    const [tempInterests, setTempInterests] = useState(persona.interests.join(', '));
    const [isApiKeyManagerOpen, setApiKeyManagerOpen] = useState(false);
    const fileImportRef = useRef<HTMLInputElement>(null);
    
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
            addToast(t('tools.settings.presets.khabirkom.toast'));
        } else {
            setPersona({ ...persona, humor: 10, verbosity: 2 });
            addToast(t('tools.settings.presets.fahimkom.toast'));
        }
    };

    const handleMoralSupport = () => {
        addToast(t('tools.settings.moralSupport.toast'), { 
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
            favoriteTools: localStorage.getItem('khabirkom-favorite-tools'),
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
        addToast(t('tools.settings.data.exportSuccess'), { icon: <Download size={16}/> });
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
                if (data.favoriteTools) localStorage.setItem('khabirkom-favorite-tools', data.favoriteTools);
                if (data.theme) localStorage.setItem('theme', data.theme);
                
                alert(t('tools.settings.data.importSuccess'));
                window.location.reload();
            } catch (error) {
                console.error("Import failed", error);
                alert(t('tools.settings.data.importError'));
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
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.settings.intro')}
        >
            <div className="space-y-10">
                
                {/* Presets Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary"/> {t('tools.settings.presets.title')}
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
                                <h4 className="font-bold text-lg">{t('tools.settings.presets.khabirkom.name')}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('tools.settings.presets.khabirkom.description')}</p>
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
                                <h4 className="font-bold text-lg">{t('tools.settings.presets.fahimkom.name')}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('tools.settings.presets.fahimkom.description')}</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Fine Tuning Section */}
                <div>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <SlidersHorizontal size={20} className="text-primary"/> {t('tools.settings.manual.title')}
                    </h3>
                    <div className="space-y-8">
                        <SettingSlider
                            label={t('tools.settings.manual.humor.label')}
                            value={persona.humor}
                            onChange={setHumor}
                            minLabel={t('tools.settings.manual.humor.min')}
                            maxLabel={t('tools.settings.manual.humor.max')}
                        />
                        
                        <SettingSlider
                            label={t('tools.settings.manual.verbosity.label')}
                            value={persona.verbosity}
                            onChange={setVerbosity}
                            minLabel={t('tools.settings.manual.verbosity.min')}
                            maxLabel={t('tools.settings.manual.verbosity.max')}
                        />

                        <div className="space-y-2">
                            <label htmlFor="interests" className="block font-semibold">{t('tools.settings.manual.interests.label')}</label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t('tools.settings.manual.interests.description')}
                            </p>
                            <input
                                id="interests"
                                type="text"
                                value={tempInterests}
                                onChange={(e) => setTempInterests(e.target.value)}
                                onBlur={handleInterestsBlur}
                                placeholder={t('tools.settings.manual.interests.placeholder')}
                                className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Admin Zone - Data & Keys */}
                 <div className="relative p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="absolute -top-3 right-6 px-3 bg-background dark:bg-dark-card text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-primary" /> {t('tools.settings.admin.title')}
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        {/* Connection & Memory */}
                        <div>
                            <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300 mb-2 text-center">{t('tools.settings.admin.connection.title')}</h4>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => setApiKeyManagerOpen(true)}
                                    className="w-full flex items-center justify-between p-3 h-12 text-start bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <KeyRound size={20} className="text-primary"/>
                                        <span className="font-semibold text-sm text-foreground dark:text-dark-foreground">{t('tools.settings.admin.connection.apiKeys')}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                                </button>
                                <button 
                                    onClick={() => navigateTo('memory-manager')}
                                    className="w-full flex items-center justify-between p-3 h-12 text-start bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <BrainCircuit size={20} className="text-pink-500"/>
                                        <span className="font-semibold text-sm text-foreground dark:text-dark-foreground">{t('tools.settings.admin.connection.memory')}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300 mb-2 text-center">{t('tools.settings.data.title')}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button 
                                    onClick={handleExportData}
                                    className="w-full flex items-center justify-center gap-2 p-3 h-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                                >
                                    <Download size={18} className="text-slate-500 group-hover:text-primary transition-colors"/>
                                    <span className="font-semibold text-sm text-foreground dark:text-dark-foreground">{t('tools.settings.data.export')}</span>
                                </button>
                                <button 
                                    onClick={() => fileImportRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 p-3 h-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                                >
                                    <Upload size={18} className="text-slate-500 group-hover:text-primary transition-colors"/>
                                    <span className="font-semibold text-sm text-foreground dark:text-dark-foreground">{t('tools.settings.data.import')}</span>
                                </button>
                                <input type="file" ref={fileImportRef} onChange={handleImportData} accept=".json" className="hidden" />
                            </div>
                             <p className="text-[10px] text-slate-400 mt-2 text-center">
                                {t('tools.settings.data.description')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                {/* Moral Support Section */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 rounded-xl border border-pink-500/20 text-center">
                    <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-2">{t('tools.settings.moralSupport.title')}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {t('tools.settings.moralSupport.description')}
                    </p>
                    <Button 
                        onClick={handleMoralSupport} 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:-translate-y-1"
                        icon={<Heart className="fill-white" />}
                    >
                        {t('tools.settings.moralSupport.button')}
                    </Button>
                </div>

            </div>
            <ApiKeyManager isOpen={isApiKeyManagerOpen} onClose={() => setApiKeyManagerOpen(false)} />
        </ToolContainer>
    );
};

export default Settings;
