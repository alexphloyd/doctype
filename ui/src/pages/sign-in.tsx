import { SignIn as SignInView } from '~/features/auth/ui/sign-in.view';

export const SignIn = () => {
    return (
        <main className="w-full min-h-screen flex flex-row justify-center pt-[13vh]">
            <SignInView />
        </main>
    );
};
