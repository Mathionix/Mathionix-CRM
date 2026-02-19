"use client";

import { useState, useEffect } from 'react';
import { GitBranch, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle, Loader2, Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Stage {
    name: string;
    probability: number;
    order: number;
    isDefault: boolean;
}

interface Pipeline {
    _id: string;
    name: string;
    stages: Stage[];
    isDefault: boolean;
}

export default function PipelinesManagementPage() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPipeline, setNewPipeline] = useState({
        name: '',
        stages: [
            { name: 'Qualification', probability: 10, order: 1, isDefault: true },
            { name: 'Proposal', probability: 50, order: 2, isDefault: false },
            { name: 'Closed Won', probability: 100, order: 3, isDefault: false },
        ]
    });

    const fetchPipelines = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/pipelines', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPipelines(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch pipelines:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPipelines();
    }, []);

    const handleAddStage = () => {
        const nextOrder = newPipeline.stages.length + 1;
        setNewPipeline({
            ...newPipeline,
            stages: [...newPipeline.stages, { name: '', probability: 0, order: nextOrder, isDefault: false }]
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/pipelines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newPipeline)
            });
            if (res.ok) {
                setIsAdding(false);
                fetchPipelines();
            }
        } catch (err) {
            console.error('Failed to save pipeline:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Pipelines</h1>
                        <p className="text-slate-500 mt-2 font-medium">Design custom workflows for different sales processes.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    Create Pipeline
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pipelines.map(pipeline => (
                    <div key={pipeline._id} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                    {pipeline.name}
                                    {pipeline.isDefault && <span className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Default</span>}
                                </h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">{pipeline.stages.length} Stages Defined</p>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {pipeline.stages.sort((a, b) => a.order - b.order).map((stage, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/stage hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">
                                        {stage.order}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{stage.name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stage.probability}% Probability</p>
                                    </div>
                                    {stage.isDefault && <CheckCircle2 size={16} className="text-emerald-500" />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {isAdding && (
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white animate-in zoom-in-95 duration-300 shadow-2xl lg:col-span-2">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-blue-400">New Workflow Design</h2>
                            <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><Plus className="rotate-45" /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="md:col-span-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Pipeline Identity</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Enterprise Sales"
                                        className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none ring-2 ring-transparent focus:ring-blue-500/50 transition-all"
                                        value={newPipeline.name}
                                        onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })}
                                    />
                                </div>
                                <div className="p-6 bg-slate-800/50 rounded-[32px] border border-slate-800">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">Pipelines help you track different types of deals with unique sales cycles.</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workflow Stages</label>
                                    <button onClick={handleAddStage} className="text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Plus size={14} /> Add Stage
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {newPipeline.stages.map((stage, i) => (
                                        <div key={i} className="flex gap-4 items-center animate-in slide-in-from-right-4 duration-300">
                                            <input
                                                type="text"
                                                placeholder="Stage Name"
                                                className="flex-1 bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold text-white"
                                                value={stage.name}
                                                onChange={(e) => {
                                                    const updated = [...newPipeline.stages];
                                                    updated[i].name = e.target.value;
                                                    setNewPipeline({ ...newPipeline, stages: updated });
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Win %"
                                                className="w-24 bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-bold text-white"
                                                value={stage.probability}
                                                onChange={(e) => {
                                                    const updated = [...newPipeline.stages];
                                                    updated[i].probability = parseInt(e.target.value);
                                                    setNewPipeline({ ...newPipeline, stages: updated });
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const updated = newPipeline.stages.filter((_, idx) => idx !== i);
                                                    setNewPipeline({ ...newPipeline, stages: updated });
                                                }}
                                                className="p-2 text-slate-600 hover:text-rose-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 flex gap-4">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-white text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Deploy Pipeline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
