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
exports.EmailCommunicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nodemailer = __importStar(require("nodemailer"));
const email_schema_1 = require("./schemas/email.schema");
let EmailCommunicationService = class EmailCommunicationService {
    emailModel;
    transporter;
    constructor(emailModel) {
        this.emailModel = emailModel;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail(data) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Mathionix CRM" <${process.env.SMTP_USER}>`,
                to: data.recipient,
                subject: data.subject,
                html: data.body,
            });
            const sentEmail = new this.emailModel({
                ...data,
                status: 'sent',
                meta: info,
            });
            return sentEmail.save();
        }
        catch (error) {
            console.error('Email send failed:', error);
            const failedEmail = new this.emailModel({
                ...data,
                status: 'failed',
                meta: { error: error.message },
            });
            return failedEmail.save();
        }
    }
    async findByEntity(entityId) {
        return this.emailModel
            .find({ entityId })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName')
            .exec();
    }
};
exports.EmailCommunicationService = EmailCommunicationService;
exports.EmailCommunicationService = EmailCommunicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(email_schema_1.Email.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EmailCommunicationService);
//# sourceMappingURL=email-communication.service.js.map