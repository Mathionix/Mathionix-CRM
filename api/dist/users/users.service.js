"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const role_schema_1 = require("./schemas/role.schema");
const permission_schema_1 = require("./schemas/permission.schema");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userModel;
    roleModel;
    permissionModel;
    constructor(userModel, roleModel, permissionModel) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.permissionModel = permissionModel;
    }
    async findOne(email) {
        const user = await this.userModel.findOne({ email })
            .populate({
            path: 'roleId',
            populate: { path: 'permissions' }
        })
            .exec();
        return user || undefined;
    }
    async findById(id) {
        const user = await this.userModel.findById(id)
            .populate({
            path: 'roleId',
            populate: { path: 'permissions' }
        })
            .exec();
        return user || undefined;
    }
    async findAll() {
        return this.userModel.find()
            .populate('roleId')
            .exec();
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }
    async delete(id) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async findAllRoles() {
        return this.roleModel.find().populate('permissions').exec();
    }
    async findRoleById(id) {
        return this.roleModel.findById(id).populate('permissions').exec();
    }
    async updateRole(id, roleDto) {
        return this.roleModel.findByIdAndUpdate(id, roleDto, { new: true }).exec();
    }
    async deleteRole(id) {
        return this.roleModel.findByIdAndDelete(id).exec();
    }
    async createRole(roleDto) {
        return new this.roleModel(roleDto).save();
    }
    async inviteUser(email, roleId) {
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
    async findAllPermissions() {
        return this.permissionModel.find().exec();
    }
    async createPermission(permissionDto) {
        return new this.permissionModel(permissionDto).save();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __param(2, (0, mongoose_1.InjectModel)(permission_schema_1.Permission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map