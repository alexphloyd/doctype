import { router } from '~/interface/kernel/router/mod.router';
import { apiClient } from '~/interface/shared/api-client/mod.api-client';

export async function handleGithubRedirection() {
  if (new URLSearchParams(window.location.search).has('github-auth-verified')) {
    await apiClient.query({
      url: 'auth/exchange-github-token',
      method: 'GET',
    });

    router.navigate('/');
  }
}
