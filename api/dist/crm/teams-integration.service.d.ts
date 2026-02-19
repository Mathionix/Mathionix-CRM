import { Model } from 'mongoose';
import { Integration, IntegrationDocument } from './schemas/integration.schema';
export declare class TeamsIntegrationService {
    private integrationModel;
    constructor(integrationModel: Model<IntegrationDocument>);
    notifyTeams(module: string, message: {
        title: string;
        text: string;
    }): Promise<void>;
    saveIntegration(data: any): Promise<Integration>;
    findAll(): Promise<Integration[]>;
}
