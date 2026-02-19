import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KnowledgeCategoryDocument = KnowledgeCategory & Document;

@Schema({ timestamps: true })
export class KnowledgeCategory {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    icon: string; // Lucide icon name

    @Prop({ default: 0 })
    order: number;
}

export const KnowledgeCategorySchema = SchemaFactory.createForClass(KnowledgeCategory);
