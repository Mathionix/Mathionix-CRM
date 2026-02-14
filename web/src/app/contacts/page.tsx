"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, User, MoreHorizontal, Mail, Phone } from 'lucide-react';

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
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/crm/contacts')
            .then(res => res.json())
            .then(data => {
                setContacts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch contacts', err);
                setLoading(false);
                // Mock data
                setContacts([
                    { _id: 'c1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@acme.com', phone: '123-444', jobTitle: 'Purchasing Manager', organization: { name: 'Acme Corp' } },
                    { _id: 'c2', firstName: 'Bob', lastName: 'Smith', email: 'bob@globex.com', phone: '987-222', jobTitle: 'CTO', organization: { name: 'Globex Inc' } },
                ]);
            });
    }, []);

    const filteredContacts = contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p className="text-sm text-gray-500">{filteredContacts.length} contacts found</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Contact' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Contact
                </button>
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
                                <Phone size={14} className="text-gray-400" />
                                {contact.phone || '-'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
