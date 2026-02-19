"use client";

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase,
    Activity as ActivityIcon,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Target,
    Calendar,
    X,
    Settings2,
    Plus,
    RotateCcw,
    Save,
    Sparkles
} from 'lucide-react';
import WidgetGallery from '../../components/WidgetGallery';

export default function ReportsPage() {
    const [dealStats, setDealStats] = useState<any[]>([]);
    const [leadStats, setLeadStats] = useState<any>(null);
    const [activityStats, setActivityStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeReports, setActiveReports] = useState<string[]>(['Deals', 'Activities', 'Conversion', 'Pipeline']);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [dealsRes, leadsRes, activitiesRes, configRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/crm/dashboard?days=30`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/crm/leads`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/crm/activities?limit=50`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/users/config`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const [deals, leads, activities, config] = await Promise.all([
                dealsRes.json(),
                leadsRes.json(),
                activitiesRes.json(),
                configRes.json()
            ]);

            setDealStats(deals.dealDistribution || []);
            setLeadStats(leads.data || []);

            // Group activities for the bar chart
            const groups = (Array.isArray(activities) ? activities : (activities.data || [])).reduce((acc: any, curr: any) => {
                acc[curr.type] = (acc[curr.type] || 0) + 1;
                return acc;
            }, {});
            setActivityStats(Object.keys(groups).map(k => ({ _id: k, count: groups[k] })));

            if (config && config.reportLayout && config.reportLayout.length > 0) {
                setActiveReports(config.reportLayout.map((c: any) => c.title));
            }
        } catch (err) {
            console.error('Fetch reports data error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSaveLayout = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/users/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reportLayout: activeReports.map(c => ({
                        id: c.split(' ').join('-').toLowerCase(),
                        component: c,
                        title: c,
                        isVisible: true
                    }))
                })
            });
            setIsEditMode(false);
        } catch (err) {
            console.error('Save report layout error:', err);
        }
    };

    const totalDealValue = dealStats.reduce((sum, s) => sum + (s.totalValue || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
                        BI Intelligence <Sparkles className="text-blue-500" size={24} />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic opacity-70 tracking-tight">Advanced analytical surfaces for revenue operations.</p>
                </div>

                <div className="flex items-center gap-3">
                    {isEditMode ? (
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
                            <button onClick={() => setIsGalleryOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-black text-blue-600 hover:bg-blue-50 rounded-lg transition-colors italic">
                                <Plus size={14} /> Add View
                            </button>
                            <button onClick={() => setActiveReports(['Deals', 'Activities', 'Conversion', 'Pipeline'])} className="flex items-center gap-2 px-3 py-1.5 text-xs font-black text-slate-400 hover:bg-slate-50 rounded-lg transition-colors italic">
                                <RotateCcw size={14} /> Reset
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <button onClick={() => setIsEditMode(false)} className="px-3 py-1.5 text-xs font-bold text-slate-400">Cancel</button>
                            <button onClick={handleSaveLayout} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 uppercase tracking-widest italic">
                                <Save size={14} /> Save Layout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm italic uppercase tracking-widest">
                            <Settings2 size={14} /> Customize BI
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-50 rounded-[32px] border border-slate-100" />)}
                </div>
            ) : (
                <>
                    {/* Top Stats MetricCards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard title="Gross Pipeline" value={`$${(totalDealValue / 1000).toFixed(1)}k`} icon={<Briefcase size={20} />} trend="+12.4%" trendUp={true} color="blue" />
                        <MetricCard title="Lead Velocity" value={leadStats?.length || 0} icon={<Users size={20} />} trend="+8.2%" trendUp={true} color="emerald" />
                        <MetricCard title="Win Ratio" value="64%" icon={<Target size={20} />} trend="-2.1%" trendUp={false} color="indigo" />
                        <MetricCard title="Active Cycle" value="18 Days" icon={<Calendar size={20} />} trend="+1.5%" trendUp={true} color="amber" />
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Deal Distribution (Preferred Aesthetic) */}
                        {activeReports.includes('Deals') && (
                            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <PieChart size={120} />
                                </div>
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">Deal Distribution</h2>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Volume by category</p>
                                    </div>
                                    <TrendingUp size={24} className="text-blue-500" />
                                </div>
                                {isEditMode && (
                                    <button onClick={() => setActiveReports(prev => prev.filter(r => r !== 'Deals'))} className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 shadow-lg z-20">
                                        <X size={14} />
                                    </button>
                                )}
                                <div className="space-y-6">
                                    {dealStats.map((stat, i) => (
                                        <div key={i} className="group/item">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat._id}</span>
                                                <span className="text-sm font-black text-slate-900">${(stat.totalValue || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out group-hover/item:brightness-110"
                                                    style={{ width: `${totalDealValue > 0 ? (stat.totalValue / totalDealValue) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {dealStats.length === 0 && <div className="py-20 text-center text-slate-300 italic">No deal data.</div>}
                                </div>
                            </div>
                        )}

                        {/* Activity Mix (Preferred Aesthetic) */}
                        {activeReports.includes('Activities') && (
                            <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-2xl font-black italic tracking-tight text-blue-400">Activity Mix</h2>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Cross-module telemetry</p>
                                        </div>
                                        <BarChart3 size={24} className="text-slate-600" />
                                    </div>
                                    {isEditMode && (
                                        <button onClick={() => setActiveReports(prev => prev.filter(r => r !== 'Activities'))} className="absolute top-4 right-4 p-2 bg-slate-800 border border-slate-700 rounded-full text-slate-500 hover:text-rose-400 shadow-lg z-20">
                                            <X size={14} />
                                        </button>
                                    )}
                                    <div className="flex-1 flex items-end justify-around gap-4 pb-4">
                                        {activityStats.map((stat, i) => (
                                            <div key={i} className="flex flex-col items-center gap-4 w-full">
                                                <div className="text-[10px] font-black text-slate-400 rotate-[-45deg] mb-2 uppercase tracking-tighter">{stat._id}</div>
                                                <div
                                                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl transition-all duration-1000 ease-out hover:brightness-125 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                                    style={{ height: `${activityStats.length > 0 ? (stat.count / Math.max(...activityStats.map(s => s.count))) * 120 : 0}px` }}
                                                />
                                                <div className="text-xs font-black text-white">{stat.count}</div>
                                            </div>
                                        ))}
                                        {activityStats.length === 0 && <div className="w-full py-20 text-center text-slate-600 italic">No metrics.</div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <WidgetGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onAdd={(type, component, title) => {
                    if (!activeReports.includes(title)) setActiveReports([...activeReports, title]);
                    setIsGalleryOpen(false);
                }}
                context="reports"
            />
        </div>
    );
}

function MetricCard({ title, value, icon, trend, trendUp, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${trendUp ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-widest`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    );
}
