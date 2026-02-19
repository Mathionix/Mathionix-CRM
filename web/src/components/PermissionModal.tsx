"use client";

import { useState } from 'react';
import { X, Key, Loader2, Info } from 'lucide-react';

interface PermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PermissionModal({ isOpen, onClose, onSuccess }: PermissionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        module: 'CRM'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:3001/users/permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Permission creation error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl shadow-purple-500/10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Define Permission</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Create a new access control token.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Permission Slug</label>
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                required
                                placeholder="e.g., leads:delete"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold placeholder:font-medium"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, ':') })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Module</label>
                        <select
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold appearance-none"
                            value={formData.module}
                            onChange={e => setFormData({ ...formData, module: e.target.value })}
                        >
                            <option value="CRM">CRM</option>
                            <option value="Settings">Settings</option>
                            <option value="KnowledgeBase">Knowledge Base</option>
                            <option value="Recruitment">Recruitment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                        <textarea
                            required
                            placeholder="What does this permission allow?"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium h-24 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex gap-3 text-purple-700">
                        <Info size={18} className="shrink-0" />
                        <p className="text-[10px] font-bold leading-relaxed">
                            Slug format should be <code className="bg-purple-100 px-1 rounded">module:action</code>.
                            New permissions must be recognized by the backend guards to take effect.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Permission'}
                    </button>
                </form>
            </div>
        </div>
    );
}
