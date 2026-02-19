"use client";

import { useState, useEffect } from 'react';
import { PhoneCall, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface Call {
    _id: string;
    title: string;
    content?: string;
    createdAt: string;
    metadata?: {
        type?: string;     // Inbound, Outbound
        duration?: number; // Seconds
        status?: string;   // Completed, Missed, etc.
        from?: string;
        to?: string;
    };
    author?: {
        name: string;
    };
}

export default function CallsPage() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Call`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async res => {
                if (res.status === 401) {
                    window.location.href = '/auth/login';
                    return null;
                }
                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .then(data => {
                if (data) {
                    // Handle both array and paginated response
                    const callList = Array.isArray(data) ? data : (data.data || []);
                    setCalls(callList);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch calls', err);
                setCalls([]); // Fallback to empty array
                setLoading(false);
            });
    }, []);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Communication Logs</h1>
                    <p className="text-sm text-gray-500">Review your call history and recorded communications.</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Call' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Log Call
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : calls.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                        <PhoneCall size={64} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">No calls logged</h3>
                        <p className="text-slate-500">Log your first call to start tracking communications.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Contact / Number</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Logged By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Array.isArray(calls) && calls.length > 0 && calls.map(call => (
                                <tr key={call._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-900">
                                            <div className={`p-1.5 rounded-lg ${call.metadata?.type === 'Inbound' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {call.metadata?.type === 'Inbound' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            {call.metadata?.type || 'Outbound'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{call.metadata?.to || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">from {call.metadata?.from || 'Unknown'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${call.metadata?.status === 'Missed' ? 'bg-rose-100 text-rose-600' :
                                            call.metadata?.status === 'Busy' ? 'bg-amber-100 text-amber-600' :
                                                'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {call.metadata?.status || 'Completed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600">
                                        {formatDuration(call.metadata?.duration)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(call.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {call.author?.name || 'Administrator'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
