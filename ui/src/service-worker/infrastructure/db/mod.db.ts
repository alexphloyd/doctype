import { type User } from '@prisma/client';
import { type Document } from 'core/src/domain/document/types';
import Dexie from 'dexie';

import { type ParsedRequest } from '../lib/request.parser';

export class MainDB extends Dexie {
    private static self?: MainDB;
    public static async getConnection() {
        if (!MainDB.self) {
            const single = new MainDB();
            MainDB.self = single;

            await single.open();
        }

        return MainDB.self!;
    }

    document!: Dexie.Table<Document, string>;

    networkSchedulerRequest!: Dexie.Table<{ id: string; req: ParsedRequest }, string>;
    authTokens!: Dexie.Table<{ id: 'singleton'; access: string; refresh: string }, string>;

    session!: Dexie.Table<{ id: 'singleton'; current: User }>;

    private constructor() {
        super('main_db');

        this.version(1).stores({
            document: '&id, userId, lastUpdatedTime, name',

            networkSchedulerRequest: '&id, req',
            authTokens: '&id, access, refresh',

            session: '&id, current',
        });
    }
}
