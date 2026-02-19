"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, User, MoreHorizontal, Mail, Phone, Download, Loader2, Upload } from 'lucide-react';
import ImportModal from '@/components/ImportModal';

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization?: { name: string };
    jobTitle: string;
}

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [search, setSearch] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setContacts(data);
            }
        } catch (err) {
            console.error('Failed to fetch contacts', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/export/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const csvContent = await res.text();
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p className="text-sm text-gray-500">{filteredContacts.length} contacts found</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Export
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Contact' } }))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
                    >
                        <Plus size={18} />
                        Add Contact
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                    <div
                        key={contact._id}
                        className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                        onClick={() => router.push(`/contacts/${contact._id}`)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                {contact.firstName[0]}{contact.lastName[0]}
                            </div>
                            <button className="text-gray-300 hover:text-gray-500">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                {contact.firstName} {contact.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{contact.jobTitle} at {contact.organization?.name || 'Unknown'}</p>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                {contact.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <a href={`tel:${contact.phone}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                    <Phone size={12} />
                                </a>
                                <span className="font-bold">{contact.phone || '-'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={fetchContacts}
                type="contacts"
            />
        </div>
    );
}
