import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntegrationDocument = Integration & Document;

@Schema({ timestamps: true })
export class Integration {
    @Prop({ required: true })
    name: string; // 'Microsoft Teams', 'WhatsApp', etc.

    @Prop({ required: true })
    type: string; // 'webhook', 'api_key', etc.

    @Prop({ required: true })
    module: string; // 'leads', 'deals', 'contacts', 'all'

    @Prop({ type: Object, required: true })
    config: Record<string, any>; // { webhookUrl: '...' }

    @Prop({ default: true })
    isActive: boolean;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
