import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DealDocument = Deal & Document;

@Schema({ timestamps: true })
export class Deal {
    @Prop({ required: true })
    organization: string;

    @Prop({ required: true })
    title: string;

    @Prop({ default: 0 })
    probability: number;

    @Prop({ type: Types.ObjectId, ref: 'Pipeline' })
    pipeline: Types.ObjectId;

    @Prop({ required: true, default: 'Qualification' })
    stage: string; // Current stage in the pipeline

    @Prop()
    dealValue: number;

    @Prop()
    expectedDealValue: number;

    @Prop()
    dealOwner: string;

    @Prop()
    contactPerson: string;

    @Prop({ type: Types.ObjectId, ref: 'Lead' })
    lead: Types.ObjectId;

    @Prop()
    expectedClosureDate: Date;

    @Prop()
    closedDate: Date;

    @Prop()
    nextStep: string;

    @Prop()
    currency: string;

    @Prop({ default: 1 })
    exchangeRate: number;

    @Prop({ type: Map, of: String })
    customFields: Map<string, string>;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ unique: true, sparse: true })
    portalToken: string;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
