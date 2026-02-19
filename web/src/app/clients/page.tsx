"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, UserCheck, MoreHorizontal, Settings2, GripVertical, X, Check, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import ClientModal from '@/components/ClientModal';
import Pagination from '@/components/Pagination';

interface Client {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    organization?: {
        _id: string;
        name: string;
    };
    createdAt?: string;
}

interface Column {
    key: string;
    label: string;
    visible: boolean;
}

const BUILT_IN_COLUMNS: Omit<Column, 'visible'>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'organization', label: 'Organization' },
    { key: 'createdAt', label: 'Added Date' },
];

const STORAGE_KEY = 'client_columns_v1';

function loadColumns(): Column[] {
    if (typeof window === 'undefined') return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: true }));
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return BUILT_IN_COLUMNS.map((c, i) => ({ ...c, visible: true }));
}

function saveColumns(cols: Column[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cols)); } catch { /* ignore */ }
}

function renderCell(client: Client, key: string, router: any) {
    switch (key) {
        case 'name': return (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 shadow-inner">
                    {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{client.name}</span>
            </div>
        );
        case 'email': return (
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Mail size={14} className="text-slate-300" />
                {client.email}
            </div>
        );
        case 'phone': return (
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Phone size={14} className="text-slate-300" />
                {client.phone || '—'}
            </div>
        );
        case 'status': return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${client.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                client.status === 'inactive' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                {client.status}
            </span>
        );
        case 'organization': return (
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <Building2 size={14} className="text-slate-300" />
                {client.organization?.name || 'Private Client'}
            </div>
        );
        case 'createdAt': return <span className="text-slate-400 text-xs font-medium">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '—'}</span>;
        default: return null;
    }
}

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);
    const [draftColumns, setDraftColumns] = useState<Column[]>([]);

    useEffect(() => {
        setColumns(loadColumns());
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/clients', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { window.location.href = '/auth/login'; return; }
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === 'object' && 'data' in data) {
                    setClients(data.data);
                } else {
                    setClients(Array.isArray(data) ? data : []);
                }
            }
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const visibleCols = columns.filter(c => c.visible);
    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.organization?.name.toLowerCase().includes(search.toLowerCase())
    );
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleToggleDraft = (key: string) => {
        setDraftColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clients</h1>
                    <p className="text-slate-500 mt-1 font-medium">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setDraftColumns(columns.map(c => ({ ...c }))); setIsColumnEditorOpen(true); }}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                    >
                        <Settings2 size={16} />
                        Edit Columns
                    </button>
                    <button
                        onClick={() => { setSelectedClient(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        New Client
                    </button>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="pl-11 pr-4 py-3 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

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
                                            <UserCheck size={40} />
                                            <p className="font-bold text-slate-700">No clients found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map(client => (
                                <tr
                                    key={client._id}
                                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                    onClick={() => router.push(`/clients/${client._id}`)}
                                >
                                    {visibleCols.map(col => (
                                        <td key={col.key} className="px-6 py-4">
                                            {renderCell(client, col.key, router)}
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
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Edit Columns</h2>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Show or hide columns in the table</p>
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

                        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                            <button onClick={() => setIsColumnEditorOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm font-black text-slate-700 transition-all">Cancel</button>
                            <button onClick={handleSaveColumns} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-slate-900/20">Save Columns</button>
                        </div>
                    </div>
                </div>
            )}

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchClients}
                client={selectedClient}
            />
        </div>
    );
}
