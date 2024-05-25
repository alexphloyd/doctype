import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from '~/app/layouts/base-layout';

import { Pages } from './pages';

export const router = createBrowserRouter([
    {
        element: <BaseLayout />,
        children: [
            {
                path: '/',
                element: <Pages.App />,
            },
            {
                path: '/editor/:id',
                element: <Pages.Editor />,
            },

            /* Auth */
            {
                path: '/sign-in',
                element: <Pages.SignIn />,
            },
        ],
        errorElement: <Pages.AccessDenied />,
    },
    {
        path: '/access-denied',
        element: <Pages.AccessDenied />,
    },
]);
