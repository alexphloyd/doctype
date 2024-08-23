import { Module } from '@nestjs/common';
import { HashService } from '~/domain/auth/services/hash.service';
import { VerificationService } from '~/domain/auth/services/verification.service';
import { MailModule } from '~/infrastructure/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '~/domain/user/user.module';
import { DBService } from '~/infrastructure/db/db.service';
import { AuthService } from '~/domain/auth/services/auth.service';
import { AuthController } from './controller/auth.controller';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('AUTH_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    VerificationService,
    DBService,
    RoleGuard,
  ],
  exports: [JwtModule, RoleGuard, HashService, AuthService],
})
export class AuthModule {}
