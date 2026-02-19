"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, MoreHorizontal, Download, Loader2, Upload, Phone, Settings2, X, Check, ChevronDown, Filter, LayoutGrid, List, Mail, User, Briefcase, Building2 } from 'lucide-react';
import QuickAddModal from '@/components/QuickAddModal';
import ImportModal from '@/components/ImportModal';
import Pagination from '@/components/Pagination';

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization?: any;
    jobTitle: string;
    createdAt: string;
    customFields?: Record<string, any>;
}

interface Column {
    key: string;
    label: string;
    visible: boolean;
}

const DEFAULT_COLUMNS: Omit<Column, 'visible'>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'organization', label: 'Organization' },
    { key: 'createdAt', label: 'Created' },
];

const STORAGE_KEY = 'contacts_columns_v1';

function loadColumns(): Column[] {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS.map(c => ({ ...c, visible: true }));
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const existingKeys = new Set(parsed.map((c: any) => c.key));
            const extras = DEFAULT_COLUMNS.filter(c => !existingKeys.has(c.key)).map(c => ({ ...c, visible: false }));
            return [...parsed, ...extras];
        }
    } catch { /* ignore */ }
    return DEFAULT_COLUMNS.map(c => ({ ...c, visible: true }));
}

function saveColumns(cols: Column[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cols)); } catch { /* ignore */ }
}

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Pagination & Columns
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isColumnsOpen, setIsColumnsOpen] = useState(false);
    const [draftColumns, setDraftColumns] = useState<Column[]>([]);
    const [newColLabel, setNewColLabel] = useState('');

    // Actions menu
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    const fetchContacts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setContacts(data);
            }
        } catch (err) {
            console.error('Failed to fetch contacts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setColumns(loadColumns());
        fetchContacts();

        // Click outside listener for actions
        const handleClickOutside = (e: MouseEvent) => {
            if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const visibleCols = columns.filter(c => c.visible);
    const filtered = contacts.filter(contact =>
        `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.jobTitle}`.toLowerCase().includes(search.toLowerCase())
    );
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSaveColumns = () => {
        setColumns(draftColumns);
        saveColumns(draftColumns);
        setIsColumnsOpen(false);
    };

    const handleAddColumn = async () => {
        const label = newColLabel.trim();
        if (!label) return;
        const key = label.toLowerCase().replace(/\s+/g, '_');

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/custom-fields', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: label, key, module: 'contacts', type: 'text' })
            });
            if (res.ok) {
                setDraftColumns([...draftColumns, { key: `cf_${key}`, label, visible: true }]);
                setNewColLabel('');
            }
        } catch (err) {
            console.error('Failed to add custom property', err);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/export/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const csvContent = await res.text();
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
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

    const renderCell = (contact: Contact, colKey: string) => {
        if (colKey === 'name') return (
            <span className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs uppercase">
                    {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {contact.firstName} {contact.lastName}
                </span>
            </span>
        );
        if (colKey === 'email') return <span className="text-slate-500 font-medium text-sm">{contact.email}</span>;
        if (colKey === 'phone') return <span className="text-slate-500 font-medium text-sm">{contact.phone || '—'}</span>;
        if (colKey === 'jobTitle') return <span className="text-slate-500 font-medium text-sm">{contact.jobTitle || '—'}</span>;
        if (colKey === 'organization') return <span className="text-slate-500 font-medium text-sm">{contact.organization?.name || contact.organization || '—'}</span>;
        if (colKey === 'createdAt') return <span className="text-slate-400 text-xs font-medium">{new Date(contact.createdAt).toLocaleDateString()}</span>;

        if (colKey.startsWith('cf_')) {
            const cfKey = colKey.replace('cf_', '');
            return <span className="text-slate-500 font-medium text-sm">{contact.customFields?.[cfKey] || '—'}</span>;
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contacts</h1>
                    <p className="text-slate-500 mt-1 font-medium">{filtered.length} active contacts</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative" ref={actionsRef}>
                        <button
                            onClick={() => setIsActionsOpen(!isActionsOpen)}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl text-sm font-black shadow-sm transition-all active:scale-95"
                        >
                            Actions
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isActionsOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-50 p-3 z-50 animate-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setIsActionsOpen(false); setIsImportModalOpen(true); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    <Upload size={18} />
                                    Import Contacts
                                </button>
                                <button
                                    onClick={() => { setIsActionsOpen(false); fetchContacts(); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    <Loader2 size={18} />
                                    Restore View
                                </button>
                                <div className="h-[1px] bg-slate-50 my-2 mx-2" />
                                <button
                                    onClick={() => { setIsActionsOpen(false); setDraftColumns(columns.map(c => ({ ...c }))); setIsColumnsOpen(true); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all"
                                >
                                    <Settings2 size={18} />
                                    Customize Properties
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl shadow-sm transition-all"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add Contact
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="pl-12 pr-4 py-3.5 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                {visibleCols.map(col => (
                                    <th key={col.key} className="px-8 py-5">{col.label}</th>
                                ))}
                                <th className="px-8 py-5 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        {visibleCols.map(c => (
                                            <td key={c.key} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-lg w-full" /></td>
                                        ))}
                                        <td className="px-8 py-6" />
                                    </tr>
                                ))
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleCols.length + 1} className="py-20 text-center opacity-40">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                                <User size={40} className="text-slate-200" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No contacts found</h3>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map(contact => (
                                <tr
                                    key={contact._id}
                                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                    onClick={() => router.push(`/contacts/${contact._id}`)}
                                >
                                    {visibleCols.map(col => (
                                        <td key={col.key} className="px-8 py-6">
                                            {renderCell(contact, col.key)}
                                        </td>
                                    ))}
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                                            <MoreHorizontal size={18} />
                                        </button>
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
                    onPageSizeChange={setPageSize}
                />
            </div>

            {/* Customize Properties Modal */}
            {isColumnsOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsColumnsOpen(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Customize Properties</h2>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Manage columns for your contacts view</p>
                            </div>
                            <button onClick={() => setIsColumnsOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-1 custom-scrollbar">
                            {draftColumns.map(col => (
                                <button
                                    key={col.key}
                                    onClick={() => setDraftColumns(prev => prev.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all ${col.visible ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:bg-slate-50'
                                        }`}
                                >
                                    {col.label}
                                    {col.visible && <Check size={16} strokeWidth={3} />}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-50 bg-slate-50/50 space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add custom contact field..."
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                                    value={newColLabel}
                                    onChange={e => setNewColLabel(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddColumn()}
                                />
                                <button
                                    onClick={handleAddColumn}
                                    className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-black transition-all shadow-sm"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsColumnsOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveColumns}
                                    className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab="Contact" />
            <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} type="contacts" onSuccess={fetchContacts} />
        </div>
    );
}
