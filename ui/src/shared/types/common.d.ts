declare type IconName = string;

declare type PhoneNumber = string;

declare type DateString = string;

declare type RoutePath = string;

declare type EffectStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

declare type EffectState = {
    status: EffectStatus;
    error?: ApiErrorData;
    firstExecution: boolean;
};

declare type ErrorMessage = string | undefined;

type ApiErrorData = {
    message: ErrorMessage;
    statusCode: number;
};

declare type ApiClientResponse<R> = {
    data: R | undefined;
    error: import('axios').AxiosError<ApiErrorData> | undefined;
};
