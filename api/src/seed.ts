import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@mathionix.crm';
    const existingUser = await usersService.findOne(adminEmail);

    if (!existingUser) {
        await usersService.create({
            email: adminEmail,
            password: 'password', // In a real app, use env var or strong password
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
        });
        console.log('Admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }

    await app.close();
}
bootstrap();
