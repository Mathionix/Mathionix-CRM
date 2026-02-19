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

        // Calculate sales trend (last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const salesTrendData = await this.dealModel.aggregate([
            { $match: { createdAt: { $gte: fourWeeksAgo } } },
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    revenue: { $sum: "$dealValue" },
                    count: { $sum: 1 },
                    date: { $min: "$createdAt" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const salesTrend = salesTrendData.map((d, i) => ({
            name: `Week ${i + 1}`,
            revenue: d.revenue,
            leads: d.count
        }));

        // Revenue Forecast (next 3 months)
        const revenueForecastData = await this.dealModel.aggregate([
            { $match: { status: { $ne: 'Closed Lost' } } },
            {
                $group: {
                    _id: { $month: "$expectedClosureDate" },
                    value: { $sum: { $multiply: ["$dealValue", { $divide: ["$probability", 100] }] } }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 3 }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueForecast = revenueForecastData.map(d => ({
            name: months[d._id - 1] || 'Unknown',
            value: Math.round(d.value)
        }));

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
                { label: 'Qualified', val: Math.round(conversion.total * 0.7), w: 'w-4/5' },
                { label: 'Negotiations', val: Math.round(totalDeals * 0.5), w: 'w-2/3' },
                { label: 'Won', val: conversion.converted, w: 'w-1/2' }
            ],
            charts: {
                salesTrend: salesTrend.length > 0 ? salesTrend : [
                    { name: 'Week 1', revenue: 0, leads: 0 },
                    { name: 'Week 2', revenue: 0, leads: 0 }
                ],
                revenueForecast: revenueForecast.length > 0 ? revenueForecast : [
                    { name: 'Next Month', value: 0 }
                ],
                dealsByStage: dealStats.map((s: any) => ({ name: s._id || 'Unknown', value: s.count }))
            }
        };
    }
}
