import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    body: string; // HTML content with variables like {{firstName}}

    @Prop({ type: [String], default: [] })
    variables: string[]; // List of supported variables

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Prop({ default: 'standard', enum: ['standard', 'marketing', 'transactional'] })
    type: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
