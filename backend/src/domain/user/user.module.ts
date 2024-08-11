import { Module } from '@nestjs/common';
import { DBService } from '~/infrastructure/db/db.service';
import { UserRepository } from '~/domain/user/services/user.repository';

@Module({
  providers: [DBService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
