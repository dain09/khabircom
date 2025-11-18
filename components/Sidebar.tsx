import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown, KeyRound, Search, Clock } from 'lucide-react';
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

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden transition-opacity ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 right-0 h-full bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl w-80 transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                    <h1 className="text-xl font-bold text-primary">خبيركم</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="إغلاق الشريط الجانبي">
                        <X size={24} />
                    </button>
                </div>
                
                <div className='p-2 flex-shrink-0'>
                     <button
                        onClick={handleNewChat}
                        className='w-full flex items-center justify-center gap-2 p-3 my-1 rounded-md text-start transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-bold hover:scale-105 active:scale-100'
                        aria-label="بدء محادثة جديدة"
                    >
                        <Plus size={18} />
                        <span>محادثة جديدة</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-4">
                    <div>
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>المحادثات السابقة</h2>
                        {conversations.length > 0 ? (
                            <ul className='max-h-40 overflow-y-auto'>
                                {conversations.map((convo) => (
                                    <li key={convo.id} className="group">
                                        <div
                                            onClick={() => handleConversationClick(convo.id)}
                                            className={`relative w-full flex items-center justify-between p-3 my-1 rounded-md text-start cursor-pointer transition-all duration-200 hover:-translate-x-1 ${
                                                activeConversationId === convo.id
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                            }`}
                                        >
                                            {activeConversationId === convo.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-e-full"></div>}
                                            <MessageSquare className="w-5 h-5 me-3 text-slate-500" />
                                            {editingId === convo.id ? (
                                                <input 
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    onBlur={() => handleSaveRename(convo.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(convo.id)}
                                                    className="flex-1 bg-transparent border-b border-primary focus:outline-none"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className="flex-1 truncate">{convo.title}</span>
                                            )}
                                            
                                            <div className={`flex items-center transition-opacity ${deleteConfirmationId === convo.id ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}>
                                                {deleteConfirmationId === convo.id ? (
                                                    <div className='flex items-center gap-1 animate-slideInUp'>
                                                        <span className="text-[10px] text-red-500 font-bold mx-1">متأكد؟</span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleConfirmDelete(convo.id)}} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full" aria-label="تأكيد الحذف"><Check size={16} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleCancelDelete()}} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full" aria-label="إلغاء الحذف"><X size={16} /></button>
                                                    </div>
                                                ) : editingId === convo.id ? (
                                                    <button onClick={(e) => { e.stopPropagation(); handleSaveRename(convo.id)}} className="p-1 hover:text-green-500" aria-label="حفظ الاسم الجديد"><Check size={16} /></button>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleRename(convo.id, convo.title)}} className="p-1 hover:text-primary" aria-label="إعادة تسمية المحادثة"><Edit3 size={16} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(convo.id)}} className="p-1 hover:text-red-500" aria-label="حذف المحادثة"><Trash2 size={16} /></button>
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
                                className="w-full p-2 ps-8 text-sm bg-slate-200/50 dark:bg-dark-card/50 border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-md outline-none transition-colors"
                            />
                            <Search size={16} className="absolute top-1/2 right-5 -translate-y-1/2 text-slate-400" />
                        </div>
                        {recentToolsDetails.length > 0 && !searchTerm && (
                            <div>
                                <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Clock size={14}/> آخر استخدام</h3>
                                <ul className='space-y-1'>
                                     {recentToolsDetails.map(tool => (
                                        <li key={`recent-${tool.id}`}>
                                            <button onClick={() => handleToolClick(tool.id)} className={`w-full flex items-center p-3 my-1 rounded-md text-start transition-all duration-200 hover:bg-slate-200/50 dark:hover:bg-dark-card/50 ${activeToolId === tool.id && !activeConversationId ? 'bg-primary/10 text-primary font-bold' : ''}`}>
                                                <tool.icon className={`w-5 h-5 me-3 ${tool.color}`} />
                                                <span className='text-sm'>{tool.title}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>الأدوات</h2>
                        <ul className='space-y-1'>
                            {Object.keys(toolsByCategory).map((category) => (
                                <li key={category}>
                                    <details className="group" open>
                                        <summary className="flex items-center justify-between p-3 rounded-md cursor-pointer list-none hover:bg-slate-200/50 dark:hover:bg-dark-card/50">
                                            <span className="font-semibold text-sm">{category}</span>
                                            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                                        </summary>
                                        <ul className='ps-2 space-y-1 mt-1 border-s-2 border-primary/20'>
                                            {toolsByCategory[category].map((tool) => (
                                                <li key={tool.id}>
                                                    <button
                                                        onClick={() => handleToolClick(tool.id)}
                                                        className={`relative w-full flex items-center p-3 my-1 rounded-md text-start transition-all duration-200 hover:translate-x-1 ${
                                                            activeToolId === tool.id && !activeConversationId
                                                                ? 'bg-primary/10 text-primary font-bold'
                                                                : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                                        }`}
                                                    >
                                                        {activeToolId === tool.id && !activeConversationId && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-e-full"></div>}
                                                        <tool.icon className={`w-5 h-5 me-3 ${tool.color}`} />
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

                <div className="flex-shrink-0 p-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50">
                     <button
                        onClick={onOpenApiKeyManager}
                        className='w-full flex items-center gap-2 p-2 mb-4 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-card/50 transition-colors'
                        aria-label="إدارة مفاتيح API"
                    >
                        <KeyRound size={16} />
                        <span>إدارة مفاتيح API</span>
                    </button>
                    <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
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