"use client";

import { useState, useEffect } from 'react';
import { PhoneCall, Plus, ArrowUpRight, ArrowDownLeft, Clock, History } from 'lucide-react';
import ActivityTimeline from '../../components/ActivityTimeline';
import ActivityLogger from '../../components/ActivityLogger';

interface Call {
    _id: string;
    type: string;
    title: string;
    content: string;
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

    const fetchCalls = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities?type=Call`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const callList = Array.isArray(data) ? data : data.data || [];
            setCalls(callList);
        } catch (err) {
            console.error('Failed to fetch calls', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCalls(); }, []);

    const handleSaveActivity = async (payload: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (res.ok) fetchCalls();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently remove this call log?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/activities/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setCalls(calls.filter(c => c._id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Comms Center</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic opacity-70 tracking-tight">Review communication velocity and stakeholder engagement levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        <History size={14} className="text-orange-500" />
                        Engagement Feed
                    </div>
                </div>
            </div>

            <ActivityLogger onSave={handleSaveActivity} relatedType="General" fixedType="Call" />

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Timeline History</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                </div>

                <ActivityTimeline
                    activities={calls}
                    loading={loading}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
