"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, Plus, Calendar, Clock, Trash2, Edit2, X, Save } from 'lucide-react';

interface Task {
    _id: string;
    title: string;
    content?: string;
    createdAt: string;
    metadata?: { status?: string; priority?: string; dueDate?: string };
    author?: { name: string };
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editStatus, setEditStatus] = useState('');

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Task`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : [];
            const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
            setTasks(arr);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this task?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setTasks(tasks.filter(t => t._id !== id));
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setEditTitle(task.title || '');
        setEditContent(task.content || '');
        setEditStatus(task.metadata?.status || 'Pending');
    };

    const handleSaveEdit = async () => {
        if (!editingTask) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${editingTask._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: editTitle, content: editContent, metadata: { status: editStatus } })
        });
        if (res.ok) { setEditingTask(null); fetchTasks(); }
    };

    const handleToggleComplete = async (task: Task) => {
        const token = localStorage.getItem('token');
        const newStatus = task.metadata?.status === 'Completed' ? 'Pending' : 'Completed';
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${task._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ metadata: { ...task.metadata, status: newStatus } })
        });
        fetchTasks();
    };

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
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300"><CheckCircle size={64} /></div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
                        <p className="text-slate-500">Create your first task to stay organized.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow flex items-start gap-4 group">
                            <div className="mt-1 cursor-pointer" onClick={() => handleToggleComplete(task)}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.metadata?.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400'}`}>
                                    {task.metadata?.status === 'Completed' && <CheckCircle size={12} className="text-white" />}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold text-gray-900 ${task.metadata?.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getPriorityColor(task.metadata?.priority)}`}>
                                            {task.metadata?.priority || 'Normal'}
                                        </span>
                                        <button onClick={() => handleEdit(task)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(task._id)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                    </div>
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

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900">Edit Task</h2>
                            <button onClick={() => setEditingTask(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900"
                                placeholder="Task title"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-medium h-32 text-slate-900 resize-none"
                                placeholder="Task description..."
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                            />
                            <select
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900"
                                value={editStatus}
                                onChange={e => setEditStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <div className="flex gap-4">
                                <button onClick={() => setEditingTask(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600">Cancel</button>
                                <button onClick={handleSaveEdit} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <Save size={14} /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
