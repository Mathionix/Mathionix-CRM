import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password?: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ type: Types.ObjectId, ref: 'Role' })
    roleId?: Types.ObjectId;

    @Prop({ default: 'user' }) // 'admin' | 'user' - kept for compatibility during transition
    role: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
