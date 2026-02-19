"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DollarSign, Calendar, Building2, ChevronLeft, Edit2, Send, TrendingUp, Trash2 } from 'lucide-react';
import Timeline from '@/components/Timeline';
import EditModal from '@/components/EditModal';
import PaymentTermsModal from '@/components/PaymentTermsModal';
import { Copy, ExternalLink, CreditCard } from 'lucide-react';

const STAGES = ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function DealDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [deal, setDeal] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [activityType, setActivityType] = useState('Comment');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handlePostActivity = () => {
        if (!newComment.trim()) return;
        const activity = { type: activityType, content: newComment, relatedTo: id, relatedType: 'Deal' };

        fetch('http://localhost:3001/crm/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        }).then(res => res.json()).then(data => {
            setActivities([data, ...activities]);
            setNewComment('');
            setActivityType('Comment');
        });
    };

    const copyPortalLink = () => {
        const url = `${window.location.origin}/portal/${deal.portalToken}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generatePortalToken = async () => {
        const token = localStorage.getItem('token');
        const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        try {
            const res = await fetch(`http://localhost:3001/crm/deals/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ portalToken: newToken })
            });
            if (res.ok) setDeal({ ...deal, portalToken: newToken });
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:3001/crm/deals/${id}`).then(res => res.json()),
            fetch(`http://localhost:3001/crm/activities?relatedTo=${id}`).then(res => res.json())
        ]).then(([dealData, activityData]) => {
            setDeal(dealData);
            setActivities(activityData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            // Fallback mock
            setDeal({
                organization: 'Acme Corp', dealValue: 15000, status: 'Proposal', probability: 40,
                expectedClosureDate: '2024-12-31', createdAt: new Date().toISOString()
            });
            setActivities([
                { _id: 'a1', type: 'Note', content: 'Sent proposal document via email.', createdAt: new Date().toISOString(), author: { name: 'Admin' } }
            ]);
        });
    }, [id]);

    if (loading || !deal) return <div className="animate-pulse flex flex-col gap-6">
        <div className="h-20 bg-gray-100 rounded"></div>
        <div className="h-96 bg-gray-50 rounded"></div>
    </div>;

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={16} />
                Back to Deals
            </button>

            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{deal.organization}</h1>
                        <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{deal.status}</span>
                    </div>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                        <DollarSign size={16} />
                        {(deal.dealValue || 0).toLocaleString()} &bull; Expected {deal.expectedClosureDate ? new Date(deal.expectedClosureDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this deal?')) {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`http://localhost:3001/crm/deals/${id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (res.ok) router.push('/deals');
                            }
                        }}
                        className="px-4 py-2 bg-white border border-red-100 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2 text-red-600 shadow-sm transition-all active:scale-95"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <CreditCard size={16} className="text-blue-600" />
                        Payments
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <Edit2 size={16} className="text-slate-400" />
                        Edit
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-[10px]">
                        Mark as Won
                    </button>
                    <EditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        type="Deal"
                        initialData={deal}
                        onSuccess={() => {
                            fetch(`http://localhost:3001/crm/deals/${id}`).then(res => res.json()).then(data => setDeal(data));
                        }}
                    />
                </div>
            </div>

            <div className="bg-white border rounded-lg p-2 shadow-sm flex items-center justify-between">
                {STAGES.map((stage, idx) => {
                    const isCompleted = STAGES.indexOf(deal.status) >= idx;
                    const isCurrent = deal.status === stage;
                    return (
                        <div key={stage} className="flex-1 relative flex flex-col items-center gap-2 py-4 group cursor-pointer">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 transition-colors ${isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-md' :
                                isCompleted ? 'bg-blue-100 border-blue-500 text-blue-600' :
                                    'bg-white border-gray-200 text-gray-300 group-hover:border-gray-300'
                                }`}>
                                {idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-blue-600' : 'text-gray-400'
                                }`}>{stage}</span>
                            {idx < STAGES.length - 1 && (
                                <div className={`absolute left-1/2 top-8 w-full h-[2px] -translate-y-1/2 z-0 ${isCompleted ? 'bg-blue-500' : 'bg-gray-100'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest text-gray-400">Activity Timeline</h3>
                            <div className="flex bg-gray-50 p-1 rounded-md border">
                                {['Comment', 'Note', 'Call', 'Task'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActivityType(type)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activityType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8 relative group">
                            <textarea
                                className={`w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all shadow-inner ${activityType === 'Task' ? 'bg-orange-50 border-orange-100' :
                                    activityType === 'Call' ? 'bg-green-50 border-green-100' : 'bg-gray-50'
                                    }`}
                                placeholder={
                                    activityType === 'Task' ? 'Describe the task...' :
                                        activityType === 'Call' ? 'Call notes...' :
                                            'Write an update...'
                                }
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={handlePostActivity}
                                className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <Timeline activities={activities} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest text-gray-400">Deal Probability</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${deal.probability}%` }} />
                            </div>
                            <span className="font-bold text-blue-600 text-lg">{deal.probability}%</span>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest text-gray-400">Insights</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Engagement Score</p>
                                    <p className="text-sm font-bold text-gray-900 font-mono">High (84/100)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Client Portal</h3>
                        {deal.portalToken ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 break-all text-[10px] font-mono text-slate-500">
                                    {window.location.host}/portal/{deal.portalToken}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyPortalLink}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                                    >
                                        <Copy size={14} />
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <a
                                        href={`/portal/${deal.portalToken}`}
                                        target="_blank"
                                        className="p-3.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 font-medium">Enable the secure portal to share progress with your client.</p>
                                <button
                                    onClick={generatePortalToken}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Enable Client Portal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PaymentTermsModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                dealId={id as string}
            />
        </div>
    );
}
