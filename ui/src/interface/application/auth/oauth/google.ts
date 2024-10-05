import { TokenResponse as GoogleTokenResponse } from '@react-oauth/google';
import { Tokens } from '~/interface/domain/auth';
import { Session } from '~/interface/domain/session';
import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';
import { notifications } from '~/interface/shared/lib/notifications';

import { sessionModel } from '../../session/model';
import { registrationModel } from '../registration/model';

export const googleLogin = async (
  creds: Pick<GoogleTokenResponse, 'token_type' | 'access_token'>
) => {
  const preparedToken = `${creds.token_type} ${creds.access_token}`;
  const query = await apiClient.query<{
    tokens: Tokens;
    user: Session;
  }>({
    url: 'auth/google-login',
    method: 'GET',
    headers: {
      oauth: preparedToken,
    },
  });

  if (query.data?.user) {
    sessionModel.upsert(query.data.user);
    router.navigate('/');

    registrationModel.reset();
  } else {
    notifications.oauthFailed();
  }
};
