import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentTermDocument = PaymentTerm & Document;

@Schema({ timestamps: true })
export class PaymentTerm {
    @Prop({ type: Types.ObjectId, ref: 'Deal', required: true })
    deal: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    dueDate: Date;

    @Prop({ default: 'Pending', enum: ['Pending', 'Paid', 'Partial', 'Overdue'] })
    status: string;

    @Prop()
    notes: string;
}

export const PaymentTermSchema = SchemaFactory.createForClass(PaymentTerm);
