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
exports.DealSchema = exports.Deal = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Deal = class Deal {
    organization;
    title;
    probability;
    pipeline;
    stage;
    dealValue;
    expectedDealValue;
    dealOwner;
    contactPerson;
    lead;
    expectedClosureDate;
    closedDate;
    nextStep;
    currency;
    exchangeRate;
    customFields;
    createdBy;
    portalToken;
};
exports.Deal = Deal;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Deal.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Deal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Deal.prototype, "probability", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pipeline' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "pipeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'Qualification' }),
    __metadata("design:type", String)
], Deal.prototype, "stage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Deal.prototype, "dealValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Deal.prototype, "expectedDealValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Deal.prototype, "dealOwner", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Deal.prototype, "contactPerson", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Lead' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "lead", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Deal.prototype, "expectedClosureDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Deal.prototype, "closedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Deal.prototype, "nextStep", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Deal.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Deal.prototype, "exchangeRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: String }),
    __metadata("design:type", Map)
], Deal.prototype, "customFields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Deal.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Deal.prototype, "portalToken", void 0);
exports.Deal = Deal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Deal);
exports.DealSchema = mongoose_1.SchemaFactory.createForClass(Deal);
//# sourceMappingURL=deal.schema.js.map