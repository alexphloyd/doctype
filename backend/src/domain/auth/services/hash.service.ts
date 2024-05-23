import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    private saltRounds = 10;

    async hash(textToHash: string) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashedText = await bcrypt.hash(textToHash, salt);
        return hashedText;
    }

    async compare(plainText: string, hashedText: string) {
        return await bcrypt.compare(plainText, hashedText);
    }
}
