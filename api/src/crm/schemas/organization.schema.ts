import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
    @Prop({ required: true })
    name: string;

    @Prop()
    website: string;

    @Prop()
    territory: string;

    @Prop()
    industry: string;

    @Prop()
    noOfEmployees: string;

    @Prop()
    annualRevenue: number;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    address: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
