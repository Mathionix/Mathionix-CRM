
import React, { useState } from 'react';
import {
    FileText,
    CheckCircle,
    PhoneCall,
    Send,
    X,
    Calendar,
    Clock,
    AlertCircle,
    Save
} from 'lucide-react';

interface ActivityLoggerProps {
    onSave: (data: any) => Promise<void>;
    relatedTo?: string;
    relatedType?: string;
    fixedType?: 'Note' | 'Task' | 'Call';
}

export default function ActivityLogger({ onSave, relatedTo, relatedType, fixedType }: ActivityLoggerProps) {
    const [activeTab, setActiveTab] = useState<'Note' | 'Task' | 'Call'>(fixedType || 'Note');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    // Metadata states
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [callType, setCallType] = useState('Outbound');
    const [duration, setDuration] = useState('5');
    const [callStatus, setCallStatus] = useState('Completed');

    const handleSave = async () => {
        if (!content && !title) return;
        setLoading(true);

        const payload: any = {
            type: activeTab,
            title: title || `${activeTab} on ${new Date().toLocaleDateString()}`,
            content,
            relatedTo,
            relatedType,
            metadata: {}
        };

        if (activeTab === 'Task') {
            payload.metadata = { priority, dueDate, status: 'Pending' };
        } else if (activeTab === 'Call') {
            payload.metadata = { type: callType, duration: parseInt(duration) * 60, status: callStatus };
        }

        try {
            await onSave(payload);
            setContent('');
            setTitle('');
        } catch (err) {
            console.error('Failed to save activity', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            {!fixedType && (
                <div className="flex border-b border-slate-50 bg-slate-50/30">
                    {[
                        { id: 'Note', icon: <FileText size={16} />, label: 'Log Note' },
                        { id: 'Task', icon: <CheckCircle size={16} />, label: 'Create Task' },
                        { id: 'Call', icon: <PhoneCall size={16} />, label: 'Log Call' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'text-blue-600 bg-white border-x border-slate-50'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-8 space-y-6">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder={activeTab === 'Note' ? "Note Title..." : activeTab === 'Task' ? "Task Title..." : "Call Subject..."}
                        className="w-full text-xl font-black text-slate-900 border-none outline-none placeholder:text-slate-200 italic"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full h-32 border-none outline-none text-slate-600 font-medium leading-relaxed resize-none placeholder:text-slate-300"
                        placeholder={
                            activeTab === 'Note' ? "Start typing your notes here..." :
                                activeTab === 'Task' ? "What needs to be done?" :
                                    "Key takeaways from the call..."
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50">
                    {activeTab === 'Task' && (
                        <>
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <AlertCircle size={14} className="text-slate-400 ml-2" />
                                <select
                                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-600 pr-2"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <Calendar size={14} className="text-slate-400 ml-2" />
                                <input
                                    type="date"
                                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-600 pr-2"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'Call' && (
                        <>
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <PhoneCall size={14} className="text-slate-400 ml-2" />
                                <select
                                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-600 pr-2"
                                    value={callType}
                                    onChange={(e) => setCallType(e.target.value)}
                                >
                                    <option>Outbound</option>
                                    <option>Inbound</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <Clock size={14} className="text-slate-400 ml-2" />
                                <select
                                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-600 pr-2"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="1">1 Min</option>
                                    <option value="5">5 Mins</option>
                                    <option value="15">15 Mins</option>
                                    <option value="30">30 Mins</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex-1" />

                    <button
                        onClick={handleSave}
                        disabled={loading || (!content && !title)}
                        className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={16} />
                                {activeTab === 'Note' ? 'Post Note' : activeTab === 'Task' ? 'Schedule' : 'Log History'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
