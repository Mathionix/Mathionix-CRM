"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Building2, MoreHorizontal, Settings2, GripVertical, X, Check, Trash2, ChevronDown } from 'lucide-react';
import QuickAddModal from '@/components/QuickAddModal';
import Pagination from '@/components/Pagination';

interface Organization {
    _id: string;
    name: string;
    website: string;
    industry: string;
    phone: string;
    email: string;
    territory?: string;
    noOfEmployees?: string;
    annualRevenue?: number;
    address?: string;
    createdAt?: string;
}

interface Column {
    key: string;
    label: string;
    visible: boolean;
}

const BUILT_IN_COLUMNS: Omit<Column, 'visible'>[] = [
    { key: 'name', label: 'Name' },
    { key: 'website', label: 'Website' },
    { key: 'industry', label: 'Industry' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'territory', label: 'Territory' },
    { key: 'noOfEmployees', label: 'Employees' },
    { key: 'annualRevenue', label: 'Annual Revenue' },
    { key: 'address', label: 'Address' },
    { key: 'createdAt', label: 'Created' },
];

const STORAGE_KEY = 'org_columns_v2';

function loadColumns(): Column[] {
    if (typeof window === 'undefined') return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: i < 5 }));
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed: Column[] = JSON.parse(saved);
            // Merge with builtIn to catch new columns
            const existingKeys = new Set(parsed.map(c => c.key));
            const extras = BUILT_IN_COLUMNS.filter(c => !existingKeys.has(c.key)).map(c => ({ ...c, visible: false }));
            return [...parsed, ...extras];
        }
    } catch { /* ignore */ }
    return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: i < 5 }));
}

function saveColumns(cols: Column[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cols)); } catch { /* ignore */ }
}

function renderCell(org: Organization, key: string) {
    switch (key) {
        case 'name': return (
            <span className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Building2 size={14} />
                </div>
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{org.name}</span>
            </span>
        );
        case 'website': return <a href={org.website ? `https://${org.website.replace(/^https?:\/\//, '')}` : '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium text-sm" onClick={e => e.stopPropagation()}>{org.website || '—'}</a>;
        case 'industry': return org.industry ? <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{org.industry}</span> : <span className="text-slate-300">—</span>;
        case 'phone': return <span className="text-slate-500 font-medium text-sm">{org.phone || '—'}</span>;
        case 'email': return <span className="text-slate-500 font-medium text-sm">{org.email || '—'}</span>;
        case 'territory': return <span className="text-slate-500 font-medium text-sm">{org.territory || '—'}</span>;
        case 'noOfEmployees': return <span className="text-slate-500 font-medium text-sm">{org.noOfEmployees || '—'}</span>;
        case 'annualRevenue': return <span className="text-slate-700 font-bold text-sm">{org.annualRevenue ? `$${org.annualRevenue.toLocaleString()}` : '—'}</span>;
        case 'address': return <span className="text-slate-500 font-medium text-sm">{org.address || '—'}</span>;
        case 'createdAt': return <span className="text-slate-400 text-xs font-medium">{org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}</span>;
        default: return null;
    }
}

export default function OrganizationsPage() {
    const router = useRouter();
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);
    const [newColumnLabel, setNewColumnLabel] = useState('');
    const [draftColumns, setDraftColumns] = useState<Column[]>([]);
    const columnEditorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setColumns(loadColumns());
        fetchOrgs();
    }, []);

    useEffect(() => {
        if (isColumnEditorOpen) setDraftColumns(columns.map(c => ({ ...c })));
    }, [isColumnEditorOpen]);

    const fetchOrgs = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/organizations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { window.location.href = '/auth/login'; return; }
            const text = await res.text();
            const data = text ? JSON.parse(text) : [];
            const orgList = Array.isArray(data) ? data : (data.data || []);
            setOrgs(orgList);
        } catch (err) {
            console.error('Failed to fetch orgs', err);
            setOrgs([]);
        } finally {
            setLoading(false);
        }
    };

    const visibleCols = columns.filter(c => c.visible);
    const filtered = orgs.filter(o =>
        o?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o?.industry?.toLowerCase().includes(search.toLowerCase())
    );
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleToggleDraft = (key: string) => {
        setDraftColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
    };

    const handleDeleteDraftColumn = (key: string) => {
        setDraftColumns(prev => prev.filter(c => c.key !== key));
    };

    const handleAddColumn = () => {
        const label = newColumnLabel.trim();
        if (!label) return;
        const key = `custom_${label.toLowerCase().replace(/\s+/g, '_')}`;
        if (draftColumns.find(c => c.key === key)) return;
        setDraftColumns(prev => [...prev, { key, label, visible: true }]);
        setNewColumnLabel('');
    };

    const handleSaveColumns = () => {
        setColumns(draftColumns);
        saveColumns(draftColumns);
        setIsColumnEditorOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organizations</h1>
                    <p className="text-slate-500 mt-1 font-medium">{filtered.length} organization{filtered.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setIsColumnEditorOpen(true); }}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                    >
                        <Settings2 size={16} />
                        Edit Columns
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add Organization
                    </button>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                {/* Search */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            className="pl-11 pr-4 py-3 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                {visibleCols.map(col => (
                                    <th key={col.key} className="px-6 py-4">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        {visibleCols.map(c => (
                                            <td key={c.key} className="px-6 py-5"><div className="h-4 bg-slate-100 rounded-lg w-3/4" /></td>
                                        ))}
                                        <td className="px-6 py-5" />
                                    </tr>
                                ))
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleCols.length + 1} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <Building2 size={40} />
                                            <p className="font-bold text-slate-700">No organizations found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map(org => (
                                <tr
                                    key={org._id}
                                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                    onClick={() => router.push(`/organizations/${org._id}`)}
                                >
                                    {visibleCols.map(col => (
                                        <td key={col.key} className="px-6 py-4">
                                            {renderCell(org, col.key)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <MoreHorizontal size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    total={filtered.length}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={size => { setPageSize(size); setPage(1); }}
                />
            </div>

            {/* Column Editor Modal */}
            {isColumnEditorOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsColumnEditorOpen(false)} />
                    <div ref={columnEditorRef} className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Edit Columns</h2>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Show, hide, or add columns to the table</p>
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
                                    <button
                                        onClick={() => handleDeleteDraftColumn(col.key)}
                                        className="p-1.5 opacity-0 group-hover/col:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-300 transition-all"
                                        title="Remove column"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-50 bg-slate-50/50 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add custom column name..."
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
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
                                <button onClick={handleSaveColumns} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-slate-900/20">Save Columns</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab="Org" />
        </div>
    );
}
