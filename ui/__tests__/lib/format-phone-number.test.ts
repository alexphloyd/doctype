import { describe, it, expect } from 'vitest';

import { formatPhoneNumber } from '~/shared/lib/format-phone-number';

describe('format phone number', () => {
    it('must format filled input', () => {
        const phoneNumber = formatPhoneNumber({
            value: '945132768',
            country: 'poland',
        });
        expect(phoneNumber).toBe('945-132-768');
    });

    it('must format unfilled input', () => {
        const phoneNumber = formatPhoneNumber({
            value: '942',
            country: 'poland',
        });
        expect(phoneNumber).toBe('942');
    });

    it('must return valid value', () => {
        const phoneNumber = formatPhoneNumber({
            value: '9',
            country: 'poland',
        });
        expect(phoneNumber).toBe('9');
    });

    it('must filter unnecessary chars', () => {
        const phoneNumber = formatPhoneNumber({
            value: '94513276866',
            country: 'poland',
        });
        expect(phoneNumber).toBe('945-132-768');
    });
});
