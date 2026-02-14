"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Search } from 'lucide-react';

interface Note {
    _id: string;
    content: string;
    title?: string;
    createdAt: string;
    author?: {
        name: string;
    };
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/crm/activities?type=Note')
            .then(res => res.json())
            .then(data => {
                setNotes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch notes', err);
                setLoading(false);
            });
    }, []);

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
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                        <FileText size={64} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
                        <p className="text-slate-500">Create your first note to get started.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={20} />
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{note.title || 'Untitled Note'}</h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                {note.content}
                            </p>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                <span>{note.author?.name || 'Administrator'}</span>
                                <span className="group-hover:text-blue-600 transition-colors">Read More &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
