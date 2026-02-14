import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class CRMService {
    constructor(
        @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
        @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
        @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
        @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    ) { }

    // --- Leads ---
    async createLead(dto: any): Promise<Lead> {
        return new this.leadModel(dto).save();
    }
    async findAllLeads(): Promise<Lead[]> {
        return this.leadModel.find().exec();
    }
    async findOneLead(id: string): Promise<Lead | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.leadModel.findById(id).exec();
    }
    async updateLead(id: string, dto: any): Promise<Lead | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.leadModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    // --- Deals ---
    async createDeal(dto: any): Promise<Deal> {
        return new this.dealModel(dto).save();
    }
    async findAllDeals(): Promise<Deal[]> {
        return this.dealModel.find().populate('lead').exec();
    }
    async findOneDeal(id: string): Promise<Deal | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.dealModel.findById(id).populate('lead').exec();
    }
    async updateDeal(id: string, dto: any): Promise<Deal | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.dealModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    // --- Organizations ---
    async createOrganization(dto: any): Promise<Organization> {
        return new this.organizationModel(dto).save();
    }
    async findAllOrganizations(): Promise<Organization[]> {
        return this.organizationModel.find().exec();
    }
    async findOneOrganization(id: string): Promise<Organization | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.organizationModel.findById(id).exec();
    }
    async updateOrganization(id: string, dto: any): Promise<Organization | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.organizationModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    // --- Contacts ---
    async createContact(dto: any): Promise<Contact> {
        return new this.contactModel(dto).save();
    }
    async findAllContacts(): Promise<Contact[]> {
        return this.contactModel.find().populate('organization').exec();
    }
    async findOneContact(id: string): Promise<Contact | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.contactModel.findById(id).populate('organization').exec();
    }
    async updateContact(id: string, dto: any): Promise<Contact | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.contactModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    // --- Activities ---
    async createActivity(dto: any): Promise<Activity> {
        return new this.activityModel(dto).save();
    }
    async findActivities(relatedTo?: string, type?: string): Promise<Activity[]> {
        const filter: any = {};
        if (relatedTo) filter.relatedTo = relatedTo;
        if (type) filter.type = type;
        return this.activityModel.find(filter).sort({ createdAt: -1 }).exec();
    }

    async getDashboardStats(days: number = 30, owner?: string) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const filter: any = { createdAt: { $gte: dateLimit } };
        if (owner && owner !== 'All') {
            filter.leadOwner = owner;
        }

        const totalLeads = await this.leadModel.countDocuments(filter);
        const ongoingDeals = await this.dealModel.countDocuments({ ...filter, status: { $nin: ['Won', 'Lost'] } });
        const wonDealsReq = await this.dealModel.find({ ...filter, status: 'Won' });
        const wonDeals = wonDealsReq.length;

        // Advanced KPIs
        const allDeals = await this.dealModel.find(filter);
        const totalDealValue = allDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
        const avgDealValue = allDeals.length ? Math.round(totalDealValue / allDeals.length) : 0;

        const totalWonValue = wonDealsReq.reduce((sum, d) => sum + (d.dealValue || 0), 0);
        const avgWonDealValue = wonDeals ? Math.round(totalWonValue / wonDeals) : 0;

        // Avg Time to Close (Mocked for now since we need closedAt/convertedAt fields)
        const avgLeadCloseTime = 4.2;
        const avgDealCloseTime = 12.5;

        // Lead Funnel Data
        const funnel = [
            { label: 'Total Leads', val: totalLeads, color: 'bg-blue-600', w: 'w-full' },
            { label: 'Qualified', val: await this.leadModel.countDocuments({ ...filter, status: 'Qualified' }), color: 'bg-blue-500', w: 'w-4/5' },
            { label: 'Replied', val: await this.leadModel.countDocuments({ ...filter, status: 'Replied' }), color: 'bg-blue-400', w: 'w-2/3' },
            { label: 'Opportunity', val: await this.leadModel.countDocuments({ ...filter, status: 'Opportunity' }), color: 'bg-blue-300', w: 'w-1/2' },
            { label: 'Won', val: wonDeals, color: 'bg-green-500', w: 'w-1/3' },
        ];

        // Calculate delta
        const prevDateLimit = new Date();
        prevDateLimit.setDate(prevDateLimit.getDate() - (days * 2));
        const prevFilter: any = { createdAt: { $gte: prevDateLimit, $lt: dateLimit } };
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
}
