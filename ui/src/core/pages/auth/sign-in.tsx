import { SignIn as SignInView } from '~/core/entities/auth/ui/sign-in.view';

export const SignIn = () => {
  return (
    <main className="w-full min-h-[90vh] flex flex-row justify-center pt-[17vh]">
      <SignInView />
    </main>
  );
};
