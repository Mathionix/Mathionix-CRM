import { Model } from 'mongoose';
import { CustomField, CustomFieldDocument } from './schemas/custom-field.schema';
export declare class CustomFieldsService {
    private customFieldModel;
    constructor(customFieldModel: Model<CustomFieldDocument>);
    create(createDto: any): Promise<CustomField>;
    findAll(module?: string): Promise<CustomField[]>;
    findOne(id: string): Promise<CustomField>;
    update(id: string, updateDto: any): Promise<CustomField>;
    remove(id: string): Promise<void>;
}
