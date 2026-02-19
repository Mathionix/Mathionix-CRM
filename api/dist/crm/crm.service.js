"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const reporting_service_1 = require("./reporting.service");
const XLSX = __importStar(require("xlsx"));
let CRMService = class CRMService {
    leadModel;
    dealModel;
    organizationModel;
    contactModel;
    activityModel;
    reportingService;
    constructor(leadModel, dealModel, organizationModel, contactModel, activityModel, reportingService) {
        this.leadModel = leadModel;
        this.dealModel = dealModel;
        this.organizationModel = organizationModel;
        this.contactModel = contactModel;
        this.activityModel = activityModel;
        this.reportingService = reportingService;
    }
    async getDashboardStats(days = 30, owner) {
        return this.reportingService.getDashboardData();
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
    async findAllOrganizationsList() {
        return this.organizationModel.find({}, { name: 1 }).exec();
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
    async findAllContactsList() {
        return this.contactModel.find({}, { firstName: 1, lastName: 1 }).exec();
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
    async updateActivity(id, dto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.activityModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async removeLead(id) {
        return this.leadModel.findByIdAndDelete(id).exec();
    }
    async removeDeal(id) {
        return this.dealModel.findByIdAndDelete(id).exec();
    }
    async removeOrganization(id) {
        return this.organizationModel.findByIdAndDelete(id).exec();
    }
    async removeContact(id) {
        return this.contactModel.findByIdAndDelete(id).exec();
    }
    async removeActivity(id) {
        return this.activityModel.findByIdAndDelete(id).exec();
    }
    async exportToCsv(type) {
        let data = [];
        let headers = [];
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
            headers.join(','),
            ...data.map(row => headers.map(fieldName => {
                const value = row[fieldName] || '';
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(','))
        ];
        return csvRows.join('\r\n');
    }
    async importFromExcel(type, buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
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
                }
                else if (type === 'deals') {
                    await this.dealModel.create({
                        title: row.Title || row.title || 'Untitled Deal',
                        dealValue: Number(row.Value || row.value || 0),
                        stage: row.Stage || row.stage || row.Status || row.status || 'Qualification',
                        probability: Number(row.Probability || row.probability || 20),
                        expectedClosureDate: row.CloseDate || row.Date || new Date(),
                    });
                }
                else if (type === 'contacts') {
                    await this.contactModel.create({
                        firstName: row.FirstName || row['First Name'] || 'Unknown',
                        lastName: row.LastName || row['Last Name'] || 'User',
                        email: row.Email || row.email,
                        phone: row.Phone || row.phone,
                        jobTitle: row.JobTitle || row['Job Title'] || 'Contact',
                    });
                }
                count++;
            }
            catch (err) {
                console.error(`Failed to import row:`, err.message);
            }
        }
        return { count };
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
        mongoose_2.Model,
        reporting_service_1.ReportingService])
], CRMService);
//# sourceMappingURL=crm.service.js.map