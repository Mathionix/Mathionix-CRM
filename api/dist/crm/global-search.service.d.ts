import { Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';
import { DealDocument } from './schemas/deal.schema';
import { ContactDocument } from './schemas/contact.schema';
import { OrganizationDocument } from './schemas/organization.schema';
import { ClientDocument } from './schemas/client.schema';
export declare class GlobalSearchService {
    private leadModel;
    private dealModel;
    private contactModel;
    private orgModel;
    private clientModel;
    constructor(leadModel: Model<LeadDocument>, dealModel: Model<DealDocument>, contactModel: Model<ContactDocument>, orgModel: Model<OrganizationDocument>, clientModel: Model<ClientDocument>);
    search(query: string): Promise<any>;
}
