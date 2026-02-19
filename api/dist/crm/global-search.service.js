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
exports.GlobalSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("./schemas/lead.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const contact_schema_1 = require("./schemas/contact.schema");
const organization_schema_1 = require("./schemas/organization.schema");
const client_schema_1 = require("./schemas/client.schema");
let GlobalSearchService = class GlobalSearchService {
    leadModel;
    dealModel;
    contactModel;
    orgModel;
    clientModel;
    constructor(leadModel, dealModel, contactModel, orgModel, clientModel) {
        this.leadModel = leadModel;
        this.dealModel = dealModel;
        this.contactModel = contactModel;
        this.orgModel = orgModel;
        this.clientModel = clientModel;
    }
    async search(query) {
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
};
exports.GlobalSearchService = GlobalSearchService;
exports.GlobalSearchService = GlobalSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(deal_schema_1.Deal.name)),
    __param(2, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __param(3, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __param(4, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], GlobalSearchService);
//# sourceMappingURL=global-search.service.js.map