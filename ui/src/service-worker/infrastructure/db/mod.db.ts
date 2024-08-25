import { type User } from '@prisma/client';
import { type Document } from 'core/src/domain/document/types';
import { generateId } from 'core/src/infrastructure/lib/generate-id';
import dayjs from 'dayjs';
import Dexie from 'dexie';

import { type ParsedRequest } from '../lib/request.parser';

export class LocalDB extends Dexie {
  private static self?: LocalDB;
  public static async getConnection() {
    if (!LocalDB.self) {
      const single = new LocalDB();
      LocalDB.self = single;

      await single.open();
    }

    return LocalDB.self!;
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

    this.document.add({
      id: generateId(),
      lastUpdatedTime: dayjs().toString(),
      name: 'Issue: ~demo',
    });
  }
}
