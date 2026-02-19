import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(private readonly auditLogService: AuditLogService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user, ip } = request;

        // Only log mutation methods
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
            return next.handle().pipe(
                tap(async (response) => {
                    const module = this.getModuleFromUrl(url);
                    const action = this.getActionFromMethod(method);

                    if (user && module) {
                        try {
                            await this.auditLogService.logAction({
                                user: user.userId || user._id,
                                action,
                                module,
                                entityId: response?._id || request.params?.id,
                                description: `${action} action performed on ${module}`,
                                ipAddress: ip,
                                userAgent: request.headers['user-agent'],
                                changes: method === 'PUT' ? body : undefined
                            });
                        } catch (err) {
                            console.error('AuditLogInterceptor Error:', err);
                        }
                    }
                }),
            );
        }

        return next.handle();
    }

    private getModuleFromUrl(url: string): string {
        if (url.includes('/crm/leads')) return 'leads';
        if (url.includes('/crm/deals')) return 'deals';
        if (url.includes('/crm/organizations')) return 'organizations';
        if (url.includes('/crm/contacts')) return 'contacts';
        if (url.includes('/crm/clients')) return 'clients';
        if (url.includes('/users/roles')) return 'roles';
        if (url.includes('/users')) return 'users';
        return 'system';
    }

    private getActionFromMethod(method: string): string {
        switch (method) {
            case 'POST': return 'create';
            case 'PUT': return 'update';
            case 'DELETE': return 'delete';
            default: return 'action';
        }
    }
}
