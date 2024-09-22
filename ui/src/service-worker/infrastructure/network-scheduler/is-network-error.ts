import { AxiosError } from 'axios';

export function isNetworkError(error: AxiosError<ApiErrorData, any> | undefined) {
  if (!error?.code) return false;
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ERR_CANCELED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ETIMEOUT'
  );
}
