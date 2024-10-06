import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '~/application/auth/auth.module';
import { RoleGuard } from '~/application/auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { NoteModule } from '~/application/note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
