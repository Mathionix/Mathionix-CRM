"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, Globe, Mail, Phone, ChevronLeft, MapPin, Briefcase, Send } from 'lucide-react';
import Timeline from '@/components/Timeline';

export default function OrganizationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [org, setOrg] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:3001/crm/organizations/${id}`).then(res => res.json()),
            fetch(`http://localhost:3001/crm/activities?relatedTo=${id}`).then(res => res.json())
        ]).then(([orgData, activityData]) => {
            setOrg(orgData);
            setActivities(activityData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            setOrg({
                name: 'Acme Corp', website: 'acme.com', industry: 'Manufacturing', phone: '123-456-7890',
                email: 'info@acme.com', territory: 'North America', noOfEmployees: '500-1000',
                annualRevenue: 50000000, createdAt: new Date().toISOString()
            });
            setActivities([]);
        });
    }, [id]);

    const [activityType, setActivityType] = useState('Comment');

    const handlePostActivity = () => {
        if (!newComment.trim()) return;
        const activity = { type: activityType, content: newComment, relatedTo: id, relatedType: 'Organization' };

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

    if (loading || !org) return <div className="animate-pulse flex flex-col gap-6"><div className="h-48 bg-gray-100 rounded"></div></div>;

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ChevronLeft size={16} />
                Back to Organizations
            </button>

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-2xl shadow-sm">
                        <Building2 size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{org.name}</h1>
                        <div className="flex items-center gap-3 mt-1 text-gray-500 text-sm">
                            <span className="flex items-center gap-1"><Globe size={14} /> {org.website}</span>
                            <span>&bull;</span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold uppercase">{org.industry}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest text-gray-400">Organization Overview</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Territory</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <MapPin size={16} className="text-gray-300" />
                                    {org.territory}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Employees</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Briefcase size={16} className="text-gray-300" />
                                    {org.noOfEmployees}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Primary Email</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium font-mono text-sm">
                                    {org.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Primary Phone</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    {org.phone}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest text-gray-400">Interaction History</h3>
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
                                    activityType === 'Task' ? 'Log a follow-up task...' :
                                        activityType === 'Call' ? 'Notes from call...' :
                                            'Add an update...'
                                }
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={handlePostActivity}
                                className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <Timeline activities={activities} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-5 shadow-sm text-center py-10 border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 mb-4">No deals currently linked to this organization.</p>
                        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-xs font-bold uppercase hover:bg-gray-200 transition-colors">
                            Link New Deal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
