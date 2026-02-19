"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, DollarSign, Calendar, Download, Loader2, Upload, GitBranch } from 'lucide-react';
import ImportModal from '@/components/ImportModal';

interface Deal {
    _id: string;
    organization: string;
    dealValue: number;
    status: string; // This is the stage name
    probability: number;
    expectedClosureDate: string;
    pipeline: string; // Pipeline ID
}

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

export default function DealsPage() {
    const router = useRouter();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [pipelinesRes, dealsRes] = await Promise.all([
                fetch('http://localhost:3001/crm/pipelines', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/crm/deals', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (pipelinesRes.ok && dealsRes.ok) {
                const pipelinesData = await pipelinesRes.json();
                const dealsData = await dealsRes.json();

                setPipelines(pipelinesData);
                setDeals(dealsData);

                // Set default pipeline
                if (pipelinesData.length > 0) {
                    const defaultPipeline = pipelinesData.find((p: Pipeline) => p.isDefault) || pipelinesData[0];
                    setSelectedPipelineId(defaultPipeline._id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/export/deals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const csvContent = await res.text();
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `deals_export_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        e.dataTransfer.setData('dealId', dealId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, stageName: string) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData('dealId');
        if (!dealId) return;

        // Optimistic update
        const updatedDeals = deals.map(d =>
            d._id === dealId ? { ...d, status: stageName } : d
        );
        setDeals(updatedDeals);

        try {
            const res = await fetch(`http://localhost:3001/crm/deals/${dealId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ stage: stageName })
            });
            if (!res.ok) throw new Error('Failed to update deal status');
        } catch (err) {
            console.error(err);
            alert('Failed to update deal status');
            fetchData(); // Revert on failure
        }
    };

    const selectedPipeline = pipelines.find(p => p._id === selectedPipelineId);
    const pipelineStages = selectedPipeline ? selectedPipeline.stages.sort((a, b) => a.order - b.order) : [];

    // Filter deals by selected pipeline and ensure they belong to it
    // If a deal doesn't have a pipeline ID (legacy data), we might show it in default pipeline or handle it.
    // For now, let's assume we filter strictly.
    const pipelineDeals = deals.filter(d =>
        d.pipeline === selectedPipelineId ||
        (!d.pipeline && selectedPipeline?.isDefault)
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
                    <p className="text-sm text-gray-500">Manage your sales pipeline</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Pipeline Selector */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GitBranch size={16} className="text-slate-500" />
                        </div>
                        <select
                            value={selectedPipelineId}
                            onChange={(e) => setSelectedPipelineId(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 pl-10 pr-8 py-2.5 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                        >
                            {pipelines.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Export
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Deal', pipelineId: selectedPipelineId } }))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
                    >
                        <Plus size={18} />
                        New Deal
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto flex gap-6 pb-4">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 size={40} className="animate-spin text-blue-500" />
                    </div>
                ) : pipelineStages.length > 0 ? (
                    pipelineStages.map(stage => {
                        const stageDeals = pipelineDeals.filter(d => (d.status || (d as any).stage) === stage.name);
                        const totalValue = stageDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

                        return (
                            <div
                                key={stage.name}
                                className="w-80 shrink-0 flex flex-col h-full bg-gray-100/50 rounded-lg border p-3 transition-colors hover:bg-gray-100/80"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.name)}
                            >
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                                            {stageDeals.length}
                                        </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="text-xs font-bold text-gray-500 mb-4 px-1 uppercase tracking-wider">
                                    Total: ${totalValue.toLocaleString()}
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                    {stageDeals.map(deal => (
                                        <div
                                            key={deal._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal._id)}
                                            className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                            onClick={() => router.push(`/deals/${deal._id}`)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 truncate mr-2">{(deal as any).title || deal.organization}</h4>
                                                <MoreHorizontal size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 truncate">
                                                {typeof deal.organization === 'string' ? deal.organization : (deal.organization as any)?.name}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-gray-600 mb-3 font-semibold">
                                                <DollarSign size={14} className="text-gray-500" />
                                                {deal.dealValue.toLocaleString()}
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    <Calendar size={12} />
                                                    {new Date(deal.expectedClosureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${deal.probability}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full flex flex-col items-center justify-center text-slate-500">
                        <GitBranch size={48} className="mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-slate-700">No Pipeline Selected</h3>
                        <p className="max-w-xs text-center mt-2">Create a pipeline in Settings or select one to view deals.</p>
                    </div>
                )}
            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={fetchData}
                type="deals"
            />
        </div>
    );
}
