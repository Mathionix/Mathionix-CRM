import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
    @Prop({ required: true })
    firstName: string;

    @Prop()
    middleName: string;

    @Prop()
    lastName: string;

    @Prop({ required: true, default: 'New' })
    status: string; // Ref to CRM Lead Status

    @Prop({ index: true })
    email: string;

    @Prop()
    mobileNo: string;

    @Prop()
    phone: string;

    @Prop()
    organization: string;

    @Prop()
    jobTitle: string;

    @Prop()
    source: string; // Ref to CRM Lead Source

    @Prop()
    industry: string; // Ref to CRM Industry

    @Prop()
    annualRevenue: number;

    @Prop()
    noOfEmployees: string;

    @Prop()
    leadOwner: string;

    @Prop({ default: false })
    converted: boolean;

    @Prop()
    website: string;

    @Prop()
    territory: string;

    @Prop()
    image: string;

    @Prop({ type: Map, of: String })
    customFields: Map<string, string>;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
