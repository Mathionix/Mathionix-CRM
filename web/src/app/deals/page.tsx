"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, DollarSign, Calendar, Download, Loader2, Upload, GitBranch, LayoutGrid, List, Settings2, Trash2, Check, X, ChevronDown } from 'lucide-react';
import ImportModal from '@/components/ImportModal';
import Pagination from '@/components/Pagination';

interface Deal {
    _id: string;
    organization: any;
    dealValue: number;
    status: string; // This is the stage name
    probability: number;
    expectedClosureDate: string;
    pipeline: string; // Pipeline ID
    title?: string;
    priority?: string;
    createdAt?: string;
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

interface Column {
    key: string;
    label: string;
    visible: boolean;
}

const BUILT_IN_COLUMNS: Omit<Column, 'visible'>[] = [
    { key: 'title', label: 'Deal Name' },
    { key: 'organization', label: 'Organization' },
    { key: 'dealValue', label: 'Amount' },
    { key: 'status', label: 'Stage' },
    { key: 'probability', label: 'Probability' },
    { key: 'priority', label: 'Priority' },
    { key: 'expectedClosureDate', label: 'Close Date' },
    { key: 'createdAt', label: 'Created' },
];

const STORAGE_KEY = 'deals_columns_v2';

function loadColumns(): Column[] {
    if (typeof window === 'undefined') return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: i < 6 }));
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed: Column[] = JSON.parse(saved);
            const existingKeys = new Set(parsed.map(c => c.key));
            const extras = BUILT_IN_COLUMNS.filter(c => !existingKeys.has(c.key)).map(c => ({ ...c, visible: false }));
            return [...parsed, ...extras];
        }
    } catch { /* ignore */ }
    return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: i < 6 }));
}

function saveColumns(cols: Column[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cols)); } catch { /* ignore */ }
}

export default function DealsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [deals, setDeals] = useState<Deal[]>([]);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Pagination & Columns
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);
    const [draftColumns, setDraftColumns] = useState<Column[]>([]);
    const [newColumnLabel, setNewColumnLabel] = useState('');

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

    useEffect(() => {
        setColumns(loadColumns());
        fetchData();
    }, []);

    useEffect(() => {
        if (isColumnEditorOpen) setDraftColumns(columns.map(c => ({ ...c })));
    }, [isColumnEditorOpen]);

    const handleSaveColumns = () => {
        setColumns(draftColumns);
        saveColumns(draftColumns);
        setIsColumnEditorOpen(false);
    };

    const handleToggleDraft = (key: string) => {
        setDraftColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
    };

    const handleAddColumn = () => {
        const label = newColumnLabel.trim();
        if (!label) return;
        const key = `custom_${label.toLowerCase().replace(/\s+/g, '_')}`;
        if (draftColumns.find(c => c.key === key)) return;
        setDraftColumns(prev => [...prev, { key, label, visible: true }]);
        setNewColumnLabel('');
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
            fetchData();
        }
    };

    const selectedPipeline = pipelines.find(p => p._id === selectedPipelineId);
    const pipelineStages = selectedPipeline ? selectedPipeline.stages.sort((a, b) => a.order - b.order) : [];
    const pipelineDeals = deals.filter(d =>
        d.pipeline === selectedPipelineId ||
        (!d.pipeline && selectedPipeline?.isDefault)
    );

    const paginatedDeals = pipelineDeals.slice((page - 1) * pageSize, page * pageSize);
    const visibleCols = columns.filter(c => c.visible);

    const renderCell = (deal: Deal, key: string) => {
        switch (key) {
            case 'title': return (
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                    {deal.title || 'Untitled Deal'}
                </span>
            );
            case 'organization':
                const orgName = typeof deal.organization === 'string' ? deal.organization : deal.organization?.name;
                return <span className="text-slate-500 font-medium text-sm">{orgName || '—'}</span>;
            case 'dealValue': return <span className="text-slate-900 font-black text-sm">${(deal.dealValue || 0).toLocaleString()}</span>;
            case 'status': return (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                    {deal.status}
                </span>
            );
            case 'probability': return (
                <div className="flex items-center gap-2">
                    <div className="flex-1 w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{deal.probability}%</span>
                </div>
            );
            case 'priority': return <span className="text-slate-500 font-medium text-sm uppercase tracking-widest text-[10px]">{deal.priority || 'Medium'}</span>;
            case 'expectedClosureDate': return (
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                    <Calendar size={12} />
                    {deal.expectedClosureDate ? new Date(deal.expectedClosureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                </div>
            );
            case 'createdAt': return <span className="text-slate-400 text-xs font-medium">{deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '—'}</span>;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Deals</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your sales opportunities</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Board View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Table View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden md:block" />

                    <div className="relative group">
                        <GitBranch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={selectedPipelineId}
                            onChange={(e) => setSelectedPipelineId(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 pl-11 pr-8 py-3 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer hover:bg-slate-50 transition-all min-w-[160px]"
                        >
                            {pipelines.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {viewMode === 'list' && (
                        <button
                            onClick={() => setIsColumnEditorOpen(true)}
                            className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl shadow-sm transition-all"
                            title="Edit Columns"
                        >
                            <Settings2 size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-3 rounded-2xl text-sm font-black shadow-sm transition-all active:scale-95"
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-3 rounded-2xl text-sm font-black shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Export
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Deal', pipelineId: selectedPipelineId } }))}
                        className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 text-sm"
                    >
                        <Plus size={18} />
                        New Deal
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-slate-300" />
                    </div>
                ) : viewMode === 'kanban' ? (
                    /* Kanban View */
                    <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
                        {pipelineStages.length > 0 ? (
                            pipelineStages.map(stage => {
                                const stageDeals = pipelineDeals.filter(d => (d.status || (d as any).stage) === stage.name);
                                const totalValue = stageDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

                                return (
                                    <div
                                        key={stage.name}
                                        className="w-80 shrink-0 flex flex-col h-full bg-slate-50/50 rounded-[32px] border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, stage.name)}
                                    >
                                        <div className="flex justify-between items-center mb-6 px-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{stage.name}</h3>
                                                <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black">
                                                    {stageDeals.length}
                                                </span>
                                            </div>
                                            <button className="p-1 hover:bg-white rounded-lg text-slate-300 hover:text-slate-900 transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="text-[12px] font-black text-slate-900 mb-6 px-2 flex items-baseline gap-1">
                                            <span className="text-slate-400 font-medium">$</span>
                                            {totalValue.toLocaleString()}
                                        </div>

                                        <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                                            {stageDeals.map(deal => (
                                                <div
                                                    key={deal._id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, deal._id)}
                                                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                                                    onClick={() => router.push(`/deals/${deal._id}`)}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 truncate mr-2 uppercase tracking-tight text-sm">
                                                            {deal.title || (typeof deal.organization === 'string' ? deal.organization : deal.organization?.name) || 'Untitled Deal'}
                                                        </h4>
                                                        <MoreHorizontal size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                                                    </div>

                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 truncate italic">
                                                        {typeof deal.organization === 'string' ? deal.organization : deal.organization?.name || 'No Organization'}
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-slate-900 mb-5 font-black text-sm">
                                                        <span className="text-slate-300 font-medium">$</span>
                                                        {(deal.dealValue || 0).toLocaleString()}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                            <Calendar size={12} className="text-slate-300" />
                                                            {deal.expectedClosureDate ? new Date(deal.expectedClosureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                                                        </div>
                                                        <div className="w-12 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
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
                            <div className="w-full flex flex-col items-center justify-center text-slate-500 py-20">
                                <GitBranch size={48} className="mb-4 opacity-50" />
                                <h3 className="text-lg font-bold text-slate-700">No Pipeline Available</h3>
                                <p className="max-w-xs text-center mt-2">Create a pipeline in Settings to get started.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        {visibleCols.map(col => (
                                            <th key={col.key} className="px-8 py-5">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="px-8 py-5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedDeals.length === 0 ? (
                                        <tr>
                                            <td colSpan={visibleCols.length + 1} className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-40">
                                                    <LayoutGrid size={40} className="mb-4" />
                                                    <h3 className="text-xl font-black text-slate-900">No deals found</h3>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedDeals.map(deal => (
                                            <tr
                                                key={deal._id}
                                                className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                                onClick={() => router.push(`/deals/${deal._id}`)}
                                            >
                                                {visibleCols.map(col => (
                                                    <td key={col.key} className="px-8 py-6">
                                                        {renderCell(deal, col.key)}
                                                    </td>
                                                ))}
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            total={pipelineDeals.length}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}
            </div>

            {/* Column Editor Modal */}
            {isColumnEditorOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsColumnEditorOpen(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Edit Columns</h2>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Customize your deal list view</p>
                            </div>
                            <button onClick={() => setIsColumnEditorOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-1">
                            {draftColumns.map(col => (
                                <div key={col.key} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 group/col">
                                    <button
                                        onClick={() => handleToggleDraft(col.key)}
                                        className={`flex items-center gap-3 flex-1 text-sm font-bold text-left transition-all ${col.visible ? 'text-slate-900' : 'text-slate-400'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${col.visible ? 'bg-slate-900 border-slate-900' : 'border-slate-200'}`}>
                                            {col.visible && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                        {col.label}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-50 bg-slate-50/50 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add custom property..."
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    value={newColumnLabel}
                                    onChange={e => setNewColumnLabel(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddColumn()}
                                />
                                <button
                                    onClick={handleAddColumn}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-black transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsColumnEditorOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm font-black text-slate-700 transition-all">Cancel</button>
                                <button onClick={handleSaveColumns} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-slate-900/20">Apply View</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={fetchData}
                type="deals"
            />
        </div>
    );
}
