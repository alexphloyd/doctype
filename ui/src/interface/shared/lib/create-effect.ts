import { observable, runInAction } from 'mobx';

export function createEffect<T = void, E = any>(fn: (args: T) => Promise<E>) {
  const meta = observable<{
    status: EffectStatus;
    error?: { message?: string | null } | null;
  }>({ status: 'idle', error: null });

  return {
    meta,
    run: async (args: T) => {
      runInAction(() => {
        meta.error = null;
        meta.status = 'pending';
      });

      await fn(args)
        .then(() => {
          runInAction(() => {
            meta.status = 'fulfilled';
          });
        })
        .catch((error: Error) => {
          runInAction(() => {
            meta.status = 'rejected';
            meta.error = {
              message: error?.message ?? 'failed',
            };
          });
        });
    },
  };
}
