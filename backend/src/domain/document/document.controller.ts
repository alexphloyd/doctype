import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { ZodValidationPipe } from '~/application/pipes/zod.validation.pipe';
import { DocumentStrictSchema } from 'core/dist-cjs/src/domain/document/validation';
import { z } from 'zod';
import { DBService } from '~/infrastructure/db/db.service';

@Controller('document')
export class DocumentController {
    constructor(private db: DBService) {}

    @Post('create')
    @UseGuards(RoleGuard)
    @Roles('USER')
    @UsePipes(new ZodValidationPipe(DocumentStrictSchema))
    async create(@Body() body: z.infer<typeof DocumentStrictSchema>) {
        const created = await this.db.document.create({
            data: body,
        });
        return {
            ok: true,
            message: 'Document successfully created',
            createdId: created.id,
        };
    }

    @Get('get')
    @UseGuards(RoleGuard)
    @Roles('USER')
    async get() {
        const items = await this.db.document.findMany();
        return {
            ok: true,
            items,
        };
    }
}
