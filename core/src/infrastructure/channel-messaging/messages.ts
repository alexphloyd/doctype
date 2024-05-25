import { User } from '@prisma/client';

export const MESSAGES = {
    NETWORK_STATE_CHANGED: 'NETWORK_STATE_CHANGED',
    CLAIM_UNATTACHED_CVS_WITH_USER_ID: 'CLAIM_UNATTACHED_CVS_WITH_USER_ID',

    LOGOUT: 'LOGOUT',
} as const;

export const messageBuilder = {
    NETWORK_STATE_CHANGED: (state: 'online' | 'offline') => {
        return {
            type: 'NETWORK_STATE_CHANGED',
            info: {
                state,
            },
        };
    },
    CLAIM_UNATTACHED_CVS_WITH_USER_ID: ({ userId }: { userId: User['id'] }) => {
        return {
            type: 'CLAIM_UNATTACHED_CVS_WITH_USER_ID',
            info: {
                userId,
            },
        };
    },
    LOGOUT: () => {
        return {
            type: 'LOGOUT',
            info: null,
        };
    },
} satisfies Record<
    keyof typeof MESSAGES,
    (args: any) => {
        type: keyof typeof MESSAGES;
        info: object | null;
    }
>;

export type MessageInfo<T extends keyof typeof MESSAGES> = ReturnType<
    (typeof messageBuilder)[T]
>['info'];
