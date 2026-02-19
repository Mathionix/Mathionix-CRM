"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit2, X, Save } from 'lucide-react';

interface Note {
    _id: string;
    content: string;
    title?: string;
    createdAt: string;
    author?: { name: string };
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editTitle, setEditTitle] = useState('');

    const fetchNotes = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Note`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : [];
            const notesArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
            setNotes(notesArray);
        } catch (err) {
            console.error('Failed to fetch notes', err);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this note?')) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) { console.error(err); }
    };

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        setEditTitle(note.title || '');
        setEditContent(note.content || '');
    };

    const handleSaveEdit = async () => {
        if (!editingNote) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${editingNote._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: editTitle, content: editContent })
            });
            if (res.ok) {
                setEditingNote(null);
                fetchNotes();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notes & Documentation</h1>
                    <p className="text-sm text-gray-500">Manage all your deal and contact notes here.</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Note' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Create Note
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : notes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300"><FileText size={64} /></div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
                        <p className="text-slate-500">Create your first note to get started.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(note)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(note._id)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{note.title || 'Untitled Note'}</h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4">{note.content}</p>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                <span>{note.author?.name || 'Administrator'}</span>
                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900">Edit Note</h2>
                            <button onClick={() => setEditingNote(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900"
                                placeholder="Note title"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-medium h-40 text-slate-900 resize-none"
                                placeholder="Note content..."
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setEditingNote(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600">Cancel</button>
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
