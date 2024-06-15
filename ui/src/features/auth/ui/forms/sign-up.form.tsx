import { z } from 'zod';

import { useAppDispatch } from '~/app/store/hooks';

import { SignUpSchema, VerificationSchema } from '~/features/auth/model/schemas';

import { Form } from '~/shared/ui/form';
import { type OnSubmitResult } from '~/shared/ui/form';
import { Input } from '~/shared/ui/input';

import { signUp } from '../../model/effects/sign-up';
import { verify } from '../../model/effects/verify';
import {
    useSignInProcessStep,
    useSignUpEffectState,
    useVerifyEffectState,
} from '../../model/selectors';
import { GithubButton } from '../buttons/github.button';
import { GoogleButton } from '../buttons/google.button';

export const SignUp = () => {
    const dispatch = useAppDispatch();

    const step = useSignInProcessStep();

    const signUpEffectState = useSignUpEffectState();
    const verifyEffectState = useVerifyEffectState();

    const handleSignUp = async (credentials: z.infer<typeof SignUpSchema>) => {
        Reflect.deleteProperty(credentials, 'confirmPassword');
        dispatch(signUp(credentials));
    };

    const handleVerify = async (payload: z.infer<typeof VerificationSchema>) => {
        dispatch(verify({ code: payload.code }));
    };

    if (step === 'credentials')
        return (
            <SignUpForm
                onSubmit={handleSignUp}
                isLoading={signUpEffectState.status === 'pending'}
                error={signUpEffectState.error?.message}
            />
        );

    if (step === 'verification')
        return (
            <VerificationForm
                onSubmit={handleVerify}
                isLoading={verifyEffectState.status === 'pending'}
                error={verifyEffectState.error?.message}
            />
        );
};

function SignUpForm({
    onSubmit,
    isLoading,
    error,
}: {
    onSubmit: (credentials: z.infer<typeof SignUpSchema>) => Promise<void | OnSubmitResult>;
    isLoading: boolean;
    error?: string | undefined;
}) {
    return (
        <Form
            onSubmit={onSubmit}
            schema={SignUpSchema}
            errorMessage={error}
            isLoading={isLoading}
            submitText="Register"
            className="w-full"
            leftSubmitSlot={
                <section className="flex items-center justify-center gap-x-4">
                    <GoogleButton />
                    <GithubButton />
                </section>
            }
        >
            <Input name="email" type="email" label="Email" />

            <Input name="password" type="password" label="Password" />
            <Input name="confirm" type="password" label="Confirm a password" />
        </Form>
    );
}

function VerificationForm({
    onSubmit,
    isLoading,
    error,
}: {
    onSubmit: (payload: z.infer<typeof VerificationSchema>) => Promise<void | OnSubmitResult>;
    isLoading: boolean;
    error?: string | undefined;
}) {
    return (
        <Form
            onSubmit={onSubmit}
            schema={VerificationSchema}
            isLoading={isLoading}
            errorMessage={error}
            submitText="Apply"
            className="w-full"
        >
            <p className="-mb-2 text-[0.95rem]">
                We've sent you a code! Please, check your{' '}
                <a
                    href="https://gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-500"
                >
                    email!
                </a>
            </p>

            <Input name="code" label="Verification code" />
        </Form>
    );
}
