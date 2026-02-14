"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const data = [
    { name: 'Mon', leads: 42, deals: 24 },
    { name: 'Tue', leads: 56, deals: 32 },
    { name: 'Wed', leads: 45, deals: 38 },
    { name: 'Thu', leads: 82, deals: 42 },
    { name: 'Fri', leads: 68, deals: 55 },
    { name: 'Sat', leads: 45, deals: 28 },
    { name: 'Sun', leads: 38, deals: 18 },
];

export default function SalesTrendChart() {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '12px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorLeads)"
                        name="Leads"
                    />
                    <Area
                        type="monotone"
                        dataKey="deals"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDeals)"
                        name="Deals"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
