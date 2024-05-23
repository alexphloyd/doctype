import { Controller, Post, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('cv')
export class CvController {
    constructor() {}

    @Post('create')
    @UseGuards(RoleGuard)
    @Roles('USER')
    async create() {
        return { ok: true, message: 'CV successfully created' };
    }
}
