import React, { useState, useEffect } from 'react';
import { KeyRound, Trash2, X, Plus, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { getApiKeys, addApiKey, deleteApiKey, getCurrentApiKey } from '../services/apiKeyManager';
import { testApiKey } from '../services/geminiService';
import { Button } from './ui/Button';

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'failure';

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState<string[]>([]);
    const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
    const [newKey, setNewKey] = useState('');
    const [error, setError] = useState('');
    const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});

    useEffect(() => {
        if (isOpen) {
            const fetchKeys = () => {
                const allKeys = getApiKeys();
                setKeys(allKeys);
                setCurrentKey(getCurrentApiKey());
                // Initialize test status for all keys
                const initialStatus: Record<string, TestStatus> = {};
                allKeys.forEach(key => { initialStatus[key] = 'idle' });
                setTestStatus(initialStatus);
            };
            fetchKeys();
        }
    }, [isOpen]);

    const handleAddKey = async () => {
        if (!newKey.trim()) {
            setError('المفتاح لا يمكن أن يكون فارغًا.');
            return;
        }
        // Test key before adding
        setTestStatus(prev => ({ ...prev, [newKey]: 'testing' }));
        const isValid = await testApiKey(newKey.trim());
        if (!isValid) {
            setError('هذا المفتاح غير صالح أو لا يعمل.');
            setTestStatus(prev => ({ ...prev, [newKey]: 'failure' }));
            return;
        }

        const success = addApiKey(newKey.trim());
        if (success) {
            setNewKey('');
            setError('');
            setKeys(getApiKeys());
            setCurrentKey(getCurrentApiKey());
            setTestStatus(prev => ({ ...prev, [newKey]: 'success' }));
        } else {
            setError('هذا المفتاح موجود بالفعل.');
            setTestStatus(prev => ({ ...prev, [newKey]: 'failure' }));
        }
    };

    const handleDeleteKey = (keyToDelete: string) => {
        deleteApiKey(keyToDelete);
        setKeys(getApiKeys());
        setCurrentKey(getCurrentApiKey());
    };
    
    const handleTestKey = async (keyToTest: string) => {
        setTestStatus(prev => ({ ...prev, [keyToTest]: 'testing' }));
        const isValid = await testApiKey(keyToTest);
        setTestStatus(prev => ({ ...prev, [keyToTest]: isValid ? 'success' : 'failure' }));
        setTimeout(() => {
            setTestStatus(prev => ({...prev, [keyToTest]: 'idle'}));
        }, 3000);
    };

    if (!isOpen) return null;

    const maskKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

    const renderTestIcon = (status: TestStatus) => {
        switch (status) {
            case 'testing':
                return <Loader2 size={16} className="animate-spin text-slate-400" />;
            case 'success':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'failure':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return null;
        }
    };

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
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 flex items-center justify-center">{renderTestIcon(testStatus[key] || 'idle')}</div>
                                        <span className="font-mono text-sm">{maskKey(key)}</span>
                                        {key === currentKey && <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">الحالي</span>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                         <button onClick={() => handleTestKey(key)} className="p-1 text-slate-500 hover:text-primary disabled:opacity-50" aria-label="اختبار المفتاح" disabled={testStatus[key] === 'testing'}>
                                            <span className="text-xs font-bold">اختبار</span>
                                        </button>
                                        <button onClick={() => handleDeleteKey(key)} className="p-1 text-slate-500 hover:text-red-500" aria-label="حذف المفتاح">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
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
                            <Button onClick={handleAddKey} isLoading={testStatus[newKey] === 'testing'} icon={<Plus />}>إضافة</Button>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};