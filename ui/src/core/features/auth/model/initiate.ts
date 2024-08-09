import { defineSession } from './effects/define-session';

export function initiate(dispatch: Dispatch) {
    dispatch(defineSession());
}
