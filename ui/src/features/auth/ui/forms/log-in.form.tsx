import { z } from 'zod';

import { useAppDispatch } from '~/app/store/hooks';

import { Form } from '~/shared/ui/form';
import { Input } from '~/shared/ui/input';

import { login } from '../../model/effects/login';
import { LoginSchema } from '../../model/schemas';
import { useLoginEffectState } from '../../model/selectors';
import { GithubButton } from '../buttons/github.button';
import { GoogleButton } from '../buttons/google.button';

export const Login = () => {
    const dispatch = useAppDispatch();
    const { status, error } = useLoginEffectState();

    const handleLogin = async (credentials: z.infer<typeof LoginSchema>) => {
        dispatch(login(credentials));
    };

    return (
        <Form
            onSubmit={handleLogin}
            schema={LoginSchema}
            submitText="Log In"
            errorMessage={error?.message}
            isLoading={status === 'pending'}
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
        </Form>
    );
};
