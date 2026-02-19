"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    console.log('Starting seed process...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    console.log('Seeding permissions...');
    const permissions = [
        { name: 'leads:read', description: 'View leads', module: 'CRM' },
        { name: 'leads:write', description: 'Create and edit leads', module: 'CRM' },
        { name: 'leads:delete', description: 'Delete leads', module: 'CRM' },
        { name: 'deals:read', description: 'View deals', module: 'CRM' },
        { name: 'deals:write', description: 'Create and edit deals', module: 'CRM' },
        { name: 'contacts:read', description: 'View contacts', module: 'CRM' },
        { name: 'contacts:write', description: 'Create and edit contacts', module: 'CRM' },
        { name: 'orgs:read', description: 'View organizations', module: 'CRM' },
        { name: 'orgs:write', description: 'Create and edit organizations', module: 'CRM' },
        { name: 'activities:read', description: 'View activity timeline', module: 'CRM' },
        { name: 'activities:write', description: 'Post comments and tasks', module: 'CRM' },
        { name: 'settings:admin', description: 'Manage users, roles and workspace settings', module: 'Settings' },
        { name: 'dashboard:read', description: 'View dashboard and reports', module: 'CRM' },
    ];
    const createdPermissions = [];
    for (const p of permissions) {
        try {
            const existing = await usersService.findAllPermissions();
            const found = existing.find(ep => ep.name === p.name);
            if (!found) {
                const cp = await usersService.createPermission(p);
                createdPermissions.push(cp);
                console.log(`[Permission] Created: ${p.name}`);
            }
            else {
                createdPermissions.push(found);
                console.log(`[Permission] Exists: ${p.name}`);
            }
        }
        catch (e) {
            console.error(`[Permission] Error creating ${p.name}:`, e.message);
        }
    }
    console.log('Seeding roles...');
    const roles = [
        {
            name: 'Admin',
            description: 'Full system access',
            isSystem: true,
            permissions: createdPermissions.map(p => p._id)
        },
        {
            name: 'Sales Manager',
            description: 'Can manage all CRM data but no settings',
            isSystem: false,
            permissions: createdPermissions.filter(p => p.module === 'CRM').map(p => p._id)
        },
        {
            name: 'Sales Representative',
            description: 'Can view and edit CRM data',
            isSystem: false,
            permissions: createdPermissions.filter(p => p.name.includes(':read') || p.name === 'activities:write').map(p => p._id)
        }
    ];
    const createdRoles = [];
    for (const r of roles) {
        try {
            const existing = await usersService.findAllRoles();
            const found = existing.find(er => er.name === r.name);
            if (!found) {
                const cr = await usersService.createRole(r);
                createdRoles.push(cr);
                console.log(`[Role] Created: ${r.name}`);
            }
            else {
                createdRoles.push(found);
                console.log(`[Role] Exists: ${r.name}`);
            }
        }
        catch (e) {
            console.error(`[Role] Error creating ${r.name}:`, e.message);
        }
    }
    console.log('Seeding admin user...');
    const adminEmail = 'admin@mathionixcrm.com';
    const adminRole = createdRoles.find(r => r.name === 'Admin');
    try {
        const existingUser = await usersService.findOne(adminEmail);
        if (!existingUser) {
            await usersService.create({
                email: adminEmail,
                password: 'pass123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'administrator',
                roleId: adminRole?._id,
                isActive: true
            });
            console.log('[User] Admin created successfully');
        }
        else {
            if (!existingUser.roleId) {
                await usersService.update(existingUser._id, { roleId: adminRole?._id });
                console.log('[User] Admin roleId updated');
            }
            console.log('[User] Admin already exists');
        }
    }
    catch (e) {
        console.error(`[User] Error seeding admin:`, e.message);
    }
    console.log('Seed completed successfully!');
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed.js.map