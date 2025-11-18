
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useMemory } from '../../hooks/useMemory';
import { Trash2, Plus, AlertTriangle } from 'lucide-react';

const MemoryManager: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'memory-manager')!;
    const { memory, updateMemory, deleteMemoryItem, clearMemory } = useMemory();
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newKey.trim() && newValue.trim()) {
            updateMemory(newKey.trim(), newValue.trim());
            setNewKey('');
            setNewValue('');
        }
    };

    const memoryItems = Object.entries(memory);

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="هنا تقدر تضيف أو تمسح أي معلومة عايز الخبير يفتكرها عنك. المعلومات دي هتساعده يديلك ردود شخصية أكتر في الدردشة."
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">إضافة معلومة جديدة</h3>
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            placeholder="المعلومة (مثال: الاسم)"
                            className="flex-1 p-2 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="قيمتها (مثال: عبدالله)"
                            className="flex-1 p-2 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <Button type="submit" disabled={!newKey.trim() || !newValue.trim()} icon={<Plus />}>
                            إضافة
                        </Button>
                    </form>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">المعلومات المحفوظة</h3>
                    <div className="space-y-2 p-2 bg-slate-100/60 dark:bg-dark-background/60 rounded-lg max-h-60 overflow-y-auto">
                        {memoryItems.length > 0 ? (
                            memoryItems.map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-3 bg-background dark:bg-dark-card/80 rounded-md animate-slideInUp">
                                    <div>
                                        <p className="font-bold text-primary">{key}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{value}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMemoryItem(key)}
                                        className="p-2 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                                        aria-label={`حذف ${key}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 py-4">الذاكرة فاضية. ضيف معلومة عشان الخبير يفتكرها.</p>
                        )}
                    </div>
                </div>
                
                {memoryItems.length > 0 && (
                    <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                        {showClearConfirm ? (
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-center space-y-4">
                                <AlertTriangle className="mx-auto w-8 h-8"/>
                                <p className="font-bold">متأكد إنك عايز تمسح كل الذاكرة؟</p>
                                <div className="flex justify-center gap-4">
                                    <Button onClick={() => setShowClearConfirm(false)} variant="secondary">لأ، الغي</Button>
                                    <Button onClick={() => { clearMemory(); setShowClearConfirm(false); }} className="bg-red-500 hover:bg-red-600 text-white">
                                        أيوه، امسح كله
                                    </Button>
                                </div>
                            </div>
                        ) : (
                             <Button onClick={() => setShowClearConfirm(true)} variant="secondary" className="w-full bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 focus:ring-red-500">
                                مسح كل الذاكرة
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};

export default MemoryManager;
