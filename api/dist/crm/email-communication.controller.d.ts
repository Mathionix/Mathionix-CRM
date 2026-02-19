import { EmailCommunicationService } from './email-communication.service';
export declare class EmailCommunicationController {
    private readonly emailService;
    constructor(emailService: EmailCommunicationService);
    sendEmail(req: any, data: any): Promise<import("./schemas/email.schema").Email>;
    findByEntity(id: string): Promise<import("./schemas/email.schema").Email[]>;
}
