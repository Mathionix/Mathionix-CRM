import { TeamsIntegrationService } from './teams-integration.service';
import { Model } from 'mongoose';
export declare class IntegrationsController {
    private readonly teamsService;
    private readonly integrationModel;
    constructor(teamsService: TeamsIntegrationService, integrationModel: Model<any>);
    getWhatsAppConfig(): Promise<any>;
    saveWhatsAppConfig(data: any): Promise<any>;
    testWhatsApp(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllTeams(): Promise<import("./schemas/integration.schema").Integration[]>;
    saveTeams(data: any): Promise<import("./schemas/integration.schema").Integration>;
}
