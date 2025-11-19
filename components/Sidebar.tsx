
import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check, ChevronDown, Search, Clock, Code, Heart, Star, Zap } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { Tool } from '../types';
import { useTool } from '../hooks/useTool';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    onOpenApiKeyManager: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen, onOpenApiKeyManager }) => {
    const { conversations, createNewConversation, deleteConversation, renameConversation } = useChat();
    const { navigateTo, activeToolId, activeConversationId, recentTools, favoriteTools, addFavorite, removeFavorite } = useTool();
    const { t } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [logoClicks, setLogoClicks] = useState(0);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { addToast } = useToast();
    
    const hiddenTools = ['khabirkom-settings', 'memory-manager'];

    const filteredTools = useMemo(() => {
        return TOOLS.filter(tool => 
            tool.id !== 'chat' && 
            !hiddenTools.includes(tool.id) && 
            t(tool.title).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [debouncedSearchTerm, t]);
    
    const favoriteToolsDetails = useMemo(() => {
        return favoriteTools
            .map((id: string) => TOOLS.find(tool => tool.id === id))
            .filter((tool): tool is Tool => !!tool && filteredTools.includes(tool));
    }, [favoriteTools, filteredTools]);
    
    const toolsByCategory = useMemo(() => {
        const categories: Record<string, Tool[]> = {};
        filteredTools.forEach((tool: Tool) => {
            const categoryName = t(tool.category);
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            categories[categoryName].push(tool);
        });
        return categories;
    }, [filteredTools, t]);
    
    const recentToolsDetails = useMemo(() => {
        return recentTools.map((id: string) => TOOLS.find(tool => tool.id === id)).filter((tool): tool is Tool => !!tool && !hiddenTools.includes(tool.id));
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
        navigateTo(toolId);
        closeSidebarOnMobile();
    };
    
    const handleConversationClick = (id: string) => {
        navigateTo(`chat/${id}`);
        closeSidebarOnMobile();
    }
    
    const handleNewChat = () => {
        createNewConversation();
        closeSidebarOnMobile();
    }

    const handleLogoClick = () => {
        setLogoClicks(prev => prev + 1);
        if (logoClicks + 1 === 5) {
            addToast(t('sidebar.developerModeToast'), { 
                icon: <Zap className="text-yellow-500" />, 
                duration: 5000 
            });
            setLogoClicks(0);
        }
        navigateTo('chat/');
        closeSidebarOnMobile();
    };

    const ToolListItem: React.FC<{ tool: Tool }> = ({ tool }) => {
        const isFavorite = favoriteTools.includes(tool.id);

        const handleFavoriteToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isFavorite) {
                removeFavorite(tool.id);
            } else {
                addFavorite(tool.id);
            }
        };

        return (
            <div className="group relative">
                <button
                    onClick={() => handleToolClick(tool.id)}
                    className={`w-full flex items-center p-2 rounded-lg text-start transition-all duration-200 hover:bg-white dark:hover:bg-slate-700 ${
                        activeToolId === tool.id && !activeConversationId
                            ? 'bg-white dark:bg-slate-700 text-primary font-bold shadow-sm'
                            : 'text-slate-600 dark:text-slate-300'
                    }`}
                >
                    <tool.icon className={`w-4 h-4 me-3 ${tool.color}`} />
                    <span className='text-sm flex-1 truncate'>{t(tool.title)}</span>
                </button>
                 <button 
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorite ? t('sidebar.removeFromFavorites') : t('sidebar.addToFavorites')}
                    className="absolute end-1 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 opacity-100 hover:text-amber-500 transition-all"
                >
                    <Star size={16} className={`${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
            </div>
        );
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 right-0 h-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-s border-white/20 dark:border-slate-700/50 shadow-2xl w-80 transform transition-transform duration-300 cubic-bezier(0.2, 0, 0, 1) z-[60] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-sans antialiased`}>
                <div className="flex justify-between items-center p-5 pb-2 border-b border-transparent flex-shrink-0">
                    <button onClick={handleLogoClick} className="flex items-center gap-2 group focus:outline-none select-none" aria-label={t('sidebar.goHome')}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 active:scale-90">
                            <span className="text-white font-black text-lg">{t('sidebar.logoChar')}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-primary transition-colors">{t('appName')}</h1>
                    </button>
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="md:hidden p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-colors" 
                        aria-label={t('sidebar.closeSidebar')}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className='p-4 pb-0 flex-shrink-0'>
                     <button
                        onClick={handleNewChat}
                        className='group w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-start transition-all duration-300 bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                        aria-label={t('sidebar.startNewChat')}
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300"/>
                        <span>{t('sidebar.newChat')}</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    <div>
                        <h2 className='px-2 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest'>{t('sidebar.conversations')}</h2>
                        {conversations.length > 0 ? (
                            <ul className='space-y-1'>
                                {conversations.map((convo) => (
                                    <li key={convo.id} className="group">
                                        <div
                                            onClick={() => handleConversationClick(convo.id)}
                                            className={`relative w-full flex items-center justify-between p-3 rounded-xl text-start cursor-pointer transition-all duration-200 border border-transparent ${
                                                activeConversationId === convo.id
                                                    ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-sm border-slate-100 dark:border-slate-700'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {activeConversationId === convo.id && <div className="absolute end-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-s-full"></div>}
                                            <MessageSquare className={`w-4 h-4 me-3 flex-shrink-0 ${activeConversationId === convo.id ? 'text-primary' : 'text-slate-400'}`} />
                                            {editingId === convo.id ? (
                                                <input 
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    onBlur={() => handleSaveRename(convo.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(convo.id)}
                                                    className="flex-1 bg-transparent border-b-2 border-primary focus:outline-none text-sm py-0.5"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className="flex-1 truncate text-sm">{convo.title === t('sidebar.newChatTitle') ? t('sidebar.newChatTitle') : convo.title}</span>
                                            )}
                                            
                                            <div className={`flex items-center gap-1 transition-opacity duration-200 ${deleteConfirmationId === convo.id ? 'opacity-100' : 'opacity-100'}`}>
                                                {deleteConfirmationId === convo.id ? (
                                                    <div className='flex items-center gap-1 animate-slideInUpFade'>
                                                        <button onClick={(e) => { e.stopPropagation(); handleConfirmDelete(convo.id)}} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors" aria-label={t('sidebar.confirmDelete')}><Check size={14} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleCancelDelete()}} className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors" aria-label={t('sidebar.cancelDelete')}><X size={14} /></button>
                                                    </div>
                                                ) : editingId === convo.id ? (
                                                    <button onClick={(e) => { e.stopPropagation(); handleSaveRename(convo.id)}} className="p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full" aria-label={t('sidebar.save')}><Check size={14} /></button>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleRename(convo.id, convo.title)}} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors" aria-label={t('sidebar.edit')}><Edit3 size={14} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(convo.id)}} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors" aria-label={t('sidebar.delete')}><Trash2 size={14} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <div className="px-2 py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
                                <p className="text-xs text-slate-400">{t('sidebar.startNewChatPrompt')}</p>
                             </div>
                        )}
                    </div>

                    <div className='space-y-4'>
                         <div className="relative group">
                            <input
                                type="search"
                                placeholder={t('sidebar.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 ps-10 text-sm bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all"
                            />
                            <Search size={18} className="absolute top-1/2 end-3 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        
                        {favoriteToolsDetails.length > 0 && !searchTerm && (
                             <div>
                                <h3 className="px-2 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Star size={12} className="text-amber-500"/> {t('sidebar.favorites')}</h3>
                                <ul className='space-y-1'>
                                     {favoriteToolsDetails.map((tool: Tool) => (
                                        <li key={`fav-${tool.id}`}>
                                            <ToolListItem tool={tool} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recentToolsDetails.length > 0 && !searchTerm && (
                            <div>
                                <h3 className="px-2 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> {t('sidebar.recent')}</h3>
                                <ul className='space-y-1'>
                                     {recentToolsDetails.map((tool: Tool) => (
                                        <li key={`recent-${tool.id}`}>
                                             <button onClick={() => handleToolClick(tool.id)} className={`w-full flex items-center p-2.5 rounded-xl text-start transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${activeToolId === tool.id && !activeConversationId ? 'bg-white dark:bg-slate-800 text-primary font-bold shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                                                <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 me-3`}>
                                                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                                                </div>
                                                <span className='text-sm'>{t(tool.title)}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <h2 className='px-2 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest'>{t('sidebar.allTools')}</h2>
                            <ul className='space-y-2'>
                                {Object.keys(toolsByCategory).map((category) => (
                                    <li key={category} className="bg-slate-50/50 dark:bg-slate-800/20 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
                                        <details className="group" open={true}>
                                            <summary className="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none">
                                                <span className="font-bold text-xs text-slate-500 dark:text-slate-400">{category}</span>
                                                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                                            </summary>
                                            <ul className='p-2 pt-0 space-y-1'>
                                                {toolsByCategory[category].map((tool: Tool) => (
                                                    <li key={tool.id}>
                                                        <ToolListItem tool={tool} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center text-center space-y-1">
                         <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1" dangerouslySetInnerHTML={{ __html: t('sidebar.footer.developedBy')}} />
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono dir-ltr">
                            {t('sidebar.footer.copyright', { year: currentYear })}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
