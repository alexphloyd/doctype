import { AccessDenied } from '~/pages/auth/access-denied';
import { Settings } from '~/pages/auth/settings';
import { SignIn } from '~/pages/auth/sign-in';
import { Editor } from '~/pages/editor';
import { Home } from '~/pages/home';

import { withGuard } from './with-guard';

export const Pages = {
    Home,
    SignIn,
    AccessDenied,
    Editor,
    Settings: withGuard(Settings, ['USER']),
};
