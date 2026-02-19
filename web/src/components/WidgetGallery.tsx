
import React from 'react';
import { X, TrendingUp, BarChart3, PieChart, Activity, Users, DollarSign, LayoutGrid } from 'lucide-react';

interface WidgetGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (type: string, component: string, title: string) => void;
    context?: 'dashboard' | 'reports';
}

const DASHBOARD_WIDGETS = [
    { id: 'sales-trend', type: 'chart', component: 'SalesTrend', title: 'Sales Performance', icon: <TrendingUp size={20} />, description: 'Visualizes revenue and lead growth over time.' },
    { id: 'deals-stage', type: 'chart', component: 'DealsByStage', title: 'Pipeline Stages', icon: <BarChart3 size={20} />, description: 'Current value of deals across different pipeline stages.' },
    { id: 'revenue-forecast', type: 'chart', component: 'ForecastedRevenue', title: 'Revenue Forecast', icon: <DollarSign size={20} />, description: 'Projected revenue based on active deals.' },
    { id: 'recent-activities', type: 'list', component: 'RecentActivities', title: 'Recent Activities', icon: <Activity size={20} />, description: 'A live feed of recent interactions and tasks.' },
];

const REPORT_WIDGETS = [
    { id: 'leads-status', type: 'chart', component: 'LeadsByStatus', title: 'Leads by Status', icon: <PieChart size={20} />, description: 'Breakdown of leads by their current lifecycle stage.' },
    { id: 'activity-mix', type: 'chart', component: 'ActivityMix', title: 'Activity Mix', icon: <Activity size={20} />, description: 'Distribution of notes, tasks, and calls.' },
    { id: 'top-agents', type: 'table', component: 'TopPerformers', title: 'Top Performers', icon: <Users size={20} />, description: 'Leaderboard of sales representative performance.' },
    { id: 'deal-distribution', type: 'chart', component: 'DealDistribution', title: 'Deal Distribution', icon: <BarChart3 size={20} />, description: 'Total value split by deal category.' },
];

export default function WidgetGallery({ isOpen, onClose, onAdd, context = 'dashboard' }: WidgetGalleryProps) {
    if (!isOpen) return null;

    const options = context === 'dashboard' ? DASHBOARD_WIDGETS : REPORT_WIDGETS;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md h-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-500">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Widget Gallery</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Add dynamic visuals to your {context}.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {options.map((widget) => (
                        <div
                            key={widget.id}
                            className="group p-5 rounded-[28px] border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer relative"
                            onClick={() => onAdd(widget.type, widget.component, widget.title)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white shadow-sm rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                    {widget.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-slate-900 text-sm italic">{widget.title}</h3>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">{widget.description}</p>
                                </div>
                                <div className="mt-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                                    <LayoutGrid size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        More widgets are periodically added <br /> by the Mathionix Team.
                    </p>
                </div>
            </div>
        </div>
    );
}
