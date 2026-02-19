"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("../users/users.module");
const crm_controller_1 = require("./crm.controller");
const crm_service_1 = require("./crm.service");
const lead_schema_1 = require("./schemas/lead.schema");
const deal_schema_1 = require("./schemas/deal.schema");
const organization_schema_1 = require("./schemas/organization.schema");
const contact_schema_1 = require("./schemas/contact.schema");
const activity_schema_1 = require("./schemas/activity.schema");
const custom_field_schema_1 = require("./schemas/custom-field.schema");
const custom_fields_service_1 = require("./custom-fields.service");
const custom_fields_controller_1 = require("./custom-fields.controller");
const column_preference_schema_1 = require("./schemas/column-preference.schema");
const column_preferences_service_1 = require("./column-preferences.service");
const column_preferences_controller_1 = require("./column-preferences.controller");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
const audit_log_interceptor_1 = require("./audit-log.interceptor");
const core_1 = require("@nestjs/core");
const audit_log_service_1 = require("./audit-log.service");
const audit_log_controller_1 = require("./audit-log.controller");
const knowledge_category_schema_1 = require("./schemas/knowledge-category.schema");
const knowledge_article_schema_1 = require("./schemas/knowledge-article.schema");
const knowledge_base_service_1 = require("./knowledge-base.service");
const knowledge_base_controller_1 = require("./knowledge-base.controller");
const email_template_schema_1 = require("./schemas/email-template.schema");
const email_templates_service_1 = require("./email-templates.service");
const email_templates_controller_1 = require("./email-templates.controller");
const email_schema_1 = require("./schemas/email.schema");
const email_communication_service_1 = require("./email-communication.service");
const email_communication_controller_1 = require("./email-communication.controller");
const integration_schema_1 = require("./schemas/integration.schema");
const teams_integration_service_1 = require("./teams-integration.service");
const integrations_controller_1 = require("./integrations.controller");
const payment_term_schema_1 = require("./schemas/payment-term.schema");
const payment_terms_controller_1 = require("./payment-terms.controller");
const payment_terms_service_1 = require("./payment-terms.service");
const portal_controller_1 = require("./portal.controller");
const client_schema_1 = require("./schemas/client.schema");
const clients_service_1 = require("./clients.service");
const global_search_service_1 = require("./global-search.service");
const clients_controller_1 = require("./clients.controller");
const pipeline_schema_1 = require("./schemas/pipeline.schema");
const pipelines_service_1 = require("./pipelines.service");
const reporting_service_1 = require("./reporting.service");
const pipeline_controller_1 = require("./pipeline.controller");
let CRMModule = class CRMModule {
};
exports.CRMModule = CRMModule;
exports.CRMModule = CRMModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
                { name: deal_schema_1.Deal.name, schema: deal_schema_1.DealSchema },
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema },
                { name: contact_schema_1.Contact.name, schema: contact_schema_1.ContactSchema },
                { name: activity_schema_1.Activity.name, schema: activity_schema_1.ActivitySchema },
                { name: custom_field_schema_1.CustomField.name, schema: custom_field_schema_1.CustomFieldSchema },
                { name: column_preference_schema_1.ColumnPreference.name, schema: column_preference_schema_1.ColumnPreferenceSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: knowledge_category_schema_1.KnowledgeCategory.name, schema: knowledge_category_schema_1.KnowledgeCategorySchema },
                { name: knowledge_article_schema_1.KnowledgeArticle.name, schema: knowledge_article_schema_1.KnowledgeArticleSchema },
                { name: email_template_schema_1.EmailTemplate.name, schema: email_template_schema_1.EmailTemplateSchema },
                { name: email_schema_1.Email.name, schema: email_schema_1.EmailSchema },
                { name: integration_schema_1.Integration.name, schema: integration_schema_1.IntegrationSchema },
                { name: client_schema_1.Client.name, schema: client_schema_1.ClientSchema },
                { name: payment_term_schema_1.PaymentTerm.name, schema: payment_term_schema_1.PaymentTermSchema },
                { name: pipeline_schema_1.Pipeline.name, schema: pipeline_schema_1.PipelineSchema },
            ]),
            users_module_1.UsersModule,
        ],
        controllers: [
            crm_controller_1.CRMController,
            clients_controller_1.ClientsController,
            column_preferences_controller_1.ColumnPreferencesController,
            custom_fields_controller_1.CustomFieldsController,
            email_communication_controller_1.EmailCommunicationController,
            email_templates_controller_1.EmailTemplatesController,
            audit_log_controller_1.AuditLogController,
            integrations_controller_1.IntegrationsController,
            knowledge_base_controller_1.KnowledgeBaseController,
            pipeline_controller_1.PipelineController,
            payment_terms_controller_1.PaymentTermsController,
            portal_controller_1.PortalController
        ],
        providers: [
            crm_service_1.CRMService,
            audit_log_service_1.AuditLogService,
            column_preferences_service_1.ColumnPreferencesService,
            custom_fields_service_1.CustomFieldsService,
            email_communication_service_1.EmailCommunicationService,
            email_templates_service_1.EmailTemplatesService,
            global_search_service_1.GlobalSearchService,
            knowledge_base_service_1.KnowledgeBaseService,
            pipelines_service_1.PipelinesService,
            reporting_service_1.ReportingService,
            teams_integration_service_1.TeamsIntegrationService,
            clients_service_1.ClientsService,
            payment_terms_service_1.PaymentTermsService,
            audit_log_interceptor_1.AuditLogInterceptor,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
        ],
        exports: [
            crm_service_1.CRMService,
            audit_log_service_1.AuditLogService,
            column_preferences_service_1.ColumnPreferencesService,
            custom_fields_service_1.CustomFieldsService,
            clients_service_1.ClientsService,
            email_templates_service_1.EmailTemplatesService,
            email_communication_service_1.EmailCommunicationService,
            teams_integration_service_1.TeamsIntegrationService,
            global_search_service_1.GlobalSearchService,
            pipelines_service_1.PipelinesService,
            reporting_service_1.ReportingService,
            audit_log_interceptor_1.AuditLogInterceptor,
        ],
    })
], CRMModule);
//# sourceMappingURL=crm.module.js.map