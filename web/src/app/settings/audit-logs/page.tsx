"use client";

import { useState, useEffect } from 'react';
import { Shield, Search, Filter, Clock, User, Activity, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface AuditLog {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    action: string;
    module: string;
    description: string;
    createdAt: string;
    ipAddress: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/audit-logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.module.toLowerCase().includes(search.toLowerCase()) ||
        `${log.user?.firstName} ${log.user?.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'update': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'delete': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
                        <p className="text-slate-500 mt-2 font-medium">Track all user activities and system changes.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="pl-12 pr-4 py-3.5 w-full bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="p-6 animate-pulse flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : filteredLogs.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Activity size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">No logs found</h3>
                            <p className="text-slate-500 font-medium">No activity matching your search was found.</p>
                        </div>
                    ) : (
                        filteredLogs.map(log => (
                            <div key={log._id} className="p-6 hover:bg-slate-50/50 transition-all group flex items-start gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${getActionColor(log.action)}`}>
                                    <Activity size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-900">
                                                {log.user?.firstName} {log.user?.lastName}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {log.module}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                                            <Clock size={12} />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                        {log.description}
                                    </p>
                                    {log.ipAddress && (
                                        <div className="mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                            IP: {log.ipAddress}
                                        </div>
                                    )}
                                </div>
                                <div className="self-center">
                                    <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400 transition-all" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
