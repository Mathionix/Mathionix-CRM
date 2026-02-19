"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mail, Phone, Building2, Calendar, Edit2, ChevronLeft, Send, Trash2 } from 'lucide-react';
import Timeline from '@/components/Timeline';
import EditModal from '@/components/EditModal';

export default function LeadDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [lead, setLead] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        Promise.all([
            fetch(`http://localhost:3001/crm/leads/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
                if (res.status === 401) window.location.href = '/auth/login';
                return res.json();
            }),
            fetch(`http://localhost:3001/crm/activities?relatedTo=${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ]).then(([leadData, activityData]) => {
            setLead(leadData);
            setActivities(activityData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            // Fallback mock
            setLead({
                firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'New', organization: 'Acme Corp',
                jobTitle: 'Sales Manager', phone: '+1 234 567 890', createdAt: new Date().toISOString()
            });
            setActivities([
                { _id: 'a1', type: 'Comment', content: 'Met at the conference last week.', createdAt: new Date().toISOString(), author: { name: 'Admin' } },
                { _id: 'a2', type: 'Call', content: 'Follow-up call scheduled for Friday.', createdAt: new Date().toISOString(), author: { name: 'Admin' } }
            ]);
        });
    }, [id]);

    const [activityType, setActivityType] = useState('Comment');

    const handlePostActivity = () => {
        if (!newComment.trim()) return;
        const activity = { type: activityType, content: newComment, relatedTo: id, relatedType: 'Lead' };

        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/crm/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(activity)
        }).then(res => res.json()).then(data => {
            setActivities([data, ...activities]);
            setNewComment('');
            setActivityType('Comment');
        });
    };

    if (loading || !lead) return <div className="animate-pulse space-y-6">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-96 bg-gray-100 rounded"></div>
            <div className="h-96 bg-gray-100 rounded"></div>
        </div>
    </div>;

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={16} />
                Back to Leads
            </button>

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-sm">
                        {lead.firstName?.[0]}{lead.lastName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{lead.firstName} {lead.lastName}</h1>
                        <div className="flex items-center gap-3 mt-1 text-gray-500">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{lead.status}</span>
                            <span>&bull;</span>
                            <span className="text-sm font-medium">{lead.jobTitle}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this lead?')) {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`http://localhost:3001/crm/leads/${id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (res.ok) router.push('/leads');
                            }
                        }}
                        className="px-4 py-2 border border-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={async () => {
                            const token = localStorage.getItem('token');
                            const res = await fetch('http://localhost:3001/crm/deals', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({
                                    title: `${lead.firstName} ${lead.lastName}`,
                                    organization: lead.organization,
                                    status: 'Qualification',
                                    probability: 20,
                                    dealValue: lead.annualRevenue || 0,
                                    expectedClosureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                                })
                            });
                            if (res.ok) {
                                const deal = await res.json();
                                router.push(`/deals/${deal._id}`);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Convert to Deal
                    </button>
                    <EditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        type="Lead"
                        initialData={lead}
                        onSuccess={() => {
                            fetch(`http://localhost:3001/crm/leads/${id}`).then(res => res.json()).then(data => setLead(data));
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Mail size={16} className="text-gray-300" />
                                    {lead.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Phone size={16} className="text-gray-300" />
                                    {lead.phone || '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Organization</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Building2 size={16} className="text-gray-300" />
                                    {lead.organization}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Created On</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Calendar size={16} className="text-gray-300" />
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest text-gray-400">
                                Activity Timeline
                            </h3>
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

                        <div className="mb-8 group">
                            <div className="relative">
                                <textarea
                                    className={`w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24 shadow-inner ${activityType === 'Task' ? 'bg-orange-50 border-orange-100' :
                                        activityType === 'Call' ? 'bg-green-50 border-green-100' : 'bg-gray-50'
                                        }`}
                                    placeholder={
                                        activityType === 'Task' ? 'Describe the task to be done...' :
                                            activityType === 'Call' ? 'Log notes from the call...' :
                                                'Post a comment or note...'
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
                            <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                                {activityType === 'Task' && 'This will be tracked as an actionable task.'}
                                {activityType === 'Call' && 'Logging a call interaction.'}
                            </p>
                        </div>

                        <Timeline activities={activities} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Lead Owner</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                AD
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Owner</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-5 shadow-sm bg-gradient-to-br from-blue-50 to-white border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-4 text-sm uppercase tracking-wider">Next Action</h3>
                        <p className="text-sm text-blue-700 font-medium">Schedule a follow-up demo for next Tuesday afternoon.</p>
                        <button className="mt-4 w-full bg-white border border-blue-200 text-blue-600 py-2 rounded-md text-xs font-bold uppercase transition-hover hover:scale-105 shadow-sm">
                            Mark Completed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
