import cookies from 'js-cookie';
import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export async function handleGithubRedirection() {
  if (new URLSearchParams(window.location.search).has('github-auth-verified')) {
    const access = cookies.get('access_token');
    const refresh = cookies.get('refresh_token');

    if (access && refresh) {
      await apiClient.query({
        url: 'auth/github-auth-verified',
        method: 'GET',
        headers: {
          access_token: access,
          refresh_token: refresh,
        },
      });

      cookies.remove('access_token');
      cookies.remove('refresh_token');

      router.navigate('/');
    }
  }
}
