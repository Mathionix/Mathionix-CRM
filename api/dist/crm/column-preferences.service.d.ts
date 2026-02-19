import { Model } from 'mongoose';
import { ColumnPreference, ColumnPreferenceDocument } from './schemas/column-preference.schema';
export declare class ColumnPreferencesService {
    private columnPreferenceModel;
    constructor(columnPreferenceModel: Model<ColumnPreferenceDocument>);
    getPreference(userId: string, module: string): Promise<ColumnPreference | null>;
    savePreference(userId: string, module: string, columns: string[]): Promise<ColumnPreference>;
}
