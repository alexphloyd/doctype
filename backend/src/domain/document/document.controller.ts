import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { ZodValidationPipe } from '~/application/pipes/zod.validation.pipe';
import { DocumentStrictSchema } from 'core/dist-cjs/src/domain/document/validation';
import { z } from 'zod';
import { DBService } from '~/infrastructure/db/db.service';
import { AuthService } from '../auth/services/auth.service';
import { Request } from 'express';

@Controller('document')
export class DocumentController {
  constructor(
    private db: DBService,
    private authService: AuthService
  ) {}

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
  async get(@Req() req: Request) {
    const reqSession = await this.authService.extractReqSession(req);
    const items = await this.db.document.findMany({
      where: {
        userId: reqSession?.sub,
      },
    });

    return {
      ok: true,
      items,
    };
  }

  @Post('rename')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      DocumentStrictSchema.pick({
        id: true,
        name: true,
      })
    )
  )
  async rename(
    @Body()
    body: Pick<z.infer<typeof DocumentStrictSchema>, 'id' | 'name'>,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const renamed = await this.db.document
      .update({
        where: {
          id: body.id,
          userId: reqSession?.sub,
        },
        data: {
          name: body.name,
        },
      })
      .catch((err) => {
        throw new HttpException(err?.meta?.cause, HttpStatus.CONFLICT);
      });

    return {
      ok: Boolean(renamed),
      message: renamed && 'Document successfully renamed',
    };
  }

  @Post('remove')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      DocumentStrictSchema.pick({
        id: true,
      })
    )
  )
  async remove(
    @Body()
    body: Pick<z.infer<typeof DocumentStrictSchema>, 'id'>,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const deleted = await this.db.document.delete({
      where: {
        id: body?.id,
        userId: reqSession?.sub,
      },
    });

    return {
      ok: Boolean(deleted),
      message: deleted && 'Document deleted',
    };
  }
}
