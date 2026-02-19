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
exports.TeamsIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const integration_schema_1 = require("./schemas/integration.schema");
let TeamsIntegrationService = class TeamsIntegrationService {
    integrationModel;
    constructor(integrationModel) {
        this.integrationModel = integrationModel;
    }
    async notifyTeams(module, message) {
        const integrations = await this.integrationModel.find({
            name: 'Microsoft Teams',
            module: { $in: [module, 'all'] },
            isActive: true
        }).exec();
        for (const integration of integrations) {
            const webhookUrl = integration.config?.webhookUrl;
            if (webhookUrl) {
                try {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "@type": "MessageCard",
                            "@context": "http://schema.org/extensions",
                            "themeColor": "0076D7",
                            "summary": message.title,
                            "sections": [{
                                    "activityTitle": message.title,
                                    "activitySubtitle": message.text,
                                    "markdown": true
                                }]
                        })
                    });
                }
                catch (error) {
                    console.error('Failed to send Teams notification:', error);
                }
            }
        }
    }
    async saveIntegration(data) {
        return new this.integrationModel({ ...data, name: 'Microsoft Teams', type: 'webhook' }).save();
    }
    async findAll() {
        return this.integrationModel.find({ name: 'Microsoft Teams' }).exec();
    }
};
exports.TeamsIntegrationService = TeamsIntegrationService;
exports.TeamsIntegrationService = TeamsIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(integration_schema_1.Integration.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TeamsIntegrationService);
//# sourceMappingURL=teams-integration.service.js.map