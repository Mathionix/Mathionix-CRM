import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';

@Injectable()
export class EmailTemplatesService {
    constructor(
        @InjectModel(EmailTemplate.name) private templateModel: Model<EmailTemplateDocument>,
    ) { }

    async create(data: any): Promise<EmailTemplate> {
        return new this.templateModel(data).save();
    }

    async findAll(query: any = {}): Promise<EmailTemplate[]> {
        return this.templateModel.find(query).exec();
    }

    async findOne(id: string): Promise<EmailTemplate | null> {
        return this.templateModel.findById(id).exec();
    }

    async update(id: string, data: any): Promise<EmailTemplate | null> {
        return this.templateModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.templateModel.findByIdAndDelete(id).exec();
    }

    fillVariables(template: string, data: Record<string, any>): string {
        return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            const cleanKey = key.trim();
            return data[cleanKey] !== undefined ? String(data[cleanKey]) : match;
        });
    }
}
