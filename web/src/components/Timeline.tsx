"use client";

import { MessageSquare, FileText, Phone, Calendar, User } from 'lucide-react';

interface Activity {
    _id: string;
    type: 'Comment' | 'Note' | 'Call' | 'Event';
    content: string;
    createdAt: string;
    author?: { name: string };
}

export default function Timeline({ activities }: { activities: Activity[] }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'Comment': return <MessageSquare size={14} className="text-blue-500" />;
            case 'Note': return <FileText size={14} className="text-orange-500" />;
            case 'Call': return <Phone size={14} className="text-green-500" />;
            case 'Task': return <Calendar size={14} className="text-red-500" />;
            case 'Event': return <Calendar size={14} className="text-purple-500" />;
            default: return <MessageSquare size={14} />;
        }
    };

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {activities.map((activity) => (
                <div key={activity._id} className="relative flex items-start group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border shadow-sm z-10 group-hover:scale-110 transition-transform">
                        {getIcon(activity.type)}
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="bg-white p-4 rounded-lg border shadow-sm group-hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <User size={14} className="text-gray-400" />
                                    {activity.author?.name || 'System'}
                                </div>
                                <time className="text-xs text-gray-400">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </time>
                            </div>
                            <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                                {activity.content}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {activities.length === 0 && (
                <div className="text-center py-12 text-gray-400 italic">
                    No activity recorded yet.
                </div>
            )}
        </div>
    );
}
