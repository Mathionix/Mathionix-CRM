import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { ReportingService } from './reporting.service';
import * as XLSX from 'xlsx';

@Injectable()
export class CRMService {
    constructor(
        @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
        @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
        @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
        @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
        private readonly reportingService: ReportingService,
    ) { }

    async getDashboardStats(days: number = 30, owner?: string) {
        return this.reportingService.getDashboardData();
    }

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
    async findAllOrganizationsList(): Promise<{ _id: string, name: string }[]> {
        return this.organizationModel.find({}, { name: 1 }).exec() as any;
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
    async findAllContactsList(): Promise<{ _id: string, firstName: string, lastName: string }[]> {
        return this.contactModel.find({}, { firstName: 1, lastName: 1 }).exec() as any;
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
    async updateActivity(id: string, dto: any): Promise<Activity | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.activityModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    // --- Deletion ---
    async removeLead(id: string) {
        return this.leadModel.findByIdAndDelete(id).exec();
    }
    async removeDeal(id: string) {
        return this.dealModel.findByIdAndDelete(id).exec();
    }
    async removeOrganization(id: string) {
        return this.organizationModel.findByIdAndDelete(id).exec();
    }
    async removeContact(id: string) {
        return this.contactModel.findByIdAndDelete(id).exec();
    }
    async removeActivity(id: string) {
        return this.activityModel.findByIdAndDelete(id).exec();
    }


    async exportToCsv(type: string): Promise<string> {
        let data: any[] = [];
        let headers: string[] = [];

        switch (type) {
            case 'leads':
                data = await this.leadModel.find().lean();
                headers = ['_id', 'title', 'company', 'value', 'status', 'email', 'phone', 'createdAt'];
                break;
            case 'deals':
                data = await this.dealModel.find().lean();
                headers = ['_id', 'title', 'value', 'stage', 'probability', 'expectedCloseDate', 'createdAt'];
                break;
            case 'contacts':
                data = await this.contactModel.find().lean();
                headers = ['_id', 'firstName', 'lastName', 'email', 'phone', 'jobTitle', 'createdAt'];
                break;
            default:
                throw new Error('Invalid export type');
        }

        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row =>
                headers.map(fieldName => {
                    const value = row[fieldName] || '';
                    const escaped = ('' + value).replace(/"/g, '""');
                    return `"${escaped}"`;
                }).join(',')
            )
        ];

        return csvRows.join('\r\n');
    }

    async importFromExcel(type: string, buffer: Buffer): Promise<{ count: number }> {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        let count = 0;
        for (const row of jsonData) {
            try {
                if (type === 'leads') {
                    await this.leadModel.create({
                        firstName: row.FirstName || row.firstName || row.Title?.split(' ')[0] || 'Unknown',
                        lastName: row.LastName || row.lastName || row.Title?.split(' ').slice(1).join(' ') || 'Lead',
                        organization: row.Company || row.company || row.Organization,
                        status: row.Status || row.status || 'New',
                        email: row.Email || row.email,
                        phone: row.Phone || row.phone,
                    });
                } else if (type === 'deals') {
                    await this.dealModel.create({
                        title: row.Title || row.title || 'Untitled Deal',
                        dealValue: Number(row.Value || row.value || 0), // Use dealValue
                        stage: row.Stage || row.stage || row.Status || row.status || 'Qualification', // Use stage
                        probability: Number(row.Probability || row.probability || 20),
                        expectedClosureDate: row.CloseDate || row.Date || new Date(),
                    });
                } else if (type === 'contacts') {
                    await this.contactModel.create({
                        firstName: row.FirstName || row['First Name'] || 'Unknown',
                        lastName: row.LastName || row['Last Name'] || 'User',
                        email: row.Email || row.email,
                        phone: row.Phone || row.phone,
                        jobTitle: row.JobTitle || row['Job Title'] || 'Contact',
                    });
                }
                count++;
            } catch (err) {
                console.error(`Failed to import row:`, err.message);
            }
        }

        return { count };
    }
}
