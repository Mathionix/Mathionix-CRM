"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit2, X, Save, BookOpen, Clock } from 'lucide-react';
import ActivityTimeline from '../../components/ActivityTimeline';
import ActivityLogger from '../../components/ActivityLogger';

interface Note {
    _id: string;
    type: string;
    content: string;
    title?: string;
    createdAt: string;
    author?: { name: string };
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState<any>(null);

    const fetchNotes = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Note`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const notesArray = Array.isArray(data) ? data : data.data || [];
            setNotes(notesArray);
        } catch (err) {
            console.error('Failed to fetch notes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    const handleSaveActivity = async (payload: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (res.ok) fetchNotes();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Archive this note and remove from history?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotes(notes.filter(n => n._id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Knowledge Vault</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic opacity-70 tracking-tight">Chronological documentation of deal context and strategy.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        <BookOpen size={14} className="text-blue-500" />
                        Smart Archive
                    </div>
                </div>
            </div>

            <ActivityLogger onSave={handleSaveActivity} relatedType="General" fixedType="Note" />

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Historical Feed</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                </div>

                <ActivityTimeline
                    activities={notes}
                    loading={loading}
                    onDelete={handleDelete}
                    onEdit={(n) => setEditingNote(n)}
                />
            </div>

        </div>
    );
}
