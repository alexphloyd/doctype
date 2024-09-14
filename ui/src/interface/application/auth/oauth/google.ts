import { TokenResponse as GoogleTokenResponse } from '@react-oauth/google';
import { Tokens } from '~/interface/domain/auth';
import { Session } from '~/interface/domain/session';
import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import { notifications } from '~/interface/shared/lib/notifications';

import { sessionModel } from '../../session/model';

export const loginWithGoogle = async (
  creds: Pick<GoogleTokenResponse, 'token_type' | 'access_token'>
) => {
  const preparedToken = `${creds.token_type} ${creds.access_token}`;
  const query = await apiClient.query<{
    tokens: Tokens;
    user: Session;
  }>({
    url: 'auth/loginWithGoogle',
    method: 'GET',
    headers: {
      oauth: preparedToken,
    },
  });

  if (query.data?.user) {
    sessionModel.upsert(query.data.user);
    router.navigate('/');
  } else {
    notifications.oauthFailed();
  }
};
