
import React from 'react';
import {
    FileText,
    CheckCircle,
    PhoneCall,
    Clock,
    MoreHorizontal,
    Trash2,
    Edit2,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';

interface Activity {
    _id: string;
    type: string;
    content: string;
    title?: string;
    createdAt: string;
    metadata?: any;
    author?: { name: string };
}

interface ActivityTimelineProps {
    activities: Activity[];
    loading: boolean;
    onDelete?: (id: string) => void;
    onEdit?: (activity: Activity) => void;
}

export default function ActivityTimeline({ activities, loading, onDelete, onEdit }: ActivityTimelineProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-50 h-32 rounded-[32px] border border-slate-100" />
                ))}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Clock size={40} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 italic">No Activity Recorded</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">Start a conversation or log a task to build your timeline.</p>
                </div>
            </div>
        );
    }

    // Group by date
    const groups: { [key: string]: Activity[] } = {};
    activities.forEach(activity => {
        const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(activity);
    });

    const getIcon = (type: string, metadata: any) => {
        switch (type) {
            case 'Note': return <FileText size={18} className="text-blue-500" />;
            case 'Task': return <CheckCircle size={18} className={metadata?.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'} />;
            case 'Call': return <PhoneCall size={18} className="text-rose-500" />;
            default: return <Clock size={18} className="text-slate-400" />;
        }
    };

    const getBg = (type: string) => {
        switch (type) {
            case 'Note': return 'bg-blue-50';
            case 'Task': return 'bg-amber-50';
            case 'Call': return 'bg-rose-50';
            default: return 'bg-slate-50';
        }
    };

    return (
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-6 before:w-px before:bg-slate-100 before:z-0">
            {Object.keys(groups).map((date) => (
                <div key={date} className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Calendar size={18} />
                        </div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{date}</h3>
                    </div>

                    <div className="space-y-4 ml-6 pl-10 border-l border-transparent">
                        {groups[date].map((activity) => (
                            <div key={activity._id} className="group relative bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-sm z-20 group-hover:scale-125 transition-transform">
                                    <div className={`w-3 h-3 rounded-full ${activity.type === 'Note' ? 'bg-blue-500' : activity.type === 'Task' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${getBg(activity.type)} rounded-xl flex items-center justify-center`}>
                                            {getIcon(activity.type, activity.metadata)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 italic tracking-tight">{activity.title || activity.type}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.type} • {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit?.(activity)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => onDelete?.(activity._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
                                    {activity.content}
                                </div>

                                {activity.type === 'Call' && activity.metadata && (
                                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            {activity.metadata.type === 'Inbound' ? <ArrowDownLeft size={14} className="text-emerald-500" /> : <ArrowUpRight size={14} className="text-blue-500" />}
                                            {activity.metadata.type || 'Outbound'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            <Clock size={14} />
                                            {Math.floor((activity.metadata.duration || 0) / 60)}m {(activity.metadata.duration || 0) % 60}s
                                        </div>
                                        <div className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-400 rounded-full border border-slate-100 uppercase tracking-widest">
                                            {activity.metadata.status || 'Completed'}
                                        </div>
                                    </div>
                                )}

                                {activity.type === 'Task' && activity.metadata && (
                                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-50">
                                        <div className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${activity.metadata.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {activity.metadata.status || 'Pending'}
                                        </div>
                                        {activity.metadata.priority && (
                                            <div className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-400 rounded-full border border-slate-100 uppercase tracking-widest italic">
                                                Priority: {activity.metadata.priority}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black italic text-blue-500 uppercase tracking-wider">
                                    Logged by {activity.author?.name || 'Administrator'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
