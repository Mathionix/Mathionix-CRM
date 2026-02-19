"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building2, ExternalLink, Loader2, Edit2, Trash2 } from 'lucide-react';
import ClientModal from '@/components/ClientModal';

interface Client {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    organization?: {
        name: string;
    };
}

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const fetchClients = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${baseUrl}/crm/clients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = () => {
        setSelectedClient(null);
        setIsModalOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/crm/clients/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchClients();
        } catch (err) {
            console.error('Delete client error:', err);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.organization?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight underline decoration-blue-500/30 decoration-8 underline-offset-4">Clients</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your end-customers and their portal access.</p>
                </div>
                <div>
                    <button
                        onClick={handleAddClient}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[24px] flex items-center gap-3 font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Plus size={20} />
                        New Client
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50/30">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="pl-14 pr-6 py-4.5 w-full bg-white border-none rounded-[22px] shadow-sm text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Organization</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10 bg-white" />
                                    </tr>
                                ))
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <UserCheck size={40} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No clients found</h3>
                                        <p className="text-slate-500 font-medium">Start by adding your first end-customer.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map(client => (
                                    <tr
                                        key={client._id}
                                        className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                        onClick={() => router.push(`/clients/${client._id}`)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform shadow-inner">
                                                    {client.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{client.name}</p>
                                                    <p className="text-xs font-medium text-slate-400 block md:hidden">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${client.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                client.status === 'inactive' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                <Building2 size={16} className="text-slate-300" />
                                                {client.organization?.name || 'Private Client'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Mail size={12} className="text-slate-300" />
                                                    {client.email}
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <a href={`tel:${client.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                            <Phone size={14} />
                                                        </a>
                                                        <p className="text-sm font-bold text-slate-900">{client.phone || '-'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleEditClient(client)}
                                                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl transition-all hover:shadow-sm"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClient(client._id)}
                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-2xl transition-all hover:shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchClients}
                client={selectedClient}
            />
        </div>
    );
}
