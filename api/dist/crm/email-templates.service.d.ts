import { Model } from 'mongoose';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';
export declare class EmailTemplatesService {
    private templateModel;
    constructor(templateModel: Model<EmailTemplateDocument>);
    create(data: any): Promise<EmailTemplate>;
    findAll(query?: any): Promise<EmailTemplate[]>;
    findOne(id: string): Promise<EmailTemplate | null>;
    update(id: string, data: any): Promise<EmailTemplate | null>;
    delete(id: string): Promise<any>;
    fillVariables(template: string, data: Record<string, any>): string;
}
