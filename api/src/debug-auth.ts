
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('debug.log', msg + '\n');
}

async function bootstrap() {
    fs.writeFileSync('debug.log', 'Starting debug process...\n');
    log('Starting debug process...');
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const email = 'admin@mathionixcrm.com';

    log(`Checking user: ${email}`);
    try {
        const user = await usersService.findOne(email);
        if (!user) {
            log('User NOT found!');
        } else {
            log(`User found: ${user._id}`);

            const role = user.roleId as any;
            if (role) {
                log(`Role Name: ${role.name}`);
                log(`Role ID: ${role._id}`);
                log(`Permissions count: ${role.permissions?.length || 0}`);
                if (role.permissions) {
                    log(`Permissions: ${JSON.stringify(role.permissions.map((p: any) => p.name))}`);
                }
            } else {
                log('Role not populated or missing!');
            }
        }
    } catch (e) {
        log(`Error: ${e}`);
    }

    await app.close();
    process.exit(0);
}

bootstrap();
