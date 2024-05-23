import { RouterProvider } from 'react-router-dom';

import { WithProviders } from './providers/compose';
import { router } from './router/main';

export const ComposedApp = WithProviders(() => <RouterProvider router={router} />);
