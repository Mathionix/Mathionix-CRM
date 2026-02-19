"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("./schemas/lead.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const activity_schema_1 = require("./schemas/activity.schema");
let ReportingService = class ReportingService {
    leadModel;
    dealModel;
    activityModel;
    constructor(leadModel, dealModel, activityModel) {
        this.leadModel = leadModel;
        this.dealModel = dealModel;
        this.activityModel = activityModel;
    }
    async getDealStats() {
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
    async getLeadConversion() {
        const total = await this.leadModel.countDocuments();
        const converted = await this.leadModel.countDocuments({ status: 'Converted' });
        return { total, converted, rate: total > 0 ? (converted / total) * 100 : 0 };
    }
    async getActivityTrends() {
        return this.activityModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    async getDashboardData() {
        const [dealStats, conversion, trends] = await Promise.all([
            this.getDealStats(),
            this.getLeadConversion(),
            this.getActivityTrends()
        ]);
        const totalRevenue = dealStats.reduce((sum, s) => sum + s.totalValue, 0);
        const totalDeals = dealStats.reduce((sum, s) => sum + s.count, 0);
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
                dealsByStage: dealStats.map((s) => ({ name: s._id || 'Unknown', value: s.count }))
            }
        };
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(deal_schema_1.Deal.name)),
    __param(2, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map