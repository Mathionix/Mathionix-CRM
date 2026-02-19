import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('knowledge-base')
@UseGuards(JwtAuthGuard, RbacGuard)
export class KnowledgeBaseController {
    constructor(private readonly knowledgeBaseService: KnowledgeBaseService) { }

    @Get('categories')
    findAllCategories() {
        return this.knowledgeBaseService.findAllCategories();
    }

    @Post('categories')
    @Permissions('settings:write')
    createCategory(@Body() data: any) {
        return this.knowledgeBaseService.createCategory(data);
    }

    @Get('articles')
    findAllArticles(@Query() query: any) {
        return this.knowledgeBaseService.findAllArticles(query);
    }

    @Get('articles/:id')
    findOneArticle(@Param('id') id: string) {
        return this.knowledgeBaseService.findOneArticle(id);
    }

    @Post('articles')
    @Permissions('settings:write')
    createArticle(@Request() req: any, @Body() data: any) {
        return this.knowledgeBaseService.createArticle({ ...data, author: req.user.userId });
    }

    @Put('articles/:id')
    @Permissions('settings:write')
    updateArticle(@Param('id') id: string, @Body() data: any) {
        return this.knowledgeBaseService.updateArticle(id, data);
    }

    @Delete('articles/:id')
    @Permissions('settings:write')
    deleteArticle(@Param('id') id: string) {
        return this.knowledgeBaseService.deleteArticle(id);
    }
}
