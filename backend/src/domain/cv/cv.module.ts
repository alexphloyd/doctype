import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [CvController],
    providers: [],
})
export class CvModule {}
