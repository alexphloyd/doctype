import { useGoogleLogin } from '@react-oauth/google';
import { twMerge } from 'tailwind-merge';

import { useAppDispatch } from '~/app/store/hooks';

import { PrimaryButton } from '~/shared/ui/buttons/primary';
import { Icon } from '~/shared/ui/icon';

import { loginWithOAuth } from '../../model/effects/login-with-oauth';

export const GoogleButton = ({ className }: { className?: string }) => {
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
        <PrimaryButton
            type="transparent"
            onClick={() => login()}
            className={twMerge('w-full h-[37px]', className)}
            content={
                <div className="flex items-center justify-center">
                    <Icon name="google" className="w-4 h-4 mr-3" />
                    <span>Continue with Google</span>
                </div>
            }
        />
    );
};
