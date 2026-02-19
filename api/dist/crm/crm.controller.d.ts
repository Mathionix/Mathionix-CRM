import { CRMService } from './crm.service';
export declare class CRMController {
    private readonly crmService;
    constructor(crmService: CRMService);
    createLead(dto: any): Promise<import("./schemas/lead.schema").Lead>;
    findAllLeads(): Promise<import("./schemas/lead.schema").Lead[]>;
    findOneLead(id: string): Promise<import("./schemas/lead.schema").Lead | null>;
    updateLead(id: string, dto: any): Promise<import("./schemas/lead.schema").Lead | null>;
    findAllDeals(): Promise<import("./schemas/deal.schema").Deal[]>;
    findOneDeal(id: string): Promise<import("./schemas/deal.schema").Deal | null>;
    createDeal(dto: any): Promise<import("./schemas/deal.schema").Deal>;
    updateDeal(id: string, dto: any): Promise<import("./schemas/deal.schema").Deal | null>;
    findAllOrganizations(): Promise<import("./schemas/organization.schema").Organization[]>;
    findAllOrganizationsList(): Promise<{
        _id: string;
        name: string;
    }[]>;
    findOneOrganization(id: string): Promise<import("./schemas/organization.schema").Organization | null>;
    createOrganization(dto: any): Promise<import("./schemas/organization.schema").Organization>;
    updateOrganization(id: string, dto: any): Promise<import("./schemas/organization.schema").Organization | null>;
    findAllContacts(): Promise<import("./schemas/contact.schema").Contact[]>;
    findAllContactsList(): Promise<{
        _id: string;
        firstName: string;
        lastName: string;
    }[]>;
    findOneContact(id: string): Promise<import("./schemas/contact.schema").Contact | null>;
    createContact(dto: any): Promise<import("./schemas/contact.schema").Contact>;
    updateContact(id: string, dto: any): Promise<import("./schemas/contact.schema").Contact | null>;
    updateActivity(id: string, dto: any): Promise<import("./schemas/activity.schema").Activity | null>;
    patchActivity(id: string, dto: any): Promise<import("./schemas/activity.schema").Activity | null>;
    removeActivity(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/activity.schema").ActivityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/activity.schema").Activity & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    patchDeal(id: string, dto: any): Promise<import("./schemas/deal.schema").Deal | null>;
    patchLead(id: string, dto: any): Promise<import("./schemas/lead.schema").Lead | null>;
    patchContact(id: string, dto: any): Promise<import("./schemas/contact.schema").Contact | null>;
    patchOrganization(id: string, dto: any): Promise<import("./schemas/organization.schema").Organization | null>;
    exportData(type: string): Promise<string>;
    importData(type: string, file: any): Promise<{
        count: number;
    }>;
    findActivities(relatedTo?: string, type?: string): Promise<import("./schemas/activity.schema").Activity[]>;
    createActivity(dto: any): Promise<import("./schemas/activity.schema").Activity>;
    getDashboard(days?: string, owner?: string): Promise<any>;
    removeLead(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/lead.schema").LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/lead.schema").Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeDeal(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/deal.schema").DealDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/deal.schema").Deal & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeOrganization(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").OrganizationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/organization.schema").Organization & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeContact(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/contact.schema").ContactDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/contact.schema").Contact & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
