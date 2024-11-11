import { lazy, Suspense } from 'react';
import { BaseLoader } from '~/interface/shared/view/loader';

const SignInView = lazy(async () =>
  import('~/interface/view/sign-in/view').then((mod) => ({ default: mod.SignIn }))
);

export const SignIn = () => {
  return (
    <main className="w-full min-h-[90vh] flex flex-row justify-center pt-[17vh]">
      <Suspense fallback={<BaseLoader position="centered" className="-mt-[20vh]" />}>
        <SignInView />
      </Suspense>
    </main>
  );
};
