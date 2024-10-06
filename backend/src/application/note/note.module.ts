import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { AuthModule } from '../auth/auth.module';
import { DBService } from '~/infrastructure/db/db.service';

@Module({
  imports: [AuthModule],
  controllers: [NoteController],
  providers: [DBService],
})
export class NoteModule {}
