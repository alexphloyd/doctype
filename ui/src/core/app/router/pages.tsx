import { AccessDenied } from '~/core/pages/auth/access-denied';
import { Settings } from '~/core/pages/auth/settings';
import { SignIn } from '~/core/pages/auth/sign-in';
import { Editor } from '~/core/pages/editor';
import { Home } from '~/core/pages/home';

import { withGuard } from './with-guard';

export const Pages = {
    Home,
    SignIn,
    AccessDenied,
    Editor,
    Settings: withGuard(Settings, ['USER']),
};
