import { ModelState } from './types';

export const initialState: ModelState = {
    list: [],
    effects: {
        getMany: {
            status: 'idle',
            firstExecution: true,
        },
        create: {
            status: 'idle',
            firstExecution: true,
        },
    },
};
