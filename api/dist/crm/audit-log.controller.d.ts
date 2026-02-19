import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(query: any): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
    findByEntity(id: string): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
}
