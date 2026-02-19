"use client";

import { useState, useEffect } from 'react';
import { Shield, Plus, ChevronLeft, Search, Check, Key, Lock, Settings } from 'lucide-react';
import Link from 'next/link';
import RoleModal from '@/components/RoleModal';

export default function RolesPermissionsPage() {
    const [roles, setRoles] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [rolesRes, permsRes] = await Promise.all([
                fetch('http://localhost:3001/users/roles', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/users/permissions', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (rolesRes.ok && permsRes.ok) {
                const rs = await rolesRes.json();
                const ps = await permsRes.json();
                setRoles(rs);
                setPermissions(ps);
                if (rs.length > 0) setSelectedRole(rs[0]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = async (permissionId: string) => {
        if (!selectedRole || selectedRole.isSystem) return;

        setUpdating(true);
        const token = localStorage.getItem('token');
        const currentPerms = selectedRole.permissions.map((p: any) => typeof p === 'string' ? p : p._id);

        let newPerms;
        if (currentPerms.includes(permissionId)) {
            newPerms = currentPerms.filter((id: string) => id !== permissionId);
        } else {
            newPerms = [...currentPerms, permissionId];
        }

        try {
            const res = await fetch(`http://localhost:3001/users/roles/${selectedRole._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ permissions: newPerms })
            });

            if (res.ok) {
                const updatedRole = await res.json();
                setRoles(roles.map(r => r._id === updatedRole._id ? updatedRole : r));
                setSelectedRole(updatedRole);
            }
        } catch (err) {
            console.error('Update role error:', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
                    <p className="text-slate-500 font-medium">Control what each user type can see and do.</p>
                </div>
                <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="ml-auto flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Role
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                {/* Roles Side List */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Available Roles</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)
                        ) : roles.map(role => (
                            <button
                                key={role._id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedRole?._id === role._id
                                        ? 'bg-blue-50 border-blue-100 shadow-sm'
                                        : 'bg-white border-transparent hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${selectedRole?._id === role._id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 text-sm">{role.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {role.isSystem ? 'System Assigned' : 'Custom Role'}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions Management */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
                    {selectedRole ? (
                        <>
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-black text-slate-900">{selectedRole.name}</h2>
                                        {selectedRole.isSystem && (
                                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-amber-100">
                                                Locked
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{selectedRole.description || 'Manage granular capabilities for this role.'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                    <Settings size={20} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {permissions.map(perm => {
                                        const isActive = selectedRole.permissions.some((p: any) => (typeof p === 'string' ? p : p._id) === perm._id);
                                        return (
                                            <div
                                                key={perm._id}
                                                className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${isActive ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                                        {isActive ? <Check size={20} /> : <Lock size={18} />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm leading-none mb-1">{perm.name || perm.key}</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{perm.key}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    disabled={selectedRole.isSystem || updating}
                                                    onClick={() => handleTogglePermission(perm._id)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                                                        } disabled:opacity-30 disabled:grayscale`}
                                                >
                                                    {isActive ? 'Disable' : 'Enable'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 text-center">
                            <Key size={60} className="mb-6 opacity-20" />
                            <h3 className="text-xl font-black text-slate-900 opacity-40">Select a Role</h3>
                            <p className="text-slate-500 font-medium max-w-xs mt-2">Choose a role from the left to manage its granular access permissions.</p>
                        </div>
                    )}
                </div>
            </div>

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSuccess={fetchInitialData}
            />
        </div>
    );
}
