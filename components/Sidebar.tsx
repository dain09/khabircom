
import React, { useState, useMemo, useRef } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown, KeyRound, Search, Clock, Download, Upload } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { Tool } from '../types';
import { useTool } from '../hooks/useTool';
import { useDebounce } from '../hooks/useDebounce';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    onOpenApiKeyManager: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen, onOpenApiKeyManager }) => {
    const { conversations, setActiveConversationId, activeConversationId, createNewConversation, deleteConversation, renameConversation } = useChat();
    const { activeToolId, setActiveToolId, recentTools } = useTool();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    const fileImportRef = useRef<HTMLInputElement>(null);

    const toolsByCategory = useMemo(() => {
        const categories: Record<string, Tool[]> = {};
        TOOLS.filter(tool => tool.id !== 'chat' && tool.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).forEach(tool => {
            if (!categories[tool.category]) {
                categories[tool.category] = [];
            }
            categories[tool.category].push(tool);
        });
        return categories;
    }, [debouncedSearchTerm]);
    
    const recentToolsDetails = useMemo(() => {
        return recentTools.map(id => TOOLS.find(tool => tool.id === id)).filter((tool): tool is Tool => !!tool);
    }, [recentTools]);


    const handleRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setNewName(currentTitle);
        setDeleteConfirmationId(null);
    };

    const handleSaveRename = (id: string) => {
        if (newName.trim()) {
            renameConversation(id, newName.trim());
        }
        setEditingId(null);
        setNewName('');
    };

    const handleDeleteRequest = (id: string) => {
        setDeleteConfirmationId(id);
        setEditingId(null);
    };

    const handleConfirmDelete = (id: string) => {
        deleteConversation(id);
        setDeleteConfirmationId(null);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationId(null);
    };
    
    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const handleToolClick = (toolId: string) => {
        setActiveToolId(toolId);
        setActiveConversationId(null); // Deselect any active chat
        closeSidebarOnMobile();
    };
    
    const handleConversationClick = (id: string) => {
        setActiveToolId('chat');
        setActiveConversationId(id);
        closeSidebarOnMobile();
    }
    
    const handleNewChat = () => {
        createNewConversation();
        setActiveToolId('chat');
        closeSidebarOnMobile();
    }
    
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
        // Reset input
        if (fileImportRef.current) fileImportRef.current.value = '';
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 right-0 h-full bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl w-80 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-sans antialiased`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                    <h1 className="text-xl font-bold text-primary tracking-wide">خبيركم</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="إغلاق الشريط الجانبي">
                        <X size={24} />
                    </button>
                </div>
                
                <div className='p-2 flex-shrink-0'>
                     <button
                        onClick={handleNewChat}
                        className='w-full flex items-center justify-center gap-2 p-3 my-1 rounded-lg text-start transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-bold hover:shadow-lg shadow-primary/20 active:scale-[0.98]'
                        aria-label="بدء محادثة جديدة"
                    >
                        <Plus size={18} />
                        <span>محادثة جديدة</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-4">
                    <div>
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>المحادثات السابقة</h2>
                        {conversations.length > 0 ? (
                            <ul className='max-h-40 overflow-y-auto pr-1'>
                                {conversations.map((convo) => (
                                    <li key={convo.id} className="group">
                                        <div
                                            onClick={() => handleConversationClick(convo.id)}
                                            className={`relative w-full flex items-center justify-between p-2.5 my-1 rounded-lg text-start cursor-pointer transition-all duration-200 hover:-translate-x-1 ${
                                                activeConversationId === convo.id
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            {activeConversationId === convo.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-e-full"></div>}
                                            <MessageSquare className={`w-4 h-4 me-3 ${activeConversationId === convo.id ? 'text-primary' : 'text-slate-400'}`} />
                                            {editingId === convo.id ? (
                                                <input 
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    onBlur={() => handleSaveRename(convo.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(convo.id)}
                                                    className="flex-1 bg-transparent border-b border-primary focus:outline-none text-sm"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className="flex-1 truncate text-sm">{convo.title}</span>
                                            )}
                                            
                                            <div className={`flex items-center transition-opacity duration-200 ${deleteConfirmationId === convo.id ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}>
                                                {deleteConfirmationId === convo.id ? (
                                                    <div className='flex items-center gap-1 animate-slideInUp'>
                                                        <button onClick={(e) => { e.stopPropagation(); handleConfirmDelete(convo.id)}} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full" aria-label="تأكيد الحذف"><Check size={14} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleCancelDelete()}} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full" aria-label="إلغاء الحذف"><X size={14} /></button>
                                                    </div>
                                                ) : editingId === convo.id ? (
                                                    <button onClick={(e) => { e.stopPropagation(); handleSaveRename(convo.id)}} className="p-1 hover:text-green-500" aria-label="حفظ الاسم الجديد"><Check size={14} /></button>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleRename(convo.id, convo.title)}} className="p-1 text-slate-400 hover:text-primary" aria-label="إعادة تسمية المحادثة"><Edit3 size={14} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(convo.id)}} className="p-1 text-slate-400 hover:text-red-500" aria-label="حذف المحادثة"><Trash2 size={14} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">لسه مفيش محادثات.</p>
                        )}
                    </div>

                    <div className='space-y-4'>
                         <div className="relative px-3">
                            <input
                                type="search"
                                placeholder="ابحث عن أداة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2.5 ps-9 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg outline-none transition-all"
                            />
                            <Search size={16} className="absolute top-1/2 right-6 -translate-y-1/2 text-slate-400" />
                        </div>
                        {recentToolsDetails.length > 0 && !searchTerm && (
                            <div>
                                <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2"><Clock size={14}/> آخر استخدام</h3>
                                <ul className='space-y-1'>
                                     {recentToolsDetails.map(tool => (
                                        <li key={`recent-${tool.id}`}>
                                            <button onClick={() => handleToolClick(tool.id)} className={`w-full flex items-center p-2.5 my-1 rounded-lg text-start transition-all duration-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${activeToolId === tool.id && !activeConversationId ? 'bg-primary/10 text-primary font-bold' : ''}`}>
                                                <tool.icon className={`w-4 h-4 me-3 ${tool.color}`} />
                                                <span className='text-sm'>{tool.title}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>الأدوات</h2>
                        <ul className='space-y-1'>
                            {Object.keys(toolsByCategory).map((category) => (
                                <li key={category}>
                                    <details className="group" open>
                                        <summary className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer list-none hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{category}</span>
                                            <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                                        </summary>
                                        <ul className='ps-3 space-y-1 mt-1 border-s border-slate-200 dark:border-slate-700'>
                                            {toolsByCategory[category].map((tool) => (
                                                <li key={tool.id}>
                                                    <button
                                                        onClick={() => handleToolClick(tool.id)}
                                                        className={`relative w-full flex items-center p-2.5 my-0.5 rounded-lg text-start transition-all duration-200 hover:translate-x-1 ${
                                                            activeToolId === tool.id && !activeConversationId
                                                                ? 'bg-primary/10 text-primary font-bold'
                                                                : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {activeToolId === tool.id && !activeConversationId && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-e-full"></div>}
                                                        <tool.icon className={`w-4 h-4 me-3 ${tool.color}`} />
                                                        <span className='text-sm'>{tool.title}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="flex-shrink-0 p-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                         <button
                            onClick={handleExportData}
                            className='flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors'
                            aria-label="تصدير البيانات"
                        >
                            <Download size={14} />
                            <span>تصدير</span>
                        </button>
                         <button
                            onClick={() => fileImportRef.current?.click()}
                            className='flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors'
                            aria-label="استيراد البيانات"
                        >
                            <Upload size={14} />
                            <span>استيراد</span>
                        </button>
                         <input type="file" ref={fileImportRef} onChange={handleImportData} accept=".json" className="hidden" />
                    </div>

                     <button
                        onClick={onOpenApiKeyManager}
                        className='w-full flex items-center gap-2 p-2.5 mb-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors'
                        aria-label="إدارة مفاتيح API"
                    >
                        <KeyRound size={16} />
                        <span>إدارة مفاتيح API</span>
                    </button>
                    <div className="text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            © {new Date().getFullYear()} تم التطوير بواسطة <br />
                            <a 
                                href="https://github.com/dain09" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-bold text-primary hover:underline transition-colors"
                            >
                                عبدالله إبراهيم
                            </a>
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};