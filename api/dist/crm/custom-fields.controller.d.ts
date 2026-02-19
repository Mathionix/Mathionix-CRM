import { CustomFieldsService } from './custom-fields.service';
export declare class CustomFieldsController {
    private readonly customFieldsService;
    constructor(customFieldsService: CustomFieldsService);
    create(createDto: any): Promise<import("./schemas/custom-field.schema").CustomField>;
    findAll(module: string): Promise<import("./schemas/custom-field.schema").CustomField[]>;
    findOne(id: string): Promise<import("./schemas/custom-field.schema").CustomField>;
    update(id: string, updateDto: any): Promise<import("./schemas/custom-field.schema").CustomField>;
    remove(id: string): Promise<void>;
}
