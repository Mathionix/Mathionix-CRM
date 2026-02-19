import { EmailTemplatesService } from './email-templates.service';
export declare class EmailTemplatesController {
    private readonly emailTemplatesService;
    constructor(emailTemplatesService: EmailTemplatesService);
    findAll(query: any): Promise<import("./schemas/email-template.schema").EmailTemplate[]>;
    findOne(id: string): Promise<import("./schemas/email-template.schema").EmailTemplate | null>;
    create(req: any, data: any): Promise<import("./schemas/email-template.schema").EmailTemplate>;
    update(id: string, data: any): Promise<import("./schemas/email-template.schema").EmailTemplate | null>;
    delete(id: string): Promise<any>;
}
