"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Building2, MoreHorizontal } from 'lucide-react';
import QuickAddModal from '@/components/QuickAddModal';

interface Organization {
    _id: string;
    name: string;
    website: string;
    industry: string;
    phone: string;
    email: string;
}

export default function OrganizationsPage() {
    const router = useRouter();
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/crm/organizations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async res => {
                if (res.status === 401) {
                    window.location.href = '/auth/login';
                    return null;
                }
                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .then(data => {
                if (data) {
                    // Handle both array and paginated response
                    const orgList = Array.isArray(data) ? data : (data.data || []);
                    setOrgs(orgList);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch orgs', err);
                setOrgs([]);
                setLoading(false);
            });
    }, []);

    const filteredOrgs = Array.isArray(orgs) ? orgs.filter(o => o?.name?.toLowerCase().includes(search.toLowerCase())) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
                    <p className="text-sm text-gray-500">{filteredOrgs.length} organizations found</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Organization
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-3 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Website</th>
                                <th className="px-6 py-3">Industry</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading organizations...</td>
                                </tr>
                            ) : filteredOrgs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No organizations found</td>
                                </tr>
                            ) : filteredOrgs.map(org => (
                                <tr
                                    key={org._id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors group"
                                    onClick={() => router.push(`/organizations/${org._id}`)}
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Building2 size={16} />
                                        </div>
                                        <span className="font-medium text-gray-900">{org.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{org.website || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
                                            {org.industry || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{org.phone || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <MoreHorizontal size={16} className="text-gray-300 group-hover:text-gray-500" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab="Org" />
        </div>
    );
}
