import { type ReactNode } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { store } from '../store/app-store';

export const WithStore = (component: () => ReactNode) => () => {
    return <StoreProvider store={store}>{component()}</StoreProvider>;
};
