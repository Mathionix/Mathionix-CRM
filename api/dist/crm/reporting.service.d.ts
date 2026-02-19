import { Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';
import { DealDocument } from './schemas/deal.schema';
import { ActivityDocument } from './schemas/activity.schema';
export declare class ReportingService {
    private leadModel;
    private dealModel;
    private activityModel;
    constructor(leadModel: Model<LeadDocument>, dealModel: Model<DealDocument>, activityModel: Model<ActivityDocument>);
    getDealStats(): Promise<any>;
    getLeadConversion(): Promise<any>;
    getActivityTrends(): Promise<any>;
    getDashboardData(): Promise<any>;
}
