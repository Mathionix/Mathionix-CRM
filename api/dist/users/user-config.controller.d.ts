import { Model } from 'mongoose';
import { UserConfig, UserConfigDocument } from './schemas/user-config.schema';
export declare class UserConfigController {
    private userConfigModel;
    constructor(userConfigModel: Model<UserConfigDocument>);
    getConfig(req: any): Promise<(import("mongoose").Document<unknown, {}, UserConfigDocument, {}, import("mongoose").DefaultSchemaOptions> & UserConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | {
        dashboardLayout: {
            id: string;
            type: string;
            component: string;
            title: string;
            layout: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
        }[];
        savedReports: never[];
    }>;
    updateConfig(req: any, configDto: any): Promise<import("mongoose").Document<unknown, {}, UserConfigDocument, {}, import("mongoose").DefaultSchemaOptions> & UserConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
