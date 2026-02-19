import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { UserConfig, UserConfigSchema } from './schemas/user-config.schema';
import { UserConfigController } from './user-config.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: UserConfig.name, schema: UserConfigSchema },
        ])
    ],
    controllers: [UsersController, UserConfigController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
