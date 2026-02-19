import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CRMController } from './crm.controller';
import { CRMService } from './crm.service';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { Deal, DealSchema } from './schemas/deal.schema';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { CustomField, CustomFieldSchema } from './schemas/custom-field.schema';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { ColumnPreference, ColumnPreferenceSchema } from './schemas/column-preference.schema';
import { ColumnPreferencesService } from './column-preferences.service';
import { ColumnPreferencesController } from './column-preferences.controller';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { KnowledgeCategory, KnowledgeCategorySchema } from './schemas/knowledge-category.schema';
import { KnowledgeArticle, KnowledgeArticleSchema } from './schemas/knowledge-article.schema';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplatesController } from './email-templates.controller';
import { Email, EmailSchema } from './schemas/email.schema';
import { EmailCommunicationService } from './email-communication.service';
import { EmailCommunicationController } from './email-communication.controller';
import { Integration, IntegrationSchema } from './schemas/integration.schema';
import { TeamsIntegrationService } from './teams-integration.service';
import { IntegrationsController } from './integrations.controller';
import { PaymentTerm, PaymentTermSchema } from './schemas/payment-term.schema';
import { PaymentTermsController } from './payment-terms.controller';
import { PaymentTermsService } from './payment-terms.service';
import { PortalController } from './portal.controller';
import { Client, ClientSchema } from './schemas/client.schema';
import { ClientsService } from './clients.service';
import { GlobalSearchService } from './global-search.service';
import { ClientsController } from './clients.controller';
import { Pipeline, PipelineSchema } from './schemas/pipeline.schema';
import { PipelinesService } from './pipelines.service';
import { ReportingService } from './reporting.service';
import { PipelineController } from './pipeline.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Lead.name, schema: LeadSchema },
            { name: Deal.name, schema: DealSchema },
            { name: Organization.name, schema: OrganizationSchema },
            { name: Contact.name, schema: ContactSchema },
            { name: Activity.name, schema: ActivitySchema },
            { name: CustomField.name, schema: CustomFieldSchema },
            { name: ColumnPreference.name, schema: ColumnPreferenceSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
            { name: KnowledgeCategory.name, schema: KnowledgeCategorySchema },
            { name: KnowledgeArticle.name, schema: KnowledgeArticleSchema },
            { name: EmailTemplate.name, schema: EmailTemplateSchema },
            { name: Email.name, schema: EmailSchema },
            { name: Integration.name, schema: IntegrationSchema },
            { name: Client.name, schema: ClientSchema },
            { name: PaymentTerm.name, schema: PaymentTermSchema },
            { name: Pipeline.name, schema: PipelineSchema },
        ]),
        UsersModule,
    ],
    controllers: [
        CRMController,
        ClientsController,
        ColumnPreferencesController,
        CustomFieldsController,
        EmailCommunicationController,
        EmailTemplatesController,
        AuditLogController,
        IntegrationsController,
        KnowledgeBaseController,
        PipelineController,
        PaymentTermsController,
        PortalController
    ],
    providers: [
        CRMService,
        AuditLogService,
        ColumnPreferencesService,
        CustomFieldsService,
        EmailCommunicationService,
        EmailTemplatesService,
        GlobalSearchService,
        KnowledgeBaseService,
        PipelinesService,
        ReportingService,
        TeamsIntegrationService,
        ClientsService,
        PaymentTermsService,
        AuditLogInterceptor,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditLogInterceptor,
        },
    ],
    exports: [
        CRMService,
        AuditLogService,
        ColumnPreferencesService,
        CustomFieldsService,
        ClientsService,
        EmailTemplatesService,
        EmailCommunicationService,
        TeamsIntegrationService,
        GlobalSearchService,
        PipelinesService,
        ReportingService,
        AuditLogInterceptor,
    ],
})
export class CRMModule { }
