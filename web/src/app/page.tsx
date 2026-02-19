"use client";

import { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Edit3,
  Save,
  X,
  RotateCcw,
  LayoutGrid,
  Activity,
  Tally5
} from 'lucide-react';
import SalesTrendChart from '../components/SalesTrendChart';
import ForecastedRevenueChart from '../components/ForecastedRevenueChart';
import DealsByStageChart from '../components/DealsByStageChart';
import WidgetGallery from '../components/WidgetGallery';

interface DashboardStat {
  name: string;
  value: number | string;
  delta: number;
  deltaSuffix: string;
  title: string;
}

interface DashboardData {
  stats: DashboardStat[];
  funnel: any[];
  charts?: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({ stats: [], funnel: [] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [userFilter, setUserFilter] = useState('All');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCharts, setActiveCharts] = useState<string[]>(['Trend', 'Forecast', 'Stage']);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);

  const addChart = (type: string, component: string, title: string) => {
    // Component name is used to identify the chart type
    const chartTag = component.replace('Chart', '');
    if (!activeCharts.includes(chartTag)) {
      setActiveCharts([...activeCharts, chartTag]);
    }
    setIsGalleryOpen(false);
  };

  const removeChart = (type: string) => {
    setActiveCharts(activeCharts.filter(c => c !== type));
  };

  const fetchDashboard = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // Fetch both dashboard data and user config
    Promise.all([
      fetch(`http://localhost:3001/crm/dashboard?days=${period}&owner=${userFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`http://localhost:3001/users/config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ]).then(([result, configResult]) => {
      if (result) setData(result);
      if (configResult && configResult.dashboardLayout) {
        setConfig(configResult);
        // Map backend dashboardLayout back to the simplistic activeCharts string array for now
        // to maintain compatibility with existing render logic
        if (configResult.dashboardLayout) {
          setActiveCharts(configResult.dashboardLayout.map((w: any) => w.component?.replace('Chart', '') || w.id));
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error('Fetch dashboard error:', err);
      // Fallback data...
      setLoading(false);
      setData({
        stats: [
          { name: 'total_leads', value: 124, delta: 12, deltaSuffix: '%', title: 'Total Leads' },
          { name: 'total_revenue', value: '$42,500', delta: 8, deltaSuffix: '%', title: 'Forecasted Revenue' },
          { name: 'conversion_rate', value: 64.2, delta: 5, deltaSuffix: '%', title: 'Lead Conversion' },
          { name: 'active_deals', value: 38, delta: -2, deltaSuffix: '%', title: 'Active Deals' }
        ],
        funnel: [
          { label: 'Leads', val: 124, w: 'full' },
          { label: 'Proposals', val: 82, w: 'w-4/5' },
          { label: 'Negotiations', val: 45, w: 'w-2/3' },
          { label: 'Won', val: 28, w: 'w-1/2' }
        ],
        charts: {
          salesTrend: [
            { name: 'Week 1', revenue: 4000, leads: 24 },
            { name: 'Week 2', revenue: 3000, leads: 18 },
            { name: 'Week 3', revenue: 2000, leads: 29 },
            { name: 'Week 4', revenue: 2780, leads: 15 }
          ],
          revenueForecast: [
            { name: 'Mar', value: 4000 },
            { name: 'Apr', value: 3000 },
            { name: 'May', value: 2000 }
          ],
          dealsByStage: [
            { name: 'Qualification', value: 400 },
            { name: 'Proposal', value: 300 },
            { name: 'Negotiation', value: 200 }
          ]
        }
      });
    });
  };

  useEffect(() => {
    fetchDashboard();
  }, [period, userFilter]);

  const handleSaveLayout = async () => {
    setIsEditMode(false);
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3001/users/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dashboardLayout: activeCharts.map(c => ({
            id: c.split(' ').join('-').toLowerCase(),
            component: c.includes('Chart') ? c : `${c}Chart`,
            isVisible: true
          }))
        })
      });
    } catch (err) {
      console.error('Save layout error:', err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <WidgetGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onAdd={addChart}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Analytics Studio</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic opacity-70 tracking-tight">Tailor your intelligence view with dynamic sales widgets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isEditMode ? (
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200 relative">
              <button onClick={() => setIsGalleryOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors italic">
                <Plus size={14} /> Add Visual
              </button>

              <button onClick={() => setActiveCharts(['Trend', 'Forecast', 'Stage'])} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors italic">
                <RotateCcw size={14} /> Reset
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button onClick={() => setIsEditMode(false)} className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveLayout} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                <Save size={14} /> Save Layout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <select
                className="bg-white border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 shadow-sm hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="15">Last 15 days</option>
                <option value="30">Last 30 days</option>
                <option value="75">Last 75 days</option>
                <option value="100">Last 100 days</option>
              </select>

              <button
                onClick={() => setIsEditMode(true)}
                className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                title="Edit Layout"
              >
                <Edit3 size={18} />
              </button>

              <button
                onClick={fetchDashboard}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                title="Refresh Analytics"
              >
                <TrendingUp size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats?.length > 0 ? (
          data.stats.map((stat, idx) => (
            <div key={stat.name} className="group relative bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${idx % 4 === 0 ? 'from-blue-50 to-indigo-50 text-blue-600' :
                  idx % 4 === 1 ? 'from-amber-50 to-orange-50 text-amber-600' :
                    idx % 4 === 2 ? 'from-emerald-50 to-teal-50 text-emerald-600' :
                      'from-purple-50 to-pink-50 text-purple-600'
                  }`}>
                  <LayoutGrid size={20} />
                </div>
                {stat.delta !== 0 && (
                  <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${stat.delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {stat.delta >= 0 ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                    {Math.abs(stat.delta)}{stat.deltaSuffix}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-900 tabular-nums">
                {stat.name === 'conversion_rate' ? `${stat.value}%` : stat.value}
              </h3>
              <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className={`h-full opacity-60 rounded-full transition-all duration-1000 ${stat.delta >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} style={{ width: '70%' }} />
              </div>

              {isEditMode && (
                <div className="absolute -top-2 -right-2 p-1 bg-white border border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-rose-50 hover:text-rose-500 transition-colors" onClick={() => { }}>
                  <X size={12} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-10 text-slate-400">No stats data available</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeCharts.includes('Trend') && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col min-h-[450px] relative group">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Sales Performance Trend</h3>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Real-time revenue & lead flow</p>
                </div>
              </div>
              <div className="flex-1">
                <SalesTrendChart data={(data as any).charts?.salesTrend} />
              </div>
              {isEditMode && (
                <button onClick={() => removeChart('Trend')} className="absolute -top-3 -right-3 p-2 bg-white border-2 border-slate-100 rounded-full text-slate-400 hover:text-rose-500 shadow-xl transition-all">
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeCharts.includes('Forecast') && (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[350px] relative group">
                <h3 className="font-black text-slate-900 text-lg mb-6">Forecasted Revenue</h3>
                <div className="h-[250px]">
                  <ForecastedRevenueChart data={(data as any).charts?.revenueForecast} />
                </div>
                {isEditMode && (
                  <button onClick={() => removeChart('Forecast')} className="absolute -top-3 -right-3 p-2 bg-white border-2 border-slate-100 rounded-full text-slate-400 hover:text-rose-500 shadow-xl transition-all">
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            {activeCharts.includes('Stage') && (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[350px] relative group">
                <h3 className="font-black text-slate-900 text-lg mb-6">Deals by Stage</h3>
                <div className="h-[250px]">
                  <DealsByStageChart data={(data as any).charts?.dealsByStage} />
                </div>
                {isEditMode && (
                  <button onClick={() => removeChart('Stage')} className="absolute -top-3 -right-3 p-2 bg-white border-2 border-slate-100 rounded-full text-slate-400 hover:text-rose-500 shadow-xl transition-all">
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {activeCharts.filter(c => !['Trend', 'Forecast', 'Stage'].includes(c)).map((chartType, idx) => (
              chartType === 'Spacer' ? (
                <div key={idx} className="md:col-span-2 py-8 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  <div className="p-2 bg-white border border-slate-100 rounded-full italic text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section Separator</div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  {isEditMode && (
                    <button onClick={() => removeChart(chartType)} className="p-1 text-rose-300 hover:text-rose-50"><X size={14} /></button>
                  )}
                </div>
              ) : (
                <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[350px] relative group">
                  <h3 className="font-black text-slate-900 text-lg mb-6">
                    {chartType === 'Donut' ? 'Lead Distribution' :
                      chartType === 'Axis' ? 'Sales Velocity' :
                        chartType === 'Number' ? 'Total Pipeline' : `New Adaptive ${chartType}`}
                  </h3>
                  <div className="h-[250px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 transition-all hover:bg-white hover:border-blue-200">
                    {chartType === 'Line' && <TrendingUp size={48} className="text-blue-200 mb-4" />}
                    {chartType === 'Bar' && <LayoutGrid size={48} className="text-indigo-200 mb-4" />}
                    {chartType === 'Donut' && <RotateCcw size={48} className="text-rose-200 mb-4" />}
                    {chartType === 'Axis' && <Activity size={48} className="text-emerald-200 mb-4" />}
                    {chartType === 'Number' && <Tally5 size={48} className="text-amber-200 mb-4" />}

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{chartType} Component Active</p>
                    <p className="text-[9px] text-slate-300 mt-1">Collecting real-time telemetry...</p>
                  </div>
                  {isEditMode && (
                    <button onClick={() => removeChart(chartType)} className="absolute -top-3 -right-3 p-2 bg-white border-2 border-slate-100 rounded-full text-slate-400 hover:text-rose-500 shadow-xl transition-all">
                      <X size={16} />
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[32px] border border-slate-800 shadow-2xl flex flex-col min-h-[450px] relative overflow-hidden group self-start sticky top-24">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h3 className="font-black text-white text-lg">Conversion Funnel</h3>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">From discovery to win</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 mt-6 relative z-10">
            {data?.funnel?.length > 0 ? (
              data.funnel.map((stage, idx) => (
                <div key={stage.label} className="group/stage">
                  <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-2 group-hover/stage:text-white transition-colors">
                    <span>{stage.label}</span>
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded-md tabular-nums">{stage.val}</span>
                  </div>
                  <div className="h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)] ${idx === data.funnel.length - 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                      }`} style={{ width: stage.w?.replace('w-', '').replace('/', '%').replace('full', '100%').replace('4/5', '80%').replace('2/3', '66%').replace('1/2', '50%').replace('1/3', '33%') || '10%' }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-4">No funnel data available</div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</p>
                <p className="text-white font-black text-xl">84.2%</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl text-blue-400">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
