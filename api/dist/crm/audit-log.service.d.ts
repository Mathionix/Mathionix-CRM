import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
export declare class AuditLogService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    logAction(data: {
        user: string;
        action: string;
        module: string;
        entityId?: string;
        changes?: any;
        description?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditLog>;
    findAll(query?: any): Promise<AuditLog[]>;
    findByEntity(entityId: string): Promise<AuditLog[]>;
}
