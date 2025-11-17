
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { X, Key, Trash2, Eye, EyeOff } from 'lucide-react';
import { getApiKeys, addApiKey, removeApiKey } from '../services/apiKeyManager';

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState<string[]>([]);
    const [newKey, setNewKey] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen) {
            setKeys(getApiKeys());
            // Delay for transition
            const timer = setTimeout(() => setModalVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setModalVisible(false);
        }
    }, [isOpen]);

    const handleAddKey = () => {
        if (newKey.trim()) {
            addApiKey(newKey.trim());
            setKeys(getApiKeys()); // Refresh the list
            setNewKey('');
        }
    };

    const handleRemoveKey = (keyToRemove: string) => {
        removeApiKey(keyToRemove);
        setKeys(getApiKeys()); // Refresh the list
    };
    
    const toggleVisibility = (key: string) => {
        setVisibleKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`bg-background dark:bg-dark-card rounded-xl shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 ease-in-out border border-white/20 dark:border-slate-700/50 ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">إدارة مفاتيح API</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    التطبيق بيستخدم المفاتيح دي عشان يكلم Gemini. لو مفتاح وصل للحد الأقصى، التطبيق هينقل على اللي بعده تلقائيًا. المفاتيح بتتحفظ في متصفحك بس.
                </p>

                <div className="space-y-4 mb-6">
                    <h3 className="font-semibold">المفاتيح الحالية</h3>
                    {keys.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {keys.map((key) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                    <div className="flex items-center gap-2 font-mono text-sm">
                                        <Key size={16} className="text-slate-500" />
                                        <span>{visibleKeys[key] ? key : `••••••••${key.slice(-4)}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleVisibility(key)} className="p-1 text-slate-500 hover:text-primary">
                                            {visibleKeys[key] ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                        <button onClick={() => handleRemoveKey(key)} className="p-1 text-slate-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-slate-500 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                            مفيش أي مفاتيح محفوظة. ضيف مفتاح عشان تبدأ.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="new-key" className="font-semibold">إضافة مفتاح جديد</label>
                    <div className="flex gap-2">
                        <input
                            id="new-key"
                            type="password"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            placeholder="حط مفتاح Gemini API هنا"
                            className="flex-1 p-2 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                        />
                        <Button onClick={handleAddKey} disabled={!newKey.trim()}>
                            إضافة
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};
