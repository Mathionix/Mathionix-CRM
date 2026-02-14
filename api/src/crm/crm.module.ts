import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CRMController } from './crm.controller';
import { CRMService } from './crm.service';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { Deal, DealSchema } from './schemas/deal.schema';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { Activity, ActivitySchema } from './schemas/activity.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Lead.name, schema: LeadSchema },
            { name: Deal.name, schema: DealSchema },
            { name: Organization.name, schema: OrganizationSchema },
            { name: Contact.name, schema: ContactSchema },
            { name: Activity.name, schema: ActivitySchema },
        ]),
    ],
    controllers: [CRMController],
    providers: [CRMService],
    exports: [CRMService],
})
export class CRMModule { }
