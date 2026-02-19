import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
    @Prop({ required: true, enum: ['Comment', 'Note', 'Call', 'Task', 'Event', 'Meeting'] })
    type: string;

    @Prop()
    content: string;

    @Prop({ type: Types.ObjectId })
    relatedTo: Types.ObjectId; // ID of Lead, Deal, Contact, or Organization

    @Prop()
    relatedType: string; // 'Lead', 'Deal', 'Contact', 'Organization'

    @Prop({ type: Types.ObjectId, ref: 'User' })
    author: Types.ObjectId;

    @Prop({ type: Object })
    metadata: any; // Additional data like call duration, event time, etc.
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
