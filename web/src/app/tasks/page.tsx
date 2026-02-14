"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, Plus, Calendar, Clock } from 'lucide-react';

interface Task {
    _id: string;
    title: string;
    content?: string;
    createdAt: string;
    metadata?: {
        status?: string;
        priority?: string;
        dueDate?: string;
    };
    author?: {
        name: string;
    };
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/crm/activities?type=Task')
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch tasks', err);
                setLoading(false);
            });
    }, []);

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-rose-600 bg-rose-50';
            case 'medium': return 'text-amber-600 bg-amber-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tasks & Follow-ups</h1>
                    <p className="text-sm text-gray-500">Keep track of your sales activities and deadlines.</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Task' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    New Task
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                        <CheckCircle size={64} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
                        <p className="text-slate-500">Create your first task to stay organized.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow flex items-start gap-4">
                            <div className="mt-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${task.metadata?.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                    {task.metadata?.status === 'Completed' && <CheckCircle size={12} className="text-white" />}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold text-gray-900 ${task.metadata?.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getPriorityColor(task.metadata?.priority)}`}>
                                        {task.metadata?.priority || 'Normal'}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mt-1">{task.content}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                                    {task.metadata?.dueDate && (
                                        <div className="flex items-center gap-1.5 text-rose-500">
                                            <Calendar size={14} />
                                            <span>Due {new Date(task.metadata.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div>{task.author?.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
