"use client";

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Trash2, Edit2, X, Save, LayoutGrid, Activity as ActivityIcon } from 'lucide-react';
import ActivityTimeline from '../../components/ActivityTimeline';
import ActivityLogger from '../../components/ActivityLogger';

interface Task {
    _id: string;
    type: string;
    title: string;
    content: string;
    createdAt: string;
    metadata?: { status?: string; priority?: string; dueDate?: string };
    author?: { name: string };
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<any>(null);

    const fetchTasks = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Task`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const arr = Array.isArray(data) ? data : data.data || [];
            setTasks(arr);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleSaveActivity = async (payload: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (res.ok) fetchTasks();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently remove this task from history?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setTasks(tasks.filter(t => t._id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Task Studio</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic opacity-70 tracking-tight">HubSpot-style pipeline activities and follow-up management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        <ActivityIcon size={14} className="text-blue-500" />
                        Live Feed
                    </div>
                </div>
            </div>

            <ActivityLogger onSave={handleSaveActivity} relatedType="General" fixedType="Task" />

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Task Timeline</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                </div>

                <ActivityTimeline
                    activities={tasks}
                    loading={loading}
                    onDelete={handleDelete}
                    onEdit={(t) => setEditingTask(t)}
                />
            </div>

        </div>
    );
}
