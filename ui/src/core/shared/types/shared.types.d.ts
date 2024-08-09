declare type TypeOfValue<T extends object, K extends keyof T> = T[K];

declare type OmitStrict<T extends Record<string, unknown>, K extends keyof T> = Omit<T, K>;

declare type OmitReplace<
    T extends Record<string, unknown>,
    U extends Record<string, unknown>,
> = keyof U extends infer R extends keyof T ? Omit<T, R> & U : never;

declare type ExcludeStrict<T extends string, K extends T> = Exclude<T, K>;

declare type FunctionArgumentsType<F extends (...args: any) => void> = F extends (
    ...args: infer A
) => any
    ? A
    : never;

declare type UniqueKey = `${string}-${string}-${string}-${string}-${string}`;

declare type Model = {
    events?: unknown;
    effects?: unknown;
    subscribes?: unknown;
    api?: unknown;
    initiate?: unknown;
    kernel: {
        name: string;
        reducer: unknown;
    };
};
