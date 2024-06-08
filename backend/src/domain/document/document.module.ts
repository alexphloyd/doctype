import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { AuthModule } from '../auth/auth.module';
import { DBService } from '~/infrastructure/db/db.service';

@Module({
    imports: [AuthModule],
    controllers: [DocumentController],
    providers: [DBService],
})
export class DocumentModule {}
