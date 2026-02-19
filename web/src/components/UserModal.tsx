"use client";

import { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Lock, Loader2 } from 'lucide-react';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: any;
}

export default function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: '',
        isActive: true
    });

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            if (user) {
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    password: '', // Don't show password
                    roleId: user.roleId?._id || user.roleId || '',
                    isActive: user.isActive !== false
                });
            } else {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    roleId: '',
                    isActive: true
                });
            }
        }
    }, [isOpen, user]);

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
            const method = user ? 'PUT' : 'POST';
            const url = user ? `http://localhost:3001/users/${user._id}` : `http://localhost:3001/users`;

            // For updates, don't send empty password
            const payload = { ...formData };
            if (user && !payload.password) {
                delete (payload as any).password;
            }

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
            console.error('User mutation error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl shadow-blue-500/10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{user ? 'Edit User' : 'Add New User'}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Configure profile and access levels.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                            <input
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                            <input
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                            {user ? 'New Password (Optional)' : 'Password'}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="password"
                                required={!user}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role & Access</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none"
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

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                            checked={formData.isActive}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
                            Active Account
                            <span className="block text-xs font-medium text-slate-400 mt-0.5">Allow this user to log in and use features.</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (user ? 'Save Changes' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
}
