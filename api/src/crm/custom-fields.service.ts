import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomField, CustomFieldDocument } from './schemas/custom-field.schema';

@Injectable()
export class CustomFieldsService {
    constructor(
        @InjectModel(CustomField.name) private customFieldModel: Model<CustomFieldDocument>,
    ) { }

    async create(createDto: any): Promise<CustomField> {
        const created = new this.customFieldModel(createDto);
        return created.save();
    }

    async findAll(module?: string): Promise<CustomField[]> {
        const query = module ? { module, isActive: true } : { isActive: true };
        return this.customFieldModel.find(query).exec();
    }

    async findOne(id: string): Promise<CustomField> {
        const field = await this.customFieldModel.findById(id).exec();
        if (!field) throw new NotFoundException('Custom field not found');
        return field;
    }

    async update(id: string, updateDto: any): Promise<CustomField> {
        const updated = await this.customFieldModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        if (!updated) throw new NotFoundException('Custom field not found');
        return updated;
    }

    async remove(id: string): Promise<void> {
        const result = await this.customFieldModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Custom field not found');
    }
}
