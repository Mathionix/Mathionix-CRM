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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSchema = exports.Lead = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Lead = class Lead {
    firstName;
    middleName;
    lastName;
    status;
    email;
    mobileNo;
    phone;
    organization;
    jobTitle;
    source;
    industry;
    annualRevenue;
    noOfEmployees;
    leadOwner;
    converted;
    website;
    territory;
    image;
    customFields;
    createdBy;
};
exports.Lead = Lead;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lead.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "middleName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'New' }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "mobileNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "jobTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "industry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Lead.prototype, "annualRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "noOfEmployees", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "leadOwner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Lead.prototype, "converted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "territory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: String }),
    __metadata("design:type", Map)
], Lead.prototype, "customFields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Lead.prototype, "createdBy", void 0);
exports.Lead = Lead = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lead);
exports.LeadSchema = mongoose_1.SchemaFactory.createForClass(Lead);
//# sourceMappingURL=lead.schema.js.map