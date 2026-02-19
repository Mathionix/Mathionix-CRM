"use client";

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, Activity as ActivityIcon, ArrowUpRight, ArrowDownRight, PieChart, Target, Calendar } from 'lucide-react';

export default function ReportsPage() {
    const [dealStats, setDealStats] = useState<any[]>([]);
    const [leadStats, setLeadStats] = useState<any>(null);
    const [activityStats, setActivityStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [dealsRes, leadsRes, activitiesRes] = await Promise.all([
                fetch('http://localhost:3001/crm/reports/deals', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/crm/reports/leads', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/crm/reports/activities', { headers: { 'Authorization': `Bearer ${token}` } }),
            ]);

            if (dealsRes.ok) setDealStats(await dealsRes.json());
            if (leadsRes.ok) setLeadStats(await leadsRes.json());
            if (activitiesRes.ok) setActivityStats(await activitiesRes.json());
        } catch (err) {
            console.error('Failed to fetch report data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalDealValue = dealStats.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time performance metrics and business intelligence.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                        <Calendar size={14} className="text-blue-500" />
                        Last 30 Days
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    title="Total Pipeline"
                    value={`$${(totalDealValue / 1000).toFixed(1)}k`}
                    icon={<Briefcase className="text-blue-600" />}
                    trend="+12.5%"
                    trendUp={true}
                    color="blue"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${leadStats?.rate?.toFixed(1) || 0}%`}
                    icon={<Target className="text-emerald-600" />}
                    trend="+3.2%"
                    trendUp={true}
                    color="emerald"
                />
                <MetricCard
                    title="Active Leads"
                    value={leadStats?.total || 0}
                    icon={<Users className="text-indigo-600" />}
                    trend="-2.1%"
                    trendUp={false}
                    color="indigo"
                />
                <MetricCard
                    title="Activities"
                    value={activityStats.reduce((acc, curr) => acc + curr.count, 0)}
                    icon={<ActivityIcon className="text-amber-600" />}
                    trend="+5.4%"
                    trendUp={true}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Deal Distribution by Stage */}
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Deal Distribution</h2>
                        <PieChart size={20} className="text-slate-300" />
                    </div>
                    <div className="space-y-6">
                        {dealStats.map((stat, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat._id}</span>
                                    <span className="text-sm font-black text-slate-900">${(stat.totalValue || 0).toLocaleString()}</span>
                                </div>
                                <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                                        style={{ width: `${(stat.totalValue / totalDealValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {dealStats.length === 0 && (
                            <div className="py-20 text-center text-slate-300 italic font-medium">No deal data available</div>
                        )}
                    </div>
                </div>

                {/* Activity Breakdown */}
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-black uppercase tracking-tight text-blue-400">Activity Mix</h2>
                            <BarChart3 size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1 flex items-end justify-around gap-4 pb-4">
                            {activityStats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 w-full">
                                    <div className="text-[10px] font-black text-slate-400 rotate-[-45deg] mb-2 uppercase tracking-tighter">{stat._id}</div>
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl transition-all duration-1000 ease-out hover:brightness-125 cursor-pointer"
                                        style={{ height: `${(stat.count / Math.max(...activityStats.map(s => s.count))) * 120}px` }}
                                    />
                                    <div className="text-xs font-black text-white">{stat.count}</div>
                                </div>
                            ))}
                            {activityStats.length === 0 && (
                                <div className="w-full py-20 text-center text-slate-600 italic font-medium">No activity log found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
