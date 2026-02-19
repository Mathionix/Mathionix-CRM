"use client";

import { useState } from 'react';
import { X, Loader2, Save, Info } from 'lucide-react';

interface CustomFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    field?: any;
}

export default function CustomFieldModal({ isOpen, onClose, onSuccess, field }: CustomFieldModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: field?.name || '',
        key: field?.key || '',
        type: field?.type || 'text',
        module: field?.module || 'leads',
        required: field?.required || false,
        description: field?.description || '',
        options: field?.options?.join(', ') || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const payload = {
            ...formData,
            options: formData.options.split(',').map((o: string) => o.trim()).filter(Boolean),
            key: formData.key || formData.name.toLowerCase().replace(/\s+/g, '_'),
        };

        try {
            const url = field
                ? `http://localhost:3001/custom-fields/${field._id}`
                : 'http://localhost:3001/custom-fields';

            const res = await fetch(url, {
                method: field ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Failed to save custom field:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {field ? 'Edit Custom Property' : 'Create Custom Property'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Define how data is collected for your CRM objects.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Object Type</label>
                            <select
                                value={formData.module}
                                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            >
                                <option value="leads">Leads</option>
                                <option value="deals">Deals</option>
                                <option value="contacts">Contacts</option>
                                <option value="organizations">Organizations</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Field Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            >
                                <option value="text">Single Line Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date Picker</option>
                                <option value="select">Dropdown Select</option>
                                <option value="checkbox">Checkbox</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Field Label</label>
                        <input
                            type="text"
                            placeholder="e.g. Budget Amount"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            Internal Key
                            <div className="group relative">
                                <Info size={12} className="text-slate-300 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-32 pointer-events-none text-center">
                                    Used for API and Exports. Auto-generated if empty.
                                </div>
                            </div>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. budget_amount"
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-mono"
                        />
                    </div>

                    {formData.type === 'select' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Options (Comma separated)</label>
                            <input
                                type="text"
                                placeholder="Low, Medium, High"
                                value={formData.options}
                                onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                required
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="required"
                            checked={formData.required}
                            onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                            className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="required" className="text-sm font-bold text-slate-700 cursor-pointer">This is a required property</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Property</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
