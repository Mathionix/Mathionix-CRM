import { ColumnPreferencesService } from './column-preferences.service';
export declare class ColumnPreferencesController {
    private readonly columnPreferencesService;
    constructor(columnPreferencesService: ColumnPreferencesService);
    getPreference(req: any, module: string): Promise<import("./schemas/column-preference.schema").ColumnPreference | null>;
    savePreference(req: any, module: string, columns: string[]): Promise<import("./schemas/column-preference.schema").ColumnPreference>;
}
