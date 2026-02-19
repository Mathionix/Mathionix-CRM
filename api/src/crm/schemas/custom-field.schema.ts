import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomFieldDocument = CustomField & Document;

export enum CustomFieldType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
}

@Schema({ timestamps: true })
export class CustomField {
    @Prop({ required: true })
    name: string; // The label shown to user

    @Prop({ required: true, unique: true })
    key: string; // Internal key (e.g., 'annual_revenue')

    @Prop({ required: true, enum: CustomFieldType })
    type: CustomFieldType;

    @Prop({ required: true })
    module: string; // 'leads', 'deals', 'contacts', 'organizations'

    @Prop({ type: [String], default: [] })
    options: string[]; // For SELECT type

    @Prop({ default: false })
    required: boolean;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);
