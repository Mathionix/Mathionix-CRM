"use client";

import { useState, useEffect } from 'react';
import { Key, Plus, ChevronLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import PermissionModal from '@/components/PermissionModal';

export default function PermissionsManagementPage() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/users/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPermissions(data);
            }
        } catch (error) {
            console.error('Fetch permissions error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPermission = () => {
        setIsModalOpen(true);
    };

    const groupedPermissions = permissions.reduce((acc: any, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {});

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage granular access control tokens.</p>
                </div>
                <button
                    onClick={handleAddPermission}
                    className="ml-auto flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Permission
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search permissions..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="space-y-8 animate-pulse">
                            {[1, 2].map(i => (
                                <div key={i}>
                                    <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map(j => (
                                            <div key={j} className="h-10 bg-gray-50 rounded-xl"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : Object.keys(groupedPermissions).length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
                            <Key size={48} className="opacity-20" />
                            <p className="font-bold">No permissions found</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedPermissions).map(([module, perms]: [string, any]) => (
                                <div key={module}>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        {module}
                                        <div className="h-px bg-slate-100 flex-1" />
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {perms.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p: any) => (
                                            <div key={p._id} className="group flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:border-purple-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{p.description || 'No description.'}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Actions can go here if needed */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800">
                <div className="p-1">
                    <Filter size={18} />
                </div>
                <div className="text-sm">
                    <p className="font-bold">Developer Notice</p>
                    <p className="mt-0.5 opacity-80 leading-relaxed font-medium">Permissions are hardcoded tokens used in the <code className="bg-amber-100 px-1 rounded">RBACGuard</code>. Creating new ones here will not automatically enforce logic until corresponding middleware is added in the backend.</p>
                </div>
            </div>

            <PermissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPermissions}
            />
        </div>
    );
}
