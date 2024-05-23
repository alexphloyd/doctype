import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import 'vitest-canvas-mock';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

Object.defineProperty(window, 'scrollTo', {
    value: () => null,
    writable: true,
});
