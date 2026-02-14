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
    findOneOrganization(id: string): Promise<import("./schemas/organization.schema").Organization | null>;
    createOrganization(dto: any): Promise<import("./schemas/organization.schema").Organization>;
    updateOrganization(id: string, dto: any): Promise<import("./schemas/organization.schema").Organization | null>;
    findAllContacts(): Promise<import("./schemas/contact.schema").Contact[]>;
    findOneContact(id: string): Promise<import("./schemas/contact.schema").Contact | null>;
    createContact(dto: any): Promise<import("./schemas/contact.schema").Contact>;
    updateContact(id: string, dto: any): Promise<import("./schemas/contact.schema").Contact | null>;
    findActivities(relatedTo?: string, type?: string): Promise<import("./schemas/activity.schema").Activity[]>;
    createActivity(dto: any): Promise<import("./schemas/activity.schema").Activity>;
    getDashboard(days?: string, owner?: string): Promise<{
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
