import { getLocallyStored } from './effects/get-locally-stored';

export function initiate(dispatch: Dispatch) {
  dispatch(getLocallyStored());
}
