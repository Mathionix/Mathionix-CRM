import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./schemas/user.schema").UserDocument[]>;
    create(dto: any): Promise<import("./schemas/user.schema").UserDocument>;
    findAllRoles(): Promise<import("./schemas/role.schema").RoleDocument[]>;
    findAllPermissions(): Promise<import("./schemas/permission.schema").PermissionDocument[]>;
    findOne(id: string): Promise<import("./schemas/user.schema").UserDocument | undefined>;
    update(id: string, dto: any): Promise<import("./schemas/user.schema").UserDocument | null>;
    remove(id: string): Promise<any>;
    createRole(dto: any): Promise<import("./schemas/role.schema").RoleDocument>;
    updateRole(id: string, dto: any): Promise<import("./schemas/role.schema").RoleDocument | null>;
    deleteRole(id: string): Promise<any>;
    inviteMember(body: {
        email: string;
        roleId: string;
    }): Promise<import("./schemas/user.schema").UserDocument>;
    createPermission(dto: any): Promise<import("./schemas/permission.schema").PermissionDocument>;
}
