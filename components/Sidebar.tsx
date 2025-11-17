
import React, { useState } from 'react';
import { TOOLS } from '../constants';
import { X, MessageSquare, Plus, Trash2, Edit3, Check } from 'lucide-react';
import { useChat } from '../hooks/useChat';

interface SidebarProps {
    activeToolId: string;
    setActiveToolId: (id: string) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId, isSidebarOpen, setSidebarOpen }) => {
    const { conversations, setActiveConversationId, activeConversationId, createNewConversation, deleteConversation, renameConversation } = useChat();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const handleRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setNewName(currentTitle);
    };

    const handleSaveRename = (id: string) => {
        if (newName.trim()) {
            renameConversation(id, newName.trim());
        }
        setEditingId(null);
        setNewName('');
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
                            <ul>
                                {conversations.map((convo) => (
                                    <li key={convo.id} className="group">
                                        <div
                                            onClick={() => handleConversationClick(convo.id)}
                                            className={`w-full flex items-center justify-between p-3 my-1 rounded-md text-start cursor-pointer transition-all duration-200 hover:-translate-x-1 ${
                                                activeConversationId === convo.id
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                            }`}
                                        >
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
                                                />
                                            ) : (
                                                <span className="flex-1 truncate">{convo.title}</span>
                                            )}
                                            
                                            <div className='flex items-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                {editingId === convo.id ? (
                                                    <button onClick={() => handleSaveRename(convo.id)} className="p-1 hover:text-green-500" aria-label="حفظ الاسم الجديد"><Check size={16} /></button>
                                                ) : (
                                                    <button onClick={(e) => { e.stopPropagation(); handleRename(convo.id, convo.title)}} className="p-1 hover:text-primary" aria-label="إعادة تسمية المحادثة"><Edit3 size={16} /></button>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id)}} className="p-1 hover:text-red-500" aria-label="حذف المحادثة"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">لسه مفيش محادثات.</p>
                        )}
                    </div>

                    <div>
                        <h2 className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>الأدوات</h2>
                        <ul>
                            {TOOLS.filter(tool => tool.id !== 'chat').map((tool) => ( // More robust filtering
                                <li key={tool.id}>
                                    <button
                                        onClick={() => handleToolClick(tool.id)}
                                        className={`w-full flex items-center p-3 my-1 rounded-md text-start transition-all duration-200 hover:-translate-x-1 ${
                                            activeToolId === tool.id && !activeConversationId
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'hover:bg-slate-200/50 dark:hover:bg-dark-card/50'
                                        }`}
                                    >
                                        <tool.icon className={`w-5 h-5 me-3 ${tool.color}`} />
                                        <span>{tool.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="flex-shrink-0 p-4 mt-auto text-center border-t border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        تم التطوير بواسطة <br />
                        <span className="font-bold text-primary">عبدالله إبراهيم @D_ai_n</span>
                    </p>
                </div>
            </aside>
        </>
    );
};
