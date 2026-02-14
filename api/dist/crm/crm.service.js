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
exports.CRMService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("./schemas/lead.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const organization_schema_1 = require("./schemas/organization.schema");
const contact_schema_1 = require("./schemas/contact.schema");
const activity_schema_1 = require("./schemas/activity.schema");
let CRMService = class CRMService {
    leadModel;
    dealModel;
    organizationModel;
    contactModel;
    activityModel;
    constructor(leadModel, dealModel, organizationModel, contactModel, activityModel) {
        this.leadModel = leadModel;
        this.dealModel = dealModel;
        this.organizationModel = organizationModel;
        this.contactModel = contactModel;
        this.activityModel = activityModel;
    }
    async createLead(dto) {
        return new this.leadModel(dto).save();
    }
    async findAllLeads() {
        return this.leadModel.find().exec();
    }
    async findOneLead(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.leadModel.findById(id).exec();
    }
    async updateLead(id, dto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.leadModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async createDeal(dto) {
        return new this.dealModel(dto).save();
    }
    async findAllDeals() {
        return this.dealModel.find().populate('lead').exec();
    }
    async findOneDeal(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.dealModel.findById(id).populate('lead').exec();
    }
    async updateDeal(id, dto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.dealModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async createOrganization(dto) {
        return new this.organizationModel(dto).save();
    }
    async findAllOrganizations() {
        return this.organizationModel.find().exec();
    }
    async findOneOrganization(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.organizationModel.findById(id).exec();
    }
    async updateOrganization(id, dto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.organizationModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async createContact(dto) {
        return new this.contactModel(dto).save();
    }
    async findAllContacts() {
        return this.contactModel.find().populate('organization').exec();
    }
    async findOneContact(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.contactModel.findById(id).populate('organization').exec();
    }
    async updateContact(id, dto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.contactModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async createActivity(dto) {
        return new this.activityModel(dto).save();
    }
    async findActivities(relatedTo, type) {
        const filter = {};
        if (relatedTo)
            filter.relatedTo = relatedTo;
        if (type)
            filter.type = type;
        return this.activityModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async getDashboardStats(days = 30, owner) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        const filter = { createdAt: { $gte: dateLimit } };
        if (owner && owner !== 'All') {
            filter.leadOwner = owner;
        }
        const totalLeads = await this.leadModel.countDocuments(filter);
        const ongoingDeals = await this.dealModel.countDocuments({ ...filter, status: { $nin: ['Won', 'Lost'] } });
        const wonDealsReq = await this.dealModel.find({ ...filter, status: 'Won' });
        const wonDeals = wonDealsReq.length;
        const allDeals = await this.dealModel.find(filter);
        const totalDealValue = allDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
        const avgDealValue = allDeals.length ? Math.round(totalDealValue / allDeals.length) : 0;
        const totalWonValue = wonDealsReq.reduce((sum, d) => sum + (d.dealValue || 0), 0);
        const avgWonDealValue = wonDeals ? Math.round(totalWonValue / wonDeals) : 0;
        const avgLeadCloseTime = 4.2;
        const avgDealCloseTime = 12.5;
        const funnel = [
            { label: 'Total Leads', val: totalLeads, color: 'bg-blue-600', w: 'w-full' },
            { label: 'Qualified', val: await this.leadModel.countDocuments({ ...filter, status: 'Qualified' }), color: 'bg-blue-500', w: 'w-4/5' },
            { label: 'Replied', val: await this.leadModel.countDocuments({ ...filter, status: 'Replied' }), color: 'bg-blue-400', w: 'w-2/3' },
            { label: 'Opportunity', val: await this.leadModel.countDocuments({ ...filter, status: 'Opportunity' }), color: 'bg-blue-300', w: 'w-1/2' },
            { label: 'Won', val: wonDeals, color: 'bg-green-500', w: 'w-1/3' },
        ];
        const prevDateLimit = new Date();
        prevDateLimit.setDate(prevDateLimit.getDate() - (days * 2));
        const prevFilter = { createdAt: { $gte: prevDateLimit, $lt: dateLimit } };
        if (owner && owner !== 'All') {
            prevFilter.leadOwner = owner;
        }
        const prevLeads = await this.leadModel.countDocuments(prevFilter);
        const leadDelta = prevLeads ? Math.round(((totalLeads - prevLeads) / prevLeads) * 100) : 0;
        return {
            stats: [
                { name: 'total_leads', value: totalLeads, delta: leadDelta, deltaSuffix: '%', title: 'Total Leads' },
                { name: 'ongoing_deals', value: ongoingDeals, delta: 2, deltaSuffix: '%', title: 'Ongoing Deals' },
                { name: 'won_deals', value: wonDeals, delta: 10, deltaSuffix: '%', title: 'Won Deals' },
                { name: 'conversion_rate', value: totalLeads ? Math.round((wonDeals / totalLeads) * 1000) / 10 : 0, delta: 0, deltaSuffix: '%', title: 'Conversion Rate' },
                { name: 'avg_won_deal_value', value: `₹${avgWonDealValue.toLocaleString()}`, delta: 5, deltaSuffix: '%', title: 'Avg. Won Deal Value' },
                { name: 'avg_deal_value', value: `₹${avgDealValue.toLocaleString()}`, delta: -2, deltaSuffix: '%', title: 'Avg. Deal Value' },
                { name: 'avg_lead_close_time', value: `${avgLeadCloseTime} days`, delta: 0, deltaSuffix: '%', title: 'Avg. Lead Close Time' },
                { name: 'avg_deal_close_time', value: `${avgDealCloseTime} days`, delta: 0, deltaSuffix: '%', title: 'Avg. Deal Close Time' }
            ],
            funnel,
            charts: {
                revenueForecast: [
                    { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 5000 }
                ],
                dealsByStage: [
                    { name: 'Discovery', value: 40 }, { name: 'Proposal', value: 30 }, { name: 'Negotiation', value: 20 }
                ]
            }
        };
    }
};
exports.CRMService = CRMService;
exports.CRMService = CRMService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(deal_schema_1.Deal.name)),
    __param(2, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __param(3, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __param(4, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CRMService);
//# sourceMappingURL=crm.service.js.map