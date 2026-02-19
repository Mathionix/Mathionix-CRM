"use client";

import { useState, useEffect } from 'react';
import { Mail, Plus, Search, Edit2, Trash2, Copy, ChevronLeft, X, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Template {
    _id: string;
    name: string;
    subject: string;
    body?: string;
    type: string;
    isActive: boolean;
    updatedAt: string;
}

const EMPTY_FORM = { name: '', subject: '', body: '', type: 'Transactional' };

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const fetchTemplates = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/email-templates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { window.location.href = '/auth/login'; return; }
            if (res.ok) {
                const text = await res.text();
                const data = text ? JSON.parse(text) : [];
                setTemplates(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to fetch templates:', err);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTemplates(); }, []);

    const openCreate = () => {
        setEditingTemplate(null);
        setFormData(EMPTY_FORM);
        setIsModalOpen(true);
    };

    const openEdit = (t: Template) => {
        setEditingTemplate(t);
        setFormData({ name: t.name, subject: t.subject, body: t.body || '', type: t.type });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const method = editingTemplate ? 'PUT' : 'POST';
            const url = editingTemplate
                ? `http://localhost:3001/email-templates/${editingTemplate._id}`
                : 'http://localhost:3001/email-templates';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchTemplates();
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to save template');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this template?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/email-templates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchTemplates();
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Email Templates</h1>
                        <p className="text-slate-500 mt-2 font-medium">Create and manage reusable email templates for your CRM communications.</p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Template
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="pl-12 pr-4 py-3.5 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[32px] animate-pulse" />)
                    ) : filteredTemplates.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-40">
                            <Mail size={48} className="mx-auto mb-4" />
                            <p className="font-bold text-xl uppercase tracking-widest text-slate-900">No templates found</p>
                            <p className="text-slate-500 mt-2">Click "New Template" to create one</p>
                        </div>
                    ) : (
                        filteredTemplates.map(template => (
                            <div key={template._id} className="group bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <Mail size={20} />
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${template.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                            {template.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight line-clamp-1">{template.name}</h3>
                                    <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-1">{template.subject}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        Updated {new Date(template.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(template)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all" title="Edit"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(template._id)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-900">{editingTemplate ? 'Edit Template' : 'New Email Template'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Name</label>
                                <input
                                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Welcome Email"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Line</label>
                                <input
                                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Welcome to our platform!"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-slate-900"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Transactional">Transactional</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Notification">Notification</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Body</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-medium h-40 text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Email content or HTML..."
                                    value={formData.body}
                                    onChange={e => setFormData({ ...formData, body: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !formData.name || !formData.subject}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={14} />}
                                    {editingTemplate ? 'Save Changes' : 'Save Template'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
