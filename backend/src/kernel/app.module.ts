import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '~/application/auth/auth.module';
import { RoleGuard } from '~/application/auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { DocumentModule } from '~/application/document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    DocumentModule,
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
