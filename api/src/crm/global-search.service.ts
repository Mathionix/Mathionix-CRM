import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Client, ClientDocument } from './schemas/client.schema';

@Injectable()
export class GlobalSearchService {
    constructor(
        @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
        @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
        @InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>,
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    ) { }

    async search(query: string): Promise<any> {
        const regex = new RegExp(query, 'i');

        const [leads, deals, contacts, organizations, clients] = await Promise.all([
            this.leadModel.find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }).limit(5).exec(),
            this.dealModel.find({ $or: [{ name: regex }, { status: regex }] }).limit(5).exec(),
            this.contactModel.find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }).limit(5).exec(),
            this.orgModel.find({ name: regex }).limit(5).exec(),
            this.clientModel.find({ $or: [{ name: regex }, { email: regex }] }).limit(5).exec(),
        ]);

        return {
            leads,
            deals,
            contacts,
            organizations,
            clients
        };
    }
}
