"use client";

import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Loader2, Save, Trash2, Plus } from 'lucide-react';

interface PaymentTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    dealId: string;
}

export default function PaymentTermsModal({ isOpen, onClose, dealId }: PaymentTermsModalProps) {
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) fetchTerms();
    }, [isOpen, dealId]);

    const fetchTerms = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/crm/payment-terms/deal/${dealId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTerms(await res.json());
        } catch (error) {
            console.error('Fetch terms error:', error);
        }
    };

    const handleAddTerm = () => {
        setTerms([...terms, { title: '', amount: 0, dueDate: new Date().toISOString().split('T')[0], status: 'Pending', isNew: true }]);
    };

    const handleSave = async (term: any, index: number) => {
        const token = localStorage.getItem('token');
        setSaving(true);
        try {
            const method = term._id ? 'PUT' : 'POST';
            const url = term._id ? `http://localhost:3001/crm/payment-terms/${term._id}` : `http://localhost:3001/crm/payment-terms`;
            const payload = { ...term, deal: dealId };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) fetchTerms();
        } catch (error) {
            console.error('Save term error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this payment term?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/crm/payment-terms/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchTerms();
        } catch (error) {
            console.error('Delete term error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Payment Schedule</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Manage payment milestones for this deal.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    {terms.map((term, idx) => (
                        <div key={term._id || idx} className="grid grid-cols-12 gap-4 items-end p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                            <div className="col-span-4 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Title</label>
                                <input
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                    value={term.title}
                                    onChange={(e) => {
                                        const newTerms = [...terms];
                                        newTerms[idx].title = e.target.value;
                                        setTerms(newTerms);
                                    }}
                                />
                            </div>
                            <div className="col-span-3 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="number"
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        value={term.amount}
                                        onChange={(e) => {
                                            const newTerms = [...terms];
                                            newTerms[idx].amount = Number(e.target.value);
                                            setTerms(newTerms);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                    value={term.dueDate.split('T')[0]}
                                    onChange={(e) => {
                                        const newTerms = [...terms];
                                        newTerms[idx].dueDate = e.target.value;
                                        setTerms(newTerms);
                                    }}
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <button
                                    onClick={() => handleSave(term, idx)}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                                >
                                    <Save size={16} />
                                </button>
                                {term._id && (
                                    <button
                                        onClick={() => handleDelete(term._id)}
                                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all rounded-xl shadow-sm active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddTerm}
                        className="w-full border-2 border-dashed border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-400 hover:text-blue-600 py-6 rounded-[24px] font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        <Plus size={20} />
                        Add Payment Milestone
                    </button>
                </div>
            </div>
        </div>
    );
}
