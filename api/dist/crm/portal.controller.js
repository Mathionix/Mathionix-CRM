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
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const deal_schema_1 = require("./schemas/deal.schema");
const payment_term_schema_1 = require("./schemas/payment-term.schema");
let PortalController = class PortalController {
    dealModel;
    paymentTermModel;
    constructor(dealModel, paymentTermModel) {
        this.dealModel = dealModel;
        this.paymentTermModel = paymentTermModel;
    }
    async getPortalData(token) {
        const deal = await this.dealModel.findOne({ portalToken: token })
            .populate('organization')
            .exec();
        if (!deal) {
            throw new common_1.NotFoundException('Invalid portal token');
        }
        const payments = await this.paymentTermModel.find({ deal: deal._id }).exec();
        return {
            deal,
            payments
        };
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "getPortalData", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)('portal'),
    __param(0, (0, mongoose_1.InjectModel)(deal_schema_1.Deal.name)),
    __param(1, (0, mongoose_1.InjectModel)(payment_term_schema_1.PaymentTerm.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PortalController);
//# sourceMappingURL=portal.controller.js.map