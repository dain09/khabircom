import React, { useState, useEffect } from 'react';
import { KeyRound, Trash2, X, Plus } from 'lucide-react';
import { getApiKeys, addApiKey, deleteApiKey, getCurrentApiKey } from '../services/apiKeyManager';
import { Button } from './ui/Button';

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState<string[]>([]);
    const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
    const [newKey, setNewKey] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchKeys = () => {
                setKeys(getApiKeys());
                setCurrentKey(getCurrentApiKey());
            };
            fetchKeys();
        }
    }, [isOpen]);

    const handleAddKey = () => {
        if (!newKey.trim()) {
            setError('المفتاح لا يمكن أن يكون فارغًا.');
            return;
        }
        const success = addApiKey(newKey.trim());
        if (success) {
            setNewKey('');
            setError('');
            setKeys(getApiKeys());
            setCurrentKey(getCurrentApiKey());
        } else {
            setError('هذا المفتاح موجود بالفعل.');
        }
    };

    const handleDeleteKey = (keyToDelete: string) => {
        deleteApiKey(keyToDelete);
        setKeys(getApiKeys());
        setCurrentKey(getCurrentApiKey());
    };

    if (!isOpen) return null;

    const maskKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-background dark:bg-dark-card w-full max-w-lg rounded-xl shadow-2xl p-6 transform transition-all animate-slideInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><KeyRound /> إدارة مفاتيح API</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    الخبير بيستخدم مفاتيح Gemini API عشان يشتغل. لو المفاتيح الحالية وصلت للحد الأقصى، ممكن تضيف مفاتيح جديدة من 
                    <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mx-1">
                        Google AI Studio
                    </a>. 
                    المفاتيح بتتخزن في المتصفح بتاعك بس.
                </p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-500">المفاتيح الحالية</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-slate-100 dark:bg-dark-background rounded-lg">
                            {keys.length > 0 ? keys.map(key => (
                                <div key={key} className={`flex items-center justify-between p-2 rounded-md ${key === currentKey ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white dark:bg-slate-700/50'}`}>
                                    <span className="font-mono text-sm">{maskKey(key)}</span>
                                    {key === currentKey && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">الحالي</span>}
                                    <button onClick={() => handleDeleteKey(key)} className="p-1 text-slate-500 hover:text-red-500" aria-label="حذف المفتاح">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            )) : (
                                <p className="text-center text-sm text-slate-500 py-4">لا يوجد مفاتيح. ضيف واحد عشان تبدأ.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">إضافة مفتاح جديد</h3>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={newKey}
                                onChange={(e) => { setNewKey(e.target.value); setError(''); }}
                                placeholder="حط مفتاح Gemini API هنا..."
                                className="flex-1 p-2 bg-white/20 dark:bg-dark-card/30 border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <Button onClick={handleAddKey} icon={<Plus />}>إضافة</Button>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
