import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
    console.log('Starting seed process...');
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    console.log('Seeding permissions...');
    const permissions = [
        // Leads
        { name: 'leads:read', description: 'View leads', module: 'CRM' },
        { name: 'leads:write', description: 'Create and edit leads', module: 'CRM' },
        { name: 'leads:delete', description: 'Delete leads', module: 'CRM' },
        // Deals
        { name: 'deals:read', description: 'View deals', module: 'CRM' },
        { name: 'deals:write', description: 'Create and edit deals', module: 'CRM' },
        // Contacts
        { name: 'contacts:read', description: 'View contacts', module: 'CRM' },
        { name: 'contacts:write', description: 'Create and edit contacts', module: 'CRM' },
        // Organizations
        { name: 'organizations:read', description: 'View organizations', module: 'CRM' },
        { name: 'organizations:write', description: 'Create and edit organizations', module: 'CRM' },
        // Clients
        { name: 'clients:read', description: 'View clients', module: 'CRM' },
        { name: 'clients:write', description: 'Create and edit clients', module: 'CRM' },
        // Activities
        { name: 'activities:read', description: 'View activity timeline', module: 'CRM' },
        { name: 'activities:write', description: 'Post comments and tasks', module: 'CRM' },
        // Settings
        { name: 'settings:admin', description: 'Manage users, roles and workspace settings', module: 'Settings' },
        { name: 'settings:write', description: 'Manage workspace configuration', module: 'Settings' },
        { name: 'dashboard:read', description: 'View dashboard', module: 'CRM' },
        { name: 'reports:read', description: 'View reports', module: 'CRM' },
    ];

    const createdPermissions: any[] = [];
    for (const p of permissions) {
        try {
            const existing = await usersService.findAllPermissions();
            const found = (existing as any[]).find(ep => ep.name === p.name);
            if (!found) {
                const cp = await usersService.createPermission(p);
                createdPermissions.push(cp);
                console.log(`[Permission] Created: ${p.name}`);
            } else {
                createdPermissions.push(found);
                console.log(`[Permission] Exists: ${p.name}`);
            }
        } catch (e: any) {
            console.error(`[Permission] Error creating ${p.name}:`, e.message);
        }
    }

    console.log('Seeding roles...');
    const roles = [
        {
            name: 'Admin',
            description: 'Full system access',
            isSystem: true,
            permissions: createdPermissions.map(p => (p as any)._id)
        },
        {
            name: 'Sales Manager',
            description: 'Can manage all CRM data but no settings',
            isSystem: false,
            permissions: createdPermissions.filter(p => [
                'leads:read', 'leads:write', 'leads:delete',
                'deals:read', 'deals:write',
                'organizations:read', 'organizations:write',
                'contacts:read', 'contacts:write',
                'clients:read', 'clients:write',
                'activities:read', 'activities:write',
                'dashboard:read', 'reports:read'
            ].includes((p as any).name)).map(p => (p as any)._id)
        },
        {
            name: 'Sales Representative',
            description: 'Can view and edit CRM data',
            isSystem: false,
            permissions: createdPermissions.filter(p => (p as any).name.includes(':read') || (p as any).name === 'activities:write').map(p => (p as any)._id)
        }
    ];

    const createdRoles: any[] = [];
    for (const r of roles) {
        try {
            const existing = await usersService.findAllRoles();
            const found = (existing as any[]).find(er => er.name === r.name);
            if (!found) {
                const cr = await usersService.createRole(r);
                createdRoles.push(cr);
                console.log(`[Role] Created: ${r.name}`);
            } else {
                // Update existing role with new permissions
                await (usersService as any).updateRole((found as any)._id, {
                    description: r.description,
                    permissions: r.permissions
                });
                createdRoles.push(found);
                console.log(`[Role] Updated permissions for: ${r.name}`);
            }
        } catch (e: any) {
            console.error(`[Role] Error creating ${r.name}:`, e.message);
        }
    }

    console.log('Seeding admin user...');
    const adminEmail = 'admin@mathionixcrm.com';
    const adminRole = createdRoles.find(r => r.name === 'Admin');

    try {
        const existingUser = await usersService.findOne(adminEmail);
        if (!existingUser) {
            await (usersService as any).create({
                email: adminEmail,
                password: 'pass123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'administrator',
                roleId: (adminRole as any)?._id,
                isActive: true
            });
            console.log('[User] Admin created successfully');
        } else {
            if (!(existingUser as any).roleId) {
                await (usersService as any).update((existingUser as any)._id, { roleId: (adminRole as any)?._id });
                console.log('[User] Admin roleId updated');
            }
            console.log('[User] Admin already exists');
        }
    } catch (e: any) {
        console.error(`[User] Error seeding admin:`, e.message);
    }

    console.log('Aggressively cleaning up corrupted data...');
    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection;
        const collections = ['clients', 'contacts', 'leads', 'deals', 'users'];
        const fields = ['organization', 'roleId', 'lead', 'client'];

        for (const col of collections) {
            for (const field of fields) {
                const res = await db.collection(col).updateMany(
                    { [field]: "" },
                    { $unset: { [field]: 1 } }
                );
                if (res.modifiedCount > 0) {
                    console.log(`[Cleanup] Fixed ${res.modifiedCount} documents in "${col}" (field: ${field})`);
                }
            }
        }
    } catch (e: any) {
        console.log('[Cleanup] Error during aggressive scrubbing:', e.message);
    }

    console.log('Seed completed successfully!');
    await app.close();
    process.exit(0);
}

bootstrap();
