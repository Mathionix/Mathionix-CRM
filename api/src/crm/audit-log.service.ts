import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    ) { }

    async logAction(data: {
        user: string;
        action: string;
        module: string;
        entityId?: string;
        changes?: any;
        description?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditLog> {
        const log = new this.auditLogModel(data);
        return log.save();
    }

    async findAll(query: any = {}): Promise<AuditLog[]> {
        return this.auditLogModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName email')
            .exec();
    }

    async findByEntity(entityId: string): Promise<AuditLog[]> {
        return this.auditLogModel
            .find({ entityId })
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName email')
            .exec();
    }
}
