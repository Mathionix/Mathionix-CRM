"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Building2, ChevronLeft, MapPin, Briefcase, Send, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import Timeline from '@/components/Timeline';
import EditModal from '@/components/EditModal';

export default function ContactDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [contact, setContact] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:3001/crm/contacts/${id}`).then(res => res.json()),
            fetch(`http://localhost:3001/crm/activities?relatedTo=${id}`).then(res => res.json())
        ]).then(([contactData, activityData]) => {
            setContact(contactData);
            setActivities(activityData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            setContact({
                firstName: 'Alice', lastName: 'Johnson', email: 'alice@acme.com', phone: '123-444-5555',
                jobTitle: 'Purchasing Manager', organization: { name: 'Acme Corp' },
                createdAt: new Date().toISOString()
            });
            setActivities([]);
        });
    }, [id]);

    const [activityType, setActivityType] = useState('Comment');

    const handlePostActivity = () => {
        if (!newComment.trim()) return;
        const activity = { type: activityType, content: newComment, relatedTo: id, relatedType: 'Contact' };

        fetch('http://localhost:3001/crm/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        }).then(res => res.json()).then(data => {
            setActivities([data, ...activities]);
            setNewComment('');
            setActivityType('Comment');
        });
    };

    if (loading || !contact) return <div className="animate-pulse p-10"><div className="h-64 bg-gray-50 rounded-xl"></div></div>;

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                <ChevronLeft size={16} />
                Back to Contacts
            </button>

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{contact.firstName} {contact.lastName}</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <Briefcase size={16} className="text-gray-400" />
                            {contact.jobTitle} at <span className="text-blue-600 font-semibold">{contact.organization?.name || contact.organization || 'Unknown'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this contact?')) {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`http://localhost:3001/crm/contacts/${id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (res.ok) router.push('/contacts');
                            }
                        }}
                        className="p-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-full transition-all hover:shadow-md"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-3 bg-white border rounded-full text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all hover:shadow-md"
                    >
                        <Edit2 size={20} />
                    </button>
                    <button className="p-3 bg-white border rounded-full text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all hover:shadow-md">
                        <Mail size={20} />
                    </button>
                    <button className="p-3 bg-white border rounded-full text-gray-500 hover:text-green-600 hover:border-green-200 transition-all hover:shadow-md">
                        <MessageCircle size={20} />
                    </button>
                    <EditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        type="Contact"
                        initialData={contact}
                        onSuccess={() => {
                            fetch(`http://localhost:3001/crm/contacts/${id}`)
                                .then(res => res.json())
                                .then(data => setContact(data));
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Activity Feed</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Activity Feed</h3>
                                <div className="flex bg-gray-50 p-1 rounded-md border">
                                    {['Comment', 'Note', 'Call', 'Task'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setActivityType(type)}
                                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activityType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8 relative group">
                                <textarea
                                    className={`w-full border border-gray-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all shadow-inner ${activityType === 'Task' ? 'bg-orange-50 border-orange-100' :
                                        activityType === 'Call' ? 'bg-green-50 border-green-100' : 'bg-gray-50'
                                        }`}
                                    placeholder={
                                        activityType === 'Task' ? 'Log a task...' :
                                            activityType === 'Call' ? 'Call notes...' :
                                                'Update activity...'
                                    }
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    onClick={handlePostActivity}
                                    className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <Timeline activities={activities} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact Details</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-gray-300 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email</p>
                                    <p className="text-sm font-semibold text-gray-700">{contact.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-gray-300 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone</p>
                                    <p className="text-sm font-semibold text-gray-700">{contact.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 size={18} className="text-gray-300 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Organization</p>
                                    <p className="text-sm font-semibold text-gray-700">{contact.organization?.name || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
