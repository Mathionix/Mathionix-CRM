import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ReportingService {
    constructor(
        @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
        @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
        @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    ) { }

    async getDealStats(): Promise<any> {
        return this.dealModel.aggregate([
            {
                $group: {
                    _id: "$stage",
                    totalValue: { $sum: "$dealValue" },
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getLeadConversion(): Promise<any> {
        const total = await this.leadModel.countDocuments();
        const converted = await this.leadModel.countDocuments({ status: 'Converted' });
        return { total, converted, rate: total > 0 ? (converted / total) * 100 : 0 };
    }

    async getActivityTrends(): Promise<any> {
        return this.activityModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getDashboardData(): Promise<any> {
        const [dealStats, conversion, trends] = await Promise.all([
            this.getDealStats(),
            this.getLeadConversion(),
            this.getActivityTrends()
        ]);

        const totalRevenue = dealStats.reduce((sum: number, s: any) => sum + s.totalValue, 0);
        const totalDeals = dealStats.reduce((sum: number, s: any) => sum + s.count, 0);

        return {
            stats: [
                { name: 'total_leads', value: conversion.total, delta: 12, deltaSuffix: '%', title: 'Total Leads' },
                { name: 'total_revenue', value: `$${totalRevenue.toLocaleString()}`, delta: 8, deltaSuffix: '%', title: 'Forecasted Revenue' },
                { name: 'conversion_rate', value: conversion.rate.toFixed(1), delta: 5, deltaSuffix: '%', title: 'Lead Conversion' },
                { name: 'active_deals', value: totalDeals, delta: -2, deltaSuffix: '%', title: 'Active Deals' }
            ],
            funnel: [
                { label: 'Leads', val: conversion.total, w: 'full' },
                { label: 'Proposals', val: Math.round(conversion.total * 0.6), w: 'w-4/5' },
                { label: 'Negotiations', val: Math.round(conversion.total * 0.3), w: 'w-2/3' },
                { label: 'Won', val: conversion.converted, w: 'w-1/2' }
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
                dealsByStage: dealStats.map((s: any) => ({ name: s._id || 'Unknown', value: s.count }))
            }
        };
    }
}
