import { About } from '~/pages/about';
import { AccessDenied } from '~/pages/access-denied';
import { App } from '~/pages/app';
import { Editor } from '~/pages/editor';
import { Settings } from '~/pages/settings';
import { SignIn } from '~/pages/sign-in';

import { withGuard } from './with-guard';

export const Pages = {
    App,
    SignIn,
    AccessDenied,
    About,
    Editor,
    Settings: withGuard(Settings, ['USER']),
};
