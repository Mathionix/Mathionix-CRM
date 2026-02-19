"use client";

import { useState, useEffect } from 'react';
import { Columns, ChevronLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const MODULES = [
    { id: 'leads', name: 'Leads', columns: ['Status', 'Source', 'Industry', 'Owner', 'Annual Revenue', 'Email', 'Phone'] },
    { id: 'deals', name: 'Deals', columns: ['Amount', 'Probability', 'Pipeline', 'Stage', 'Owner', 'Expected Closure'] },
    { id: 'organizations', name: 'Organizations', columns: ['Industry', 'Location', 'Team Size', 'Revenue', 'Owner'] },
    { id: 'contacts', name: 'Contacts', columns: ['Job Title', 'Organization', 'Email', 'Phone', 'Source'] }
];

export default function ColumnsSettingsPage() {
    const [preferences, setPreferences] = useState<{ [key: string]: string[] }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchAllPreferences();
    }, []);

    const fetchAllPreferences = async () => {
        const token = localStorage.getItem('token');
        const prefs: { [key: string]: string[] } = {};

        try {
            for (const mod of MODULES) {
                const res = await fetch(`http://localhost:3001/column-preferences/${mod.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const text = await res.text();
                if (res.ok && text) {
                    const data = JSON.parse(text);
                    prefs[mod.id] = data?.columns || mod.columns;
                } else {
                    prefs[mod.id] = mod.columns;
                }
            }
            setPreferences(prefs);
        } catch (error) {
            console.error('Fetch preferences error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleColumn = (moduleId: string, column: string) => {
        setPreferences(prev => {
            const current = prev[moduleId] || [];
            const next = current.includes(column)
                ? current.filter(c => c !== column)
                : [...current, column];
            return { ...prev, [moduleId]: next };
        });
    };

    const handleSave = async (moduleId: string) => {
        setSaving(moduleId);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/column-preferences/${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ columns: preferences[moduleId] })
            });
            if (res.ok) {
                setTimeout(() => setSaving(null), 1000);
            }
        } catch (error) {
            console.error('Save preference error:', error);
            setSaving(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">List Columns</h1>
                    <p className="text-sm text-gray-500 font-medium">Customize which properties are visible in your lists.</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white h-64 rounded-[32px] border border-slate-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MODULES.map(mod => (
                        <div key={mod.id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        <Columns size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">{mod.name}</h3>
                                </div>
                                <button
                                    onClick={() => handleSave(mod.id)}
                                    disabled={saving === mod.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${saving === mod.id ? 'bg-green-50 text-green-600' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95'}`}
                                >
                                    {saving === mod.id ? (
                                        <>
                                            <CheckCircle2 size={14} />
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-8 grid grid-cols-1 gap-3 flex-1 overflow-y-auto max-h-64 custom-scrollbar">
                                {mod.columns.map(col => {
                                    const isSelected = preferences[mod.id]?.includes(col);
                                    return (
                                        <div
                                            key={col}
                                            onClick={() => toggleColumn(mod.id, col)}
                                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-100 text-blue-900 font-bold' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-100 hover:bg-slate-50/50'}`}
                                        >
                                            <span className="text-xs">{col}</span>
                                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>
                                                {isSelected && <div className="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 -mt-0.5" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
