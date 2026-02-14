"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = 'admin@mathionix.crm';
    const existingUser = await usersService.findOne(adminEmail);
    if (!existingUser) {
        await usersService.create({
            email: adminEmail,
            password: 'password',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
        });
        console.log('Admin user created successfully');
    }
    else {
        console.log('Admin user already exists');
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map