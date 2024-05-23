import compose from 'compose-function';

import { WithGoogleOAuth } from './with-google-oauth';
import { WithMantine } from './with-mantine';
import { WithStore } from './with-store';

export const WithProviders = compose(WithStore, WithMantine, WithGoogleOAuth);
