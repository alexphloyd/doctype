import { createBrowserRouter } from 'react-router-dom';
import { BaseLayout } from '~/core/app/layouts/base-layout';

import { Pages } from './pages';

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Pages.Home />,
      },
      {
        path: '/editor/:id',
        element: <Pages.Editor />,
      },

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
