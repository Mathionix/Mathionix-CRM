"use client";

import { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, CheckCircle2, AlertCircle, ExternalLink, MessageSquare, Bell, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Integration {
    _id: string;
    name: string;
    module: string;
    config: {
        webhookUrl: string;
    };
    isActive: boolean;
}

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newIntegration, setNewIntegration] = useState({
        module: 'leads',
        webhookUrl: ''
    });

    const fetchIntegrations = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/integrations/teams', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setIntegrations(data);
            }
        } catch (err) {
            console.error('Failed to fetch integrations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/integrations/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    module: newIntegration.module,
                    config: { webhookUrl: newIntegration.webhookUrl }
                })
            });
            if (res.ok) {
                setIsAdding(false);
                setNewIntegration({ module: 'leads', webhookUrl: '' });
                fetchIntegrations();
            }
        } catch (err) {
            console.error('Failed to add integration:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
                        <p className="text-slate-500 mt-2 font-medium">Connect Mathionix CRM with your favorite tools and platforms.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* MS Teams Connector */}
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-20 h-20 bg-[#4B53BC]/10 rounded-[28px] flex items-center justify-center text-[#4B53BC] shadow-inner transform group-hover:scale-110 transition-transform duration-500">
                            <MessageSquare size={40} className="fill-[#4B53BC]/20" />
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Connected</span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Microsoft Teams</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">Broadcast CRM updates, deal closures, and new leads directly to your Teams channels via webhooks.</p>

                    <div className="space-y-4">
                        {integrations.map(integration => (
                            <div key={integration._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:shadow-sm transition-all">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Bell size={14} className="text-slate-400" />
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{integration.module} Channel</span>
                                    </div>
                                    <code className="text-[10px] text-slate-400 font-mono mt-1 block truncate max-w-[200px]">{integration.config.webhookUrl}</code>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {isAdding ? (
                            <form onSubmit={handleAdd} className="p-6 bg-slate-900 rounded-[32px] space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1">Trigger Module</label>
                                    <select
                                        className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-bold text-white outline-none"
                                        value={newIntegration.module}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, module: e.target.value })}
                                    >
                                        <option value="leads">Leads</option>
                                        <option value="deals">Deals</option>
                                        <option value="contacts">Contacts</option>
                                        <option value="all">Global (All Modules)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1">Webhook URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://outlook.office.com/webhook/..."
                                        className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                        value={newIntegration.webhookUrl}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, webhookUrl: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Enable</button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                            >
                                <Plus size={18} />
                                Add Webhook
                            </button>
                        )}
                    </div>
                </div>

                <Link href="/settings/integrations/whatsapp" className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[28px] flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Share2 size={40} />
                        </div>
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Available</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">WhatsApp Business</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Send automated updates and engage with customers directly on WhatsApp.</p>
                    <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                        Configure Integration <ExternalLink size={14} />
                    </div>
                </Link>
            </div>
        </div>
    );
}
