import { type AxiosRequestConfig } from 'axios';
import { type Cv } from 'core/src/domain/cv/types/main';
import Dexie from 'dexie';

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

    cv!: Dexie.Table<Cv, string>;

    networkSchedulerRequest!: Dexie.Table<{ id: string; config: AxiosRequestConfig }, string>;
    authTokens!: Dexie.Table<{ id: string; access: string; refresh: string }, string>;

    private constructor() {
        super('main_db');

        this.version(1).stores({
            cv: '&id, userId, creationDate, title',
            networkSchedulerRequest: '&id, config',
            authTokens: '$id, access, refresh',
        });
    }
}
