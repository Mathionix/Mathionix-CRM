import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PipelineDocument = Pipeline & Document;

@Schema({ timestamps: true })
export class Pipeline {
    @Prop({ required: true })
    name: string; // e.g., 'Standard Sales', 'Implementation', 'Partnership'

    @Prop({
        type: [{
            name: { type: String, required: true },
            probability: { type: Number, default: 0 },
            order: { type: Number, required: true },
            isDefault: { type: Boolean, default: false }
        }]
    })
    stages: { name: string; probability: number; order: number; isDefault: boolean }[];

    @Prop({ default: false })
    isDefault: boolean;
}

export const PipelineSchema = SchemaFactory.createForClass(Pipeline);
