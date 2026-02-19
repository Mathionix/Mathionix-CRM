import { Model } from 'mongoose';
import { Email, EmailDocument } from './schemas/email.schema';
export declare class EmailCommunicationService {
    private emailModel;
    private transporter;
    constructor(emailModel: Model<EmailDocument>);
    sendEmail(data: {
        sender: string;
        recipient: string;
        subject: string;
        body: string;
        module: string;
        entityId: string;
    }): Promise<Email>;
    findByEntity(entityId: string): Promise<Email[]>;
}
