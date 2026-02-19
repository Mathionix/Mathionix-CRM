"use client";

import { useState, useEffect } from 'react';
import { X, Shield, Key, Loader2, Check } from 'lucide-react';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role?: any;
}

export default function RoleModal({ isOpen, onClose, onSuccess, role }: RoleModalProps) {
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });

    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
            if (role) {
                setFormData({
                    name: role.name || '',
                    description: role.description || '',
                    permissions: role.permissions?.map((p: any) => p._id || p) || []
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    permissions: []
                });
            }
        }
    }, [isOpen, role]);

    const fetchPermissions = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAllPermissions(data);
            }
        } catch (error) {
            console.error('Fetch permissions error:', error);
        }
    };

    const togglePermission = (id: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(id)
                ? prev.permissions.filter(p => p !== id)
                : [...prev.permissions, id]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const method = role ? 'PUT' : 'POST';
            // Note: I need to add updateRole endpoint in backend if it doesn't exist.
            // For now, I'll assume standard PUT /users/roles/:id
            const url = role ? `http://localhost:3001/users/roles/${role._id}` : `http://localhost:3001/users/roles`;

            const res = await fetch(url, {
                method,
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
                alert(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Role mutation error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const groupedPermissions = allPermissions.reduce((acc: any, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{role ? 'Edit Role' : 'Create New Role'}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Define permissions for this role.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role Name</label>
                            <input
                                required
                                placeholder="e.g., Senior Sales Manager"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:font-medium"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                            <textarea
                                placeholder="Briefly describe the purpose of this role..."
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium h-20 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Key size={14} className="text-indigo-400" />
                            Select Permissions
                        </label>

                        <div className="space-y-8">
                            {Object.entries(groupedPermissions).map(([module, perms]: [string, any]) => (
                                <div key={module} className="space-y-3">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                        {module}
                                        <div className="h-px bg-slate-100 flex-1" />
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {perms.map((p: any) => {
                                            const isSelected = formData.permissions.includes(p._id);
                                            return (
                                                <div
                                                    key={p._id}
                                                    onClick={() => togglePermission(p._id)}
                                                    className={`cursor-pointer group flex items-start gap-3 p-3 rounded-2xl border transition-all ${isSelected
                                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                                            : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50'
                                                        }`}
                                                >
                                                    <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 group-hover:border-indigo-300'
                                                        }`}>
                                                        {isSelected && <Check size={12} strokeWidth={4} />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{p.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">{p.description || 'No description.'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (role ? 'Update Role' : 'Create Role')}
                    </button>
                </div>
            </div>
        </div>
    );
}
