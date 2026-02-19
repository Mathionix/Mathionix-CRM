"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, Calendar, Building2, CheckCircle2, Clock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function ClientPortalPage() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/portal/${token}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [token]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <h1 className="text-2xl font-black text-slate-900">Entering Portal...</h1>
            <p className="text-slate-500 font-medium">Please wait while we secure your connection.</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
                <ShieldCheck size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Access Denied</h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto">This portal link is invalid or has expired. Please contact your account manager for a new link.</p>
        </div>
    );

    const { deal, payments } = data;
    const paidAmount = payments.filter((p: any) => p.status === 'Paid').reduce((sum: number, p: any) => sum + p.amount, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={12} />
                                    Secure Client Portal
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                                Project: {deal.organization?.name || 'Project Overview'}
                            </h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <Building2 size={16} />
                                {deal.organization?.name || 'Organization'} &bull; ID: {deal._id.slice(-8).toUpperCase()}
                            </p>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[24px] flex flex-col items-center justify-center min-w-[200px]">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Project Status</p>
                            <span className="text-xl font-black text-slate-900 uppercase tracking-tight">{deal.stage || deal.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Progress & Payments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Payment Schedule */}
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <DollarSign className="text-blue-600" size={24} />
                            Payment Schedule
                        </h3>

                        <div className="space-y-4">
                            {payments.map((payment: any) => (
                                <div key={payment._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${payment.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400'}`}>
                                            {payment.status === 'Paid' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{payment.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Due {new Date(payment.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900 font-mono">₹{payment.amount.toLocaleString()}</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {payments.length === 0 && (
                            <div className="bg-slate-50 text-slate-400 p-12 rounded-[24px] text-center border-2 border-dashed border-slate-100">
                                <p className="font-bold">No payment terms defined for this project.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Summaries */}
                <div className="space-y-8">
                    <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6">Financial Overview</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-slate-400 font-medium mb-1">Total Project Value</p>
                                <p className="text-3xl font-black font-mono">₹{deal.dealValue?.toLocaleString() || '0'}</p>
                            </div>
                            <div className="pt-6 border-t border-slate-800">
                                <p className="text-xs text-slate-400 font-medium mb-1">Amount Paid</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-black text-green-400 font-mono">₹{paidAmount.toLocaleString()}</p>
                                    <p className="text-xs font-bold text-slate-500 mb-1">{Math.round((paidAmount / (deal.dealValue || 1)) * 100)}%</p>
                                </div>
                                <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(paidAmount / (deal.dealValue || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Contact Support</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">Need assistance with your project or payments?</p>
                            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                Send a Message
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
