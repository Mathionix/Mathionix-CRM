"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

export default function ForecastedRevenueChart({ data = [] }: { data?: any[] }) {
    const chartData = data?.length ? data : [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 },
    ];

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
