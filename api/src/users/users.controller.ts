import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Permissions('settings:admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @Permissions('settings:admin')
    create(@Body() dto: any) {
        return this.usersService.create(dto);
    }

    // static routes first
    @Get('roles')
    @Permissions('settings:admin')
    findAllRoles() {
        return this.usersService.findAllRoles();
    }

    @Get('permissions')
    @Permissions('settings:admin')
    findAllPermissions() {
        return this.usersService.findAllPermissions();
    }

    @Get(':id')
    @Permissions('settings:admin')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @Permissions('settings:admin')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Permissions('settings:admin')
    remove(@Param('id') id: string) {
        return this.usersService.delete(id);
    }

    // Role Management
    @Post('roles')
    @Permissions('settings:admin')
    createRole(@Body() dto: any) {
        return this.usersService.createRole(dto);
    }

    @Put('roles/:id')
    @Permissions('settings:admin')
    updateRole(@Param('id') id: string, @Body() dto: any) {
        return this.usersService.updateRole(id, dto);
    }

    @Delete('roles/:id')
    @Permissions('settings:admin')
    deleteRole(@Param('id') id: string) {
        return this.usersService.deleteRole(id);
    }

    @Post('invite')
    @Permissions('settings:admin')
    inviteMember(@Body() body: { email: string, roleId: string }) {
        return this.usersService.inviteUser(body.email, body.roleId);
    }


    @Post('permissions')
    @Permissions('settings:admin')
    createPermission(@Body() dto: any) {
        return this.usersService.createPermission(dto);
    }
}
