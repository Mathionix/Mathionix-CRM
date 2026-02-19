"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, MoreHorizontal, Download, Loader2, Upload, Phone } from 'lucide-react';
import QuickAddModal from '@/components/QuickAddModal';
import ImportModal from '@/components/ImportModal';
import ColumnCustomizer from '@/components/ColumnCustomizer';

interface Lead {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    phone?: string;
    mobileNo?: string;
    organization: string;
    createdAt: string;
    customFields?: Record<string, any>;
}

const DEFAULT_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'email', label: 'Email' },
    { key: 'organization', label: 'Organization' },
    { key: 'createdAt', label: 'Created' },
];

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS.map(c => c.key));
    const [availableColumns, setAvailableColumns] = useState(DEFAULT_COLUMNS);

    const fetchPreferences = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/column-preferences/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const text = await res.text();
            if (text && text.trim().length > 0) {
                try {
                    const data = JSON.parse(text);
                    if (data && data.columns) {
                        setVisibleColumns(data.columns);
                    }
                } catch (e) {
                    console.error('Failed to parse preferences:', e);
                }
            }
        } catch (err) {
            console.error('Failed to fetch preferences:', err);
        }
    };

    const fetchCustomFields = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/custom-fields?module=leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const cfColumns = data.map((f: any) => ({ key: `cf_${f.key}`, label: f.name, isCustom: true, originalKey: f.key }));
                setAvailableColumns([...DEFAULT_COLUMNS, ...cfColumns]);
            }
        } catch (err) {
            console.error('Failed to fetch custom fields:', err);
        }
    };

    const handleSavePreferences = async (columns: string[]) => {
        setVisibleColumns(columns);
        const token = localStorage.getItem('token');
        try {
            await fetch('http://localhost:3001/column-preferences/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ columns })
            });
        } catch (err) {
            console.error('Failed to save preferences:', err);
        }
    };

    const fetchLeads = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        try {
            const res = await fetch('http://localhost:3001/crm/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                console.error('Failed to fetch leads:', res.statusText);
                // Fallback mock data if API fails
                setLeads([
                    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'New', organization: 'Acme Corp', createdAt: new Date().toISOString() },
                    { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.com', status: 'Ongoing', organization: 'Globex', createdAt: new Date().toISOString() },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch leads', err);
            // Fallback mock data on network error
            setLeads([
                { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'New', organization: 'Acme Corp', createdAt: new Date().toISOString() },
                { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.com', status: 'Ongoing', organization: 'Globex', createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/export/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const csvContent = await res.text();
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
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
        fetchLeads();
        fetchPreferences();
        fetchCustomFields();
    }, []);

    const filteredLeads = leads.filter(lead =>
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.organization.toLowerCase().includes(search.toLowerCase())
    );

    const renderCell = (lead: Lead, colKey: string) => {
        if (colKey === 'name') return <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.firstName} {lead.lastName}</span>;
        if (colKey === 'status') return (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-slate-100 text-slate-600'
                }`}>
                {lead.status}
            </span>
        );
        if (colKey === 'email') return (
            <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium">{lead.email}</span>
                {lead.mobileNo && (
                    <a href={`tel:${lead.mobileNo}`} className="text-[10px] font-black text-indigo-500 flex items-center gap-1 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                        <Phone size={10} /> Call {lead.mobileNo}
                    </a>
                )}
            </div>
        );
        if (colKey === 'organization') return <span className="text-slate-500 font-medium">{lead.organization}</span>;
        if (colKey === 'createdAt') return <span className="text-slate-400 text-xs font-medium">{new Date(lead.createdAt).toLocaleDateString()}</span>;

        // Handle custom fields
        if (colKey.startsWith('cf_')) {
            const cfKey = colKey.replace('cf_', '');
            const value = lead.customFields?.[cfKey];
            return <span className="text-slate-500 font-medium">{value || '-'}</span>;
        }

        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and track your potential customers.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl text-sm font-black shadow-sm transition-all active:scale-95"
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl text-sm font-black shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Export
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add Lead
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-12 pr-4 py-3.5 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={18} />
                            Filters
                        </button>
                        <ColumnCustomizer
                            module="leads"
                            availableColumns={availableColumns}
                            currentColumns={visibleColumns}
                            onSave={handleSavePreferences}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                {visibleColumns.map(colKey => (
                                    <th key={colKey} className="px-8 py-5">
                                        {availableColumns.find(c => c.key === colKey)?.label || colKey}
                                    </th>
                                ))}
                                <th className="px-8 py-5 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        {visibleColumns.map(k => (
                                            <td key={k} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-lg w-full"></div></td>
                                        ))}
                                        <td className="px-8 py-6"></td>
                                    </tr>
                                ))
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumns.length + 1} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                                <Search size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">No leads found</h3>
                                            <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.map(lead => (
                                <tr
                                    key={lead._id}
                                    className="group hover:bg-slate-50/50 transition-all cursor-pointer relative"
                                    onClick={() => router.push(`/leads/${lead._id}`)}
                                >
                                    {visibleColumns.map(colKey => (
                                        <td key={colKey} className="px-8 py-6">
                                            {renderCell(lead, colKey)}
                                        </td>
                                    ))}
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all shadow-sm group-hover:opacity-100 opacity-0">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab="Lead" />
            <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} type="leads" onSuccess={fetchLeads} />
        </div>
    );
}
