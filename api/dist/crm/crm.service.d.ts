import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { ReportingService } from './reporting.service';
export declare class CRMService {
    private leadModel;
    private dealModel;
    private organizationModel;
    private contactModel;
    private activityModel;
    private readonly reportingService;
    constructor(leadModel: Model<LeadDocument>, dealModel: Model<DealDocument>, organizationModel: Model<OrganizationDocument>, contactModel: Model<ContactDocument>, activityModel: Model<ActivityDocument>, reportingService: ReportingService);
    getDashboardStats(days?: number, owner?: string): Promise<any>;
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
    findAllOrganizationsList(): Promise<{
        _id: string;
        name: string;
    }[]>;
    findOneOrganization(id: string): Promise<Organization | null>;
    updateOrganization(id: string, dto: any): Promise<Organization | null>;
    createContact(dto: any): Promise<Contact>;
    findAllContacts(): Promise<Contact[]>;
    findAllContactsList(): Promise<{
        _id: string;
        firstName: string;
        lastName: string;
    }[]>;
    findOneContact(id: string): Promise<Contact | null>;
    updateContact(id: string, dto: any): Promise<Contact | null>;
    createActivity(dto: any): Promise<Activity>;
    findActivities(relatedTo?: string, type?: string): Promise<Activity[]>;
    updateActivity(id: string, dto: any): Promise<Activity | null>;
    removeLead(id: string): Promise<(import("mongoose").Document<unknown, {}, LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeDeal(id: string): Promise<(import("mongoose").Document<unknown, {}, DealDocument, {}, import("mongoose").DefaultSchemaOptions> & Deal & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeOrganization(id: string): Promise<(import("mongoose").Document<unknown, {}, OrganizationDocument, {}, import("mongoose").DefaultSchemaOptions> & Organization & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeContact(id: string): Promise<(import("mongoose").Document<unknown, {}, ContactDocument, {}, import("mongoose").DefaultSchemaOptions> & Contact & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeActivity(id: string): Promise<(import("mongoose").Document<unknown, {}, ActivityDocument, {}, import("mongoose").DefaultSchemaOptions> & Activity & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    exportToCsv(type: string): Promise<string>;
    importFromExcel(type: string, buffer: Buffer): Promise<{
        count: number;
    }>;
}
