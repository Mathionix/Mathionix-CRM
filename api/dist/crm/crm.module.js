"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const crm_controller_1 = require("./crm.controller");
const crm_service_1 = require("./crm.service");
const lead_schema_1 = require("./schemas/lead.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const organization_schema_1 = require("./schemas/organization.schema");
const contact_schema_1 = require("./schemas/contact.schema");
const activity_schema_1 = require("./schemas/activity.schema");
let CRMModule = class CRMModule {
};
exports.CRMModule = CRMModule;
exports.CRMModule = CRMModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
                { name: deal_schema_1.Deal.name, schema: deal_schema_1.DealSchema },
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema },
                { name: contact_schema_1.Contact.name, schema: contact_schema_1.ContactSchema },
                { name: activity_schema_1.Activity.name, schema: activity_schema_1.ActivitySchema },
            ]),
        ],
        controllers: [crm_controller_1.CRMController],
        providers: [crm_service_1.CRMService],
        exports: [crm_service_1.CRMService],
    })
], CRMModule);
//# sourceMappingURL=crm.module.js.map