import { getMany } from './effects/get-many';

export function initiate(dispatch: Dispatch) {
    dispatch(getMany());
}
