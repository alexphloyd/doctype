import { Button } from '@mantine/core';
import { useGoogleLogin } from '@react-oauth/google';
import { Icon } from '~/interface/shared/view/icon';

import { loginWithGoogle } from './google';

export const GoogleButton = () => {
  const login = useGoogleLogin({
    onSuccess: loginWithGoogle,
  });

  return (
    <Button
      variant="white"
      classNames={{ root: 'hover:bg-gray-100/40 bg-gray-100/40 px-4' }}
      size="md"
      onClick={() => login()}
    >
      <div className="flex items-center justify-center">
        <Icon name="google" className="w-5 h-5" />
      </div>
    </Button>
  );
};

export const GithubButton = () => {
  return (
    <Button
      variant="white"
      classNames={{ root: 'hover:bg-gray-100/40 bg-gray-100/40 px-4' }}
      size="md"
    >
      <div className="flex items-center justify-center">
        <Icon name="github" className="w-5 h-5 text-black/90" />
      </div>
    </Button>
  );
};
