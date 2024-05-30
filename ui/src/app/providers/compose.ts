import compose from 'compose-function';

import { WithGoogleOAuth } from './with-google-oauth';
import { WithMantine } from './with-mantine';
import { WithMotion } from './with-motion';
import { WithStore } from './with-store';

export const WithProviders = compose(WithStore, WithMantine, WithMotion, WithGoogleOAuth);
