"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Building2, MoreHorizontal } from 'lucide-react';

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

    useEffect(() => {
        fetch('http://localhost:3001/crm/organizations')
            .then(res => res.json())
            .then(data => {
                setOrgs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch orgs', err);
                setLoading(false);
                // Mock data
                setOrgs([
                    { _id: 'o1', name: 'Acme Corp', website: 'acme.com', industry: 'Manufacturing', phone: '123-456', email: 'info@acme.com' },
                    { _id: 'o2', name: 'Globex Inc', website: 'globex.com', industry: 'Technology', phone: '987-654', email: 'hello@globex.com' },
                ]);
            });
    }, []);

    const filteredOrgs = orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
                    <p className="text-sm text-gray-500">{filteredOrgs.length} organizations found</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Org' } }))}
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
                            {filteredOrgs.map(org => (
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
                                            {org.industry}
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
        </div>
    );
}
