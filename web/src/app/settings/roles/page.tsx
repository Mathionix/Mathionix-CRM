"use client";

import { useState, useEffect } from 'react';
import { Shield, Plus, ChevronLeft, Search, Filter, MoreHorizontal, Edit2, Trash2, Key } from 'lucide-react';
import Link from 'next/link';
import RoleModal from '@/components/RoleModal';

export default function RolesManagementPage() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [showAllPermissions, setShowAllPermissions] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchRoles();
    }, []);

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
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (id: string) => {
        if (!confirm('Are you sure you want to delete this role? This might affect users assigned to it.')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users/roles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchRoles();
        } catch (err) {
            console.error('Delete role error:', err);
        }
    };

    const handleAddRole = () => {
        setSelectedRole(null);
        setIsModalOpen(true);
    };

    const handleEditRole = (role: any) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const toggleShowAllPermissions = (roleId: string) => {
        setShowAllPermissions(prev => ({
            ...prev,
            [roleId]: !prev[roleId]
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
                    <p className="text-sm text-gray-500 font-medium">Define and manage permission groups.</p>
                </div>
                <button
                    onClick={handleAddRole}
                    className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-white border border-slate-100 p-6 rounded-[24px]">
                            <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                        </div>
                    ))
                ) : roles.map((role) => (
                    <div key={role._id} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Shield size={20} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!role.isSystem && (
                                    <>
                                        <button
                                            onClick={() => handleEditRole(role)}
                                            className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRole(role._id)}
                                            className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{role.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-6 leading-relaxed line-clamp-2">{role.description || 'No description provided.'}</p>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Key size={12} className="text-indigo-400" />
                            {role.permissions?.length || 0} Permissions
                        </div>

                        {role.isSystem && (
                            <div className="mt-4 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest inline-block">
                                System Role
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRoles}
                role={selectedRole}
            />
        </div>
    );
}
