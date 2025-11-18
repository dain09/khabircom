
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
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب كل اللي وراك بشكل عشوائي (مثال: لازم أذاكر عربي، وأشتري عيش، وأكلم محمود)، والخبير هينظمهملك في جدول مهام بالأولوية."
        >
            <div className="space-y-4">
                <AutoGrowTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب كل اللي في دماغك هنا..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary transition-colors shadow-inner resize-none min-h-[100px]"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!input.trim()}>
                    رتبلي يومي
                </Button>
            </div>

            {isLoading && <ResultCardSkeleton count={2} />}
            {error && <ErrorDisplay message={error} />}
            
            {result && (
                <div className="mt-6 space-y-6 animate-slideInUpFade">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 rounded-lg">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-200">💡 نصيحة الخبير: {result.summary_advice}</p>
                    </div>

                    <div className="grid gap-3">
                        {result.tasks.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-2 rounded-full ${getPriorityColor(item.priority)}`}>
                                        <CheckSquare size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.task}</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{item.category}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 sm:mt-0 text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg w-fit">
                                    <Clock size={14} />
                                    <span>{item.estimated_time}</span>
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
