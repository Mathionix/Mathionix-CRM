import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type KnowledgeArticleDocument = KnowledgeArticle & Document;

@Schema({ timestamps: true })
export class KnowledgeArticle {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string; // HTML or Markdown content

    @Prop({ type: Types.ObjectId, ref: 'KnowledgeCategory', required: true })
    category: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;

    @Prop({ default: 'published', enum: ['draft', 'published', 'archived'] })
    status: string;

    @Prop({ default: 0 })
    viewCount: number;
}

export const KnowledgeArticleSchema = SchemaFactory.createForClass(KnowledgeArticle);
