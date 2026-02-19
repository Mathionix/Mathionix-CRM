"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, List, Settings, Info, Box, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import CustomFieldModal from '@/components/CustomFieldModal';

interface CustomField {
    _id: string;
    name: string;
    key: string;
    type: string;
    module: string;
    required: boolean;
    description: string;
    isActive: boolean;
}

const MODULES = ['leads', 'deals', 'contacts', 'organizations'];

export default function CustomFieldsPage() {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('leads');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<CustomField | undefined>(undefined);

    const fetchFields = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/custom-fields?module=${activeModule}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFields(data);
            }
        } catch (err) {
            console.error('Failed to fetch custom fields:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, [activeModule]);

    const handleEdit = (field: CustomField) => {
        setSelectedField(field);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/custom-fields/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchFields();
        } catch (err) {
            console.error('Failed to delete field:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Custom Properties</h1>
                        <p className="text-slate-500 mt-2 font-medium">Create dynamic fields to capture specific data for your {activeModule}.</p>
                    </div>
                </div>
                <button
                    onClick={() => { setSelectedField(undefined); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Property
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-2 bg-slate-50/50 flex items-center gap-2 border-b border-slate-50 overflow-x-auto">
                    {MODULES.map((m) => (
                        <button
                            key={m}
                            onClick={() => setActiveModule(m)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeModule === m
                                ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading properties...</p>
                        </div>
                    ) : fields.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Box size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">No properties yet</h3>
                            <p className="text-slate-500 max-w-xs mt-2">Create custom fields to start collecting more data for your {activeModule}.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fields.map((field) => (
                                <div key={field._id} className="group bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 p-6 rounded-[24px] transition-all relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 text-blue-500">
                                            <Settings size={20} />
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(field)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(field._id)} className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-900 mb-1">{field.name}</h3>
                                    <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter mb-4">{field.key}</p>

                                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100/50">
                                        <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">
                                            {field.type}
                                        </span>
                                        {field.required && (
                                            <span className="px-3 py-1 bg-rose-50 border border-rose-100 rounded-lg text-[10px] font-black text-rose-600 uppercase">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-600 rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-2xl font-black mb-3">Property Insights</h2>
                    <p className="text-blue-100 font-medium leading-relaxed">
                        Custom properties allow you to tailor Mathionix CRM to your unique business processes. Use them for lead scoring, deal values, or specific contact attributes.
                    </p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                        <div className="text-3xl font-black">{fields.length}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-200 leading-tight">Active<br />Properties</div>
                    </div>
                </div>
            </div>

            <CustomFieldModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchFields}
                field={selectedField}
            />
        </div>
    );
}
