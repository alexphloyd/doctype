import { Button } from '@mantine/core';
import { useGoogleLogin } from '@react-oauth/google';

import { useAppDispatch } from '~/app/store/hooks';

import { Icon } from '~/shared/ui/icon';

import { loginWithOAuth } from '../../model/effects/login-with-oauth';

export const GoogleButton = () => {
    const dispatch = useAppDispatch();

    const login = useGoogleLogin({
        onSuccess: (res) => {
            dispatch(
                loginWithOAuth({
                    oauthToken: res.access_token,
                    type: res.token_type,
                })
            );
        },
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
