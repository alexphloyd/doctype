import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { AuthModule } from '../auth/auth.module';
import { DBService } from '~/infrastructure/db/db.service';

@Module({
    imports: [AuthModule],
    controllers: [CvController],
    providers: [DBService],
})
export class CvModule {}
