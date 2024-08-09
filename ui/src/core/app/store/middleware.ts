import { type TypedStartListening, createListenerMiddleware } from '@reduxjs/toolkit';

export const listener = createListenerMiddleware();

export const on = listener.startListening as TypedStartListening<AppState, Dispatch>;
