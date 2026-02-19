import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ type: Types.ObjectId, ref: 'Organization' })
    organization: Types.ObjectId;

    @Prop({ default: 'active', enum: ['active', 'inactive', 'prospective'] })
    status: string;

    @Prop({ type: Map, of: String })
    customFields: Map<string, string>;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    assignedTo: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
