import { v1 as timestampBasedId } from 'uuid';

export function generateId() {
    return timestampBasedId();
}
