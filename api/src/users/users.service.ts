import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Role, RoleDocument } from './schemas/role.schema';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    async findOne(email: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findOne({ email })
            .populate({
                path: 'roleId',
                populate: { path: 'permissions' }
            })
            .exec();
        return user || undefined;
    }

    async findById(id: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findById(id)
            .populate({
                path: 'roleId',
                populate: { path: 'permissions' }
            })
            .exec();
        return user || undefined;
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find()
            .populate('roleId')
            .exec();
    }

    async create(createUserDto: any): Promise<UserDocument> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }

    async update(id: string, updateUserDto: any): Promise<UserDocument | null> {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    // Role Methods
    async findAllRoles(): Promise<RoleDocument[]> {
        return this.roleModel.find().populate('permissions').exec();
    }

    async findRoleById(id: string): Promise<RoleDocument | null> {
        return this.roleModel.findById(id).populate('permissions').exec();
    }

    async updateRole(id: string, roleDto: any): Promise<RoleDocument | null> {
        return this.roleModel.findByIdAndUpdate(id, roleDto, { new: true }).exec();
    }

    async deleteRole(id: string): Promise<any> {
        return this.roleModel.findByIdAndDelete(id).exec();
    }

    async createRole(roleDto: any): Promise<RoleDocument> {
        return new this.roleModel(roleDto).save();
    }

    async inviteUser(email: string, roleId: string): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new Error('User already exists');
        }

        const inviteToken = Math.random().toString(36).substring(2, 15);
        const inviteExpiry = new Date();
        inviteExpiry.setHours(inviteExpiry.getHours() + 48);

        const newUser = new this.userModel({
            email,
            roleId,
            isActive: false,
            inviteToken,
            inviteExpiry,
            password: await bcrypt.hash(Math.random().toString(36), 10)
        });

        return newUser.save();
    }

    // Permission Methods
    async findAllPermissions(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec();
    }

    async createPermission(permissionDto: any): Promise<PermissionDocument> {
        return new this.permissionModel(permissionDto).save();
    }
}
