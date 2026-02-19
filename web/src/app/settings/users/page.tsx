"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Search, Mail, Shield, MoreHorizontal, Edit2, Trash2, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import UserModal from '@/components/UserModal';
import InviteModal from '@/components/InviteModal';

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) window.location.href = '/auth/login';
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error('Delete user error:', err);
        }
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // This function is needed for the "Add User" button, assuming it opens the UserModal for a new user
    const handleAddUser = () => {
        setSelectedUser(null); // Clear selected user for adding a new one
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage your team members and their roles.</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-5 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-indigo-500/5 border border-indigo-100/50"
                    >
                        <UserPlus size={18} />
                        Invite Member
                    </button>
                    <button
                        onClick={handleAddUser}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-lg w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-lg w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded-lg w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Loader2 size={48} className="opacity-20 animate-spin" />
                                            <p className="font-bold">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-indigo-400" />
                                            {user.roleId?.name || user.role || 'User'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all pr-4">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-2 hover:bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2 hover:bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 hover:text-red-600 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
                user={selectedUser}
            />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    );
}
