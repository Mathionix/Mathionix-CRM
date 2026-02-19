"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mail, Phone, Building2, Calendar, Edit2, ChevronLeft, Send, Trash2, UserCheck, Video } from 'lucide-react';
import Timeline from '@/components/Timeline';
import ClientModal from '@/components/ClientModal';

export default function ClientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [activityType, setActivityType] = useState('Comment');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [meetingAgenda, setMeetingAgenda] = useState('');
    const [meetingTime, setMeetingTime] = useState('');

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [clientRes, activityRes] = await Promise.all([
                fetch(`http://localhost:3001/crm/clients/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`http://localhost:3001/crm/activities?relatedTo=${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (clientRes.ok) setClient(await clientRes.json());
            if (activityRes.ok) setActivities(await activityRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handlePostActivity = async () => {
        if (!newComment.trim() && activityType !== 'Meeting') return;

        const payload = {
            type: activityType,
            content: newComment,
            relatedTo: id,
            relatedType: 'Client'
        };

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setActivities([data, ...activities]);
                setNewComment('');
                setActivityType('Comment');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateMeeting = async () => {
        if (!meetingTime || !meetingAgenda) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'Meeting',
                    content: meetingAgenda,
                    relatedTo: id,
                    relatedType: 'Client',
                    metadata: { scheduledAt: meetingTime }
                })
            });
            if (res.ok) {
                const data = await res.json();
                setActivities([data, ...activities]);
                setMeetingAgenda('');
                setMeetingTime('');
                alert('Meeting scheduled successfully');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !client) return <div className="animate-pulse space-y-6">
        <div className="h-20 bg-gray-100 rounded-[32px]"></div>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-96 bg-gray-50 rounded-[40px]"></div>
            <div className="h-96 bg-gray-50 rounded-[40px]"></div>
        </div>
    </div>;

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest">
                <ChevronLeft size={16} />
                Back to Clients
            </button>

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
                        {client.name?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${client.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                {client.status}
                            </span>
                            <span className="text-slate-300">/</span>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">{client.organization?.name || 'Private Client'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={async () => {
                            if (confirm('Delete this client permanently?')) {
                                const token = localStorage.getItem('token');
                                await fetch(`http://localhost:3001/crm/clients/${id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                router.push('/clients');
                            }
                        }}
                        className="px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-2xl text-sm font-black hover:bg-rose-50 transition-all flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Activity Feed */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Activity Feed</h2>
                            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                {['Comment', 'Note', 'Call', 'Task'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActivityType(type)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activityType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10 group">
                            <div className="relative">
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-[28px] p-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none h-32 shadow-inner placeholder:text-slate-300"
                                    placeholder={`Write a ${activityType.toLowerCase()}...`}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    onClick={handlePostActivity}
                                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>

                        <Timeline activities={activities} />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Information Card */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact Details</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                                    <p className="text-sm font-bold text-slate-900">{client.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                                    <p className="text-sm font-bold text-slate-900">{client.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Organization</p>
                                    <p className="text-sm font-bold text-slate-900">{client.organization?.name || 'Private Client'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Scheduler */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Video className="text-blue-400" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Schedule Meeting</h3>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="datetime-local"
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-white/20"
                                    value={meetingTime}
                                    onChange={e => setMeetingTime(e.target.value)}
                                />
                                <textarea
                                    placeholder="Meeting agenda..."
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white h-24 resize-none placeholder:text-white/20"
                                    value={meetingAgenda}
                                    onChange={e => setMeetingAgenda(e.target.value)}
                                />
                                <button
                                    onClick={handleCreateMeeting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                                >
                                    Book Meeting
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchData}
                client={client}
            />
        </div>
    );
}
