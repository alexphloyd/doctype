import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { ZodValidationPipe } from '~/kernel/pipes/zod.validation.pipe';
import { DocumentStrictSchema } from 'core/dist-cjs/src/domain/document/validation';
import { z } from 'zod';
import { DBService } from '~/infrastructure/db/db.service';
import { AuthService } from '../auth/services/auth.service';
import { Request } from 'express';
import dayjs from 'dayjs';

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
        lastUpdatedTime: true,
      })
    )
  )
  async rename(
    @Body()
    body: Pick<
      z.infer<typeof DocumentStrictSchema>,
      'id' | 'name' | 'lastUpdatedTime'
    >,
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
          lastUpdatedTime: body.lastUpdatedTime,
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

  @Post('updateSource')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      DocumentStrictSchema.pick({
        id: true,
        source: true,
        lastUpdatedTime: true,
      })
    )
  )
  async updateSource(
    @Body()
    body: Pick<
      z.infer<typeof DocumentStrictSchema>,
      'id' | 'source' | 'lastUpdatedTime'
    >,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const existed = await this.db.document.findFirst({
      where: {
        id: body.id,
      },
    });
    if (!existed) {
      throw new HttpException('Document not found', HttpStatus.CONFLICT);
    }

    const isOutdated = dayjs(existed.lastUpdatedTime).isAfter(
      body.lastUpdatedTime
    );
    if (isOutdated) {
      throw new HttpException('Outdated payload', HttpStatus.CONFLICT);
    }

    const updated = await this.db.document
      .update({
        where: {
          id: body.id,
          userId: reqSession?.sub,
        },
        data: {
          source: body.source,
          lastUpdatedTime: body.lastUpdatedTime,
        },
      })
      .catch((err) => {
        throw new HttpException(err?.meta?.cause, HttpStatus.CONFLICT);
      });

    return {
      ok: Boolean(updated),
      message: updated && 'Document Source successfully updated',
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
