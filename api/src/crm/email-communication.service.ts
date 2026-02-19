import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { Email, EmailDocument } from './schemas/email.schema';

@Injectable()
export class EmailCommunicationService {
    private transporter;

    constructor(
        @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    ) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(data: {
        sender: string;
        recipient: string;
        subject: string;
        body: string;
        module: string;
        entityId: string;
    }): Promise<Email> {
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
        } catch (error) {
            console.error('Email send failed:', error);
            const failedEmail = new this.emailModel({
                ...data,
                status: 'failed',
                meta: { error: error.message },
            });
            return failedEmail.save();
        }
    }

    async findByEntity(entityId: string): Promise<Email[]> {
        return this.emailModel
            .find({ entityId })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName')
            .exec();
    }
}
