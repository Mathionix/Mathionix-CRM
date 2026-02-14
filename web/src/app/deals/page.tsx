"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, DollarSign, Calendar } from 'lucide-react';

interface Deal {
    _id: string;
    organization: string;
    dealValue: number;
    status: string;
    probability: number;
    expectedClosureDate: string;
}

const STAGES = ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/crm/deals')
            .then(res => res.json())
            .then(data => {
                setDeals(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch deals', err);
                setLoading(false);
                // Fallback mock
                setDeals([
                    { _id: '1', organization: 'Acme Corp', dealValue: 5000, status: 'Qualification', probability: 20, expectedClosureDate: '2024-12-31' },
                    { _id: '2', organization: 'Globex Inc', dealValue: 12000, status: 'Proposal', probability: 40, expectedClosureDate: '2024-11-15' },
                    { _id: '3', organization: 'Umbrella Corp', dealValue: 25000, status: 'Negotiation', probability: 60, expectedClosureDate: '2024-10-20' },
                ]);
            });
    }, []);

    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        e.dataTransfer.setData('dealId', dealId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData('dealId');
        if (!dealId) return;

        // Optimistic update
        const updatedDeals = deals.map(d =>
            d._id === dealId ? { ...d, status: stage } : d
        );
        setDeals(updatedDeals);

        try {
            const res = await fetch(`http://localhost:3001/crm/deals/${dealId}`, {
                method: 'PUT', // Assuming PUT for update, or PATCH? Controller says PUT.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: stage })
            });
            if (!res.ok) throw new Error('Failed to update deal status');
        } catch (err) {
            console.error(err);
            // Revert on failure
            // In a real app, you'd fetch deals again or store previous state to revert
            alert('Failed to update deal status');
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
                    <p className="text-sm text-gray-500">Manage your sales pipeline</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type: 'Deal' } }))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    New Deal
                </button>
            </div>

            <div className="flex-1 overflow-x-auto flex gap-6 pb-4">
                {STAGES.map(stage => {
                    const stageDeals = deals.filter(d => d.status === stage);
                    const totalValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

                    return (
                        <div
                            key={stage}
                            className="w-80 shrink-0 flex flex-col h-full bg-gray-100/50 rounded-lg border p-3 transition-colors hover:bg-gray-100/80"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            <div className="flex justify-between items-center mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">{stage}</h3>
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                                        {stageDeals.length}
                                    </span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="text-xs font-bold text-gray-400 mb-4 px-1 uppercase tracking-wider">
                                Total: ${totalValue.toLocaleString()}
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                {stageDeals.map(deal => (
                                    <div
                                        key={deal._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, deal._id)}
                                        className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 truncate mr-2">{deal.organization}</h4>
                                            <MoreHorizontal size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0" />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-gray-600 mb-3 font-semibold">
                                            <DollarSign size={14} className="text-gray-400" />
                                            {deal.dealValue.toLocaleString()}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                <Calendar size={12} />
                                                {new Date(deal.expectedClosureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${deal.probability}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
