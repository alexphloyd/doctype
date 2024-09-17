import { observable, runInAction } from 'mobx';

export function createEffect<T = void, E = any>(fn: (args: T) => Promise<E>) {
  const meta = observable<{
    promise: Promise<unknown> | null;
    status: EffectStatus;
    error?: { message?: string | null } | null;
  }>({ status: 'idle', error: null, promise: null });

  let resolver: (v: void) => void;

  return {
    meta,
    run: async (args: T) => {
      runInAction(() => {
        meta.error = null;
        meta.status = 'pending';
        meta.promise = new Promise((_resolve) => {
          resolver = _resolve;
        });
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
        })
        .finally(() => resolver?.());
    },
  };
}
