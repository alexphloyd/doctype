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
import { CvStrictSchema } from 'core/dist-cjs/src/domain/cv/validation';
import { z } from 'zod';
import { DBService } from '~/infrastructure/db/db.service';

@Controller('cv')
export class CvController {
    constructor(private db: DBService) {}

    @Post('create')
    @UseGuards(RoleGuard)
    @Roles('USER')
    @UsePipes(new ZodValidationPipe(CvStrictSchema))
    async create(@Body() body: z.infer<typeof CvStrictSchema>) {
        const created = await this.db.cv.create({
            data: body,
        });
        return {
            ok: true,
            message: 'CV successfully created',
            createdId: created.id,
        };
    }

    @Get('get')
    @UseGuards(RoleGuard)
    @Roles('USER')
    async get() {
        const items = await this.db.cv.findMany();
        return {
            ok: true,
            items,
        };
    }
}
