"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';

interface Lead {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    organization: string;
    createdAt: string;
}

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/crm/leads')
            .then(res => res.json())
            .then(data => {
                setLeads(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch leads', err);
                setLoading(false);
                // Fallback mock data
                setLeads([
                    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'New', organization: 'Acme Corp', createdAt: new Date().toISOString() },
                    { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.com', status: 'Ongoing', organization: 'Globex', createdAt: new Date().toISOString() },
                ]);
            });
    }, []);

    const filteredLeads = leads.filter(lead =>
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.organization.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    <p className="text-sm text-gray-500">{filteredLeads.length} leads found</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Lead' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Lead
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 font-medium border-b">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Organization</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td></td>
                                    </tr>
                                ))
                            ) : filteredLeads.map(lead => (
                                <tr
                                    key={lead._id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/leads/${lead._id}`)}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 leading-none">
                                        {lead.firstName} {lead.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                            lead.status === 'Ongoing' ? 'bg-orange-50 text-orange-600' :
                                                'bg-gray-50 text-gray-600'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{lead.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{lead.organization}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                            <MoreHorizontal size={16} />
                                        </button>
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
