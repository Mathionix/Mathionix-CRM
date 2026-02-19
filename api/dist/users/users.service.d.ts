import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { RoleDocument } from './schemas/role.schema';
import { PermissionDocument } from './schemas/permission.schema';
export declare class UsersService {
    private userModel;
    private roleModel;
    private permissionModel;
    constructor(userModel: Model<UserDocument>, roleModel: Model<RoleDocument>, permissionModel: Model<PermissionDocument>);
    findOne(email: string): Promise<UserDocument | undefined>;
    findById(id: string): Promise<UserDocument | undefined>;
    findAll(): Promise<UserDocument[]>;
    create(createUserDto: any): Promise<UserDocument>;
    update(id: string, updateUserDto: any): Promise<UserDocument | null>;
    delete(id: string): Promise<any>;
    findAllRoles(): Promise<RoleDocument[]>;
    findRoleById(id: string): Promise<RoleDocument | null>;
    updateRole(id: string, roleDto: any): Promise<RoleDocument | null>;
    deleteRole(id: string): Promise<any>;
    createRole(roleDto: any): Promise<RoleDocument>;
    inviteUser(email: string, roleId: string): Promise<UserDocument>;
    findAllPermissions(): Promise<PermissionDocument[]>;
    createPermission(permissionDto: any): Promise<PermissionDocument>;
}
