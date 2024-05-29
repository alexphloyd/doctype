import { type ModelState } from './types';

export const initialState: ModelState = {
    list: [],
    effects: {
        getLocallyStored: {
            status: 'idle',
            firstExecution: true,
        },
        create: {
            status: 'idle',
            firstExecution: true,
        },
    },
};
