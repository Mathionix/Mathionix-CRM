import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
    @Prop({ required: true })
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    mobileNo: string;

    @Prop()
    organization: string;

    @Prop()
    jobTitle: string;

    @Prop()
    gender: string;

    @Prop()
    salutation: string;

    @Prop()
    address: string;

    @Prop({ type: Map, of: String })
    customFields: Map<string, string>;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
