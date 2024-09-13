import { AccessDenied } from '~/interface/routes/auth/access-denied';
import { Settings } from '~/interface/routes/auth/settings';
import { SignIn } from '~/interface/routes/auth/sign-in';
import { Editor } from '~/interface/routes/editor';
import { Home } from '~/interface/routes/home';

import { withGuard } from './with-guard';

export const Pages = {
  Home,
  SignIn,
  AccessDenied,
  Editor,
  Settings: withGuard(Settings, ['USER']),
};
