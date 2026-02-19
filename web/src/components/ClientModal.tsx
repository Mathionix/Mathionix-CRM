"use client";

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Loader2 } from 'lucide-react';

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    client?: any;
}

export default function ClientModal({ isOpen, onClose, onSuccess, client }: ClientModalProps) {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        organization: '',
        status: 'active'
    });

    useEffect(() => {
        if (isOpen) {
            fetchOrganizations();
            if (client) {
                setFormData({
                    name: client.name || '',
                    email: client.email || '',
                    phone: client.phone || '',
                    organization: client.organization?._id || client.organization || '',
                    status: client.status || 'active'
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    organization: '',
                    status: 'active'
                });
            }
        }
    }, [isOpen, client]);

    const fetchOrganizations = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/crm/organizations/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrganizations(data);
            }
        } catch (error) {
            console.error('Fetch organizations error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const method = client ? 'PUT' : 'POST';
            const url = client ? `http://localhost:3001/crm/clients/${client._id}` : `http://localhost:3001/crm/clients`;

            const payload: any = { ...formData };
            // Strip empty organization — Mongoose can't cast "" to ObjectId
            if (!payload.organization) delete payload.organization;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Client mutation error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{client ? 'Edit Client' : 'New Client'}</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage end-customer details and status.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                required
                                className="w-full bg-slate-50/50 border-none rounded-[22px] py-4.5 pl-14 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-slate-300 shadow-inner"
                                placeholder="e.g. John Smith"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50/50 border-none rounded-[22px] py-4.5 pl-14 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-slate-300 shadow-inner"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    className="w-full bg-slate-50/50 border-none rounded-[22px] py-4.5 pl-14 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-slate-300 shadow-inner"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Organization</label>
                            <div className="relative group">
                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <select
                                    className="w-full bg-slate-50/50 border-none rounded-[22px] py-4.5 pl-14 pr-10 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold shadow-inner appearance-none cursor-pointer"
                                    value={formData.organization}
                                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                >
                                    <option value="">Select Organization...</option>
                                    {organizations.map(org => (
                                        <option key={org._id} value={org._id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Status</label>
                            <div className="flex bg-slate-50/50 p-2 rounded-[24px] shadow-inner border border-slate-100/50">
                                {['active', 'prospective', 'inactive'].map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`flex-1 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white rounded-[26px] py-5 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (client ? 'Save Changes' : 'Create Client')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
