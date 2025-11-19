
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { organizeTasks } from '../../services/api/text.service';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';
import { AutoGrowTextarea } from '../../components/ui/AutoGrowTextarea';
import { ResultCardSkeleton } from '../../components/ui/ResultCardSkeleton';
import { CheckSquare, Clock, ListTodo } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface Task {
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    estimated_time: string;
    category: string;
}

interface TaskResult {
    tasks: Task[];
    summary_advice: string;
}

const TaskManager: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'task-manager')!;
    const [input, setInput] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<TaskResult, string>(organizeTasks);

    const handleSubmit = () => {
        if (!input.trim()) return;
        execute(input);
    };

    const getPriorityColor = (p: string) => {
        switch(p) {
            case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
        }
    };

    return (
        <ToolContainer 
            title={t(toolInfo.title)} 
            description={t(toolInfo.description)} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText={t('tools.taskManager.intro')}
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('tools.taskManager.placeholder')}
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary transition-colors shadow-inner resize-none min-h-[100px]"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!input.trim()}>
                    {t('tools.taskManager.submit')}
                </Button>
            </div>

            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            
            {result && (
                <div className="mt-6 space-y-6 animate-slideInUpFade">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 rounded-lg">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-200">💡 {t('tools.taskManager.adviceTitle')}: {result.summary_advice}</p>
                    </div>

                    <div className="grid gap-3">
                        {result.tasks.map((task, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg animate-slideInUpFade" style={{ animationDelay: `${index * 50}ms` }}>
                                <CheckSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold">{task.task}</p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {task.estimated_time}</span>
                                        <span className="flex items-center gap-1"><ListTodo size={12} /> {task.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default TaskManager;
