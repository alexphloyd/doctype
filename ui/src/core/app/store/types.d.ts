declare type Store = ReturnType<typeof import('./app-store').createStore>['store'];

declare type AppState = ReturnType<Store['getState']>;

declare type Dispatch = Store['dispatch'];
