import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
export declare class CRMService {
    private leadModel;
    private dealModel;
    private organizationModel;
    private contactModel;
    private activityModel;
    constructor(leadModel: Model<LeadDocument>, dealModel: Model<DealDocument>, organizationModel: Model<OrganizationDocument>, contactModel: Model<ContactDocument>, activityModel: Model<ActivityDocument>);
    createLead(dto: any): Promise<Lead>;
    findAllLeads(): Promise<Lead[]>;
    findOneLead(id: string): Promise<Lead | null>;
    updateLead(id: string, dto: any): Promise<Lead | null>;
    createDeal(dto: any): Promise<Deal>;
    findAllDeals(): Promise<Deal[]>;
    findOneDeal(id: string): Promise<Deal | null>;
    updateDeal(id: string, dto: any): Promise<Deal | null>;
    createOrganization(dto: any): Promise<Organization>;
    findAllOrganizations(): Promise<Organization[]>;
    findOneOrganization(id: string): Promise<Organization | null>;
    updateOrganization(id: string, dto: any): Promise<Organization | null>;
    createContact(dto: any): Promise<Contact>;
    findAllContacts(): Promise<Contact[]>;
    findOneContact(id: string): Promise<Contact | null>;
    updateContact(id: string, dto: any): Promise<Contact | null>;
    createActivity(dto: any): Promise<Activity>;
    findActivities(relatedTo?: string, type?: string): Promise<Activity[]>;
    getDashboardStats(days?: number, owner?: string): Promise<{
        stats: ({
            name: string;
            value: number;
            delta: number;
            deltaSuffix: string;
            title: string;
        } | {
            name: string;
            value: string;
            delta: number;
            deltaSuffix: string;
            title: string;
        })[];
        funnel: {
            label: string;
            val: number;
            color: string;
            w: string;
        }[];
        charts: {
            revenueForecast: {
                name: string;
                value: number;
            }[];
            dealsByStage: {
                name: string;
                value: number;
            }[];
        };
    }>;
}
