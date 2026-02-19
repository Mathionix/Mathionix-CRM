
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

async function audit() {
    console.log('--- Database Audit ---');
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection;

        console.log('Checking "clients" collection...');
        const clients = await db.collection('clients').find({}).toArray();
        let clientIssues = 0;

        for (const client of clients) {
            if (client.organization === "") {
                console.log(`[Issue] Client ${client.name} (${client._id}) has empty string organization`);
                clientIssues++;
            } else if (client.organization && typeof client.organization === 'string' && client.organization.length !== 24) {
                console.log(`[Issue] Client ${client.name} (${client._id}) has invalid organization string: "${client.organization}"`);
                clientIssues++;
            }
        }

        console.log(`Summary: Found ${clientIssues} issues in clients.`);

        console.log('Checking "contacts" collection...');
        const contacts = await db.collection('contacts').find({}).toArray();
        let contactIssues = 0;

        for (const contact of contacts) {
            if (contact.organization === "") {
                console.log(`[Issue] Contact ${contact.firstName} (${contact._id}) has empty string organization`);
                contactIssues++;
            }
        }
        console.log(`Summary: Found ${contactIssues} issues in contacts.`);

        if (clientIssues > 0 || contactIssues > 0) {
            console.log('Attempting cleanup...');
            const clientRes = await db.collection('clients').updateMany(
                { organization: "" },
                { $unset: { organization: 1 } }
            );
            const contactRes = await db.collection('contacts').updateMany(
                { organization: "" },
                { $unset: { organization: 1 } }
            );
            console.log(`Cleaned up ${clientRes.modifiedCount} clients and ${contactRes.modifiedCount} contacts.`);
        }

    } catch (e) {
        console.error('Audit failed:', e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

audit();
