"use client";

import { useState, useEffect } from 'react';
import { X, Mail, Shield, Loader2, Send } from 'lucide-react';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function InviteModal({ isOpen, onClose, onSuccess }: InviteModalProps) {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        roleId: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            setFormData({ email: '', roleId: '' });
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users/roles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoles(data);
            }
        } catch (error) {
            console.error('Fetch roles error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:3001/users/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || 'Invitation failed');
            }
        } catch (error) {
            console.error('Invite error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-indigo-50/30">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Send size={20} className="text-indigo-600" />
                            Invite Member
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Send an invitation link via email.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="email"
                                required
                                placeholder="team@mathionix.com"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Assign Role</label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <select
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer"
                                value={formData.roleId}
                                onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                            >
                                <option value="">Select a role...</option>
                                {roles.map(role => (
                                    <option key={role._id} value={role._id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-[22px] py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
