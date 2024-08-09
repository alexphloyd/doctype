import { type Country } from '~/core/shared/types/core/country';

const LINKING_SYMBOL = '-';
const SPACE = ' ';

export const PHONE_NUMBER_CODES: Record<Country, string> = {
    'united-kingdom': '+44',
    ukraine: '+380',
    france: '+33',
    argentina: '+54',
    australia: '+61',
    austria: '+43',
    belgium: '+32',
    brazil: '+55',
    canada: '+1',
    finland: '+358',
    hungary: '+36',
    ireland: '+353',
    italy: '+39',
    latvia: '+371',
    poland: '+48',
    scotland: '+44',
    sweden: '+46',
    taiwan: '+886',
    'united-arab-emirates': '+971',
    germany: '+49',
    'united-states-of-america': '+1',
};

export const PHONE_NUMBER_FORMATS: Record<Country, string> = {
    poland: 'AAA-AAA-AAA',
    ukraine: 'AA AAA AA AA',
    'united-kingdom': 'AAAA AAAAA',
    'united-arab-emirates': 'AA AAA-AAA',
    'united-states-of-america': 'AAA-AAA-AAAA',
    argentina: 'A AAA AAA-AAAA',
    australia: 'A AAA AAA AAA',
    austria: 'AAAA AAAAA',
    belgium: 'AA AA AA AA',
    brazil: 'AA AAAA AAAA',
    canada: 'AAA-AAAA-AAAA',
    finland: 'AA AAA AA AA',
    hungary: 'AA AAA AAA',
    ireland: 'A AAA AAAA',
    italy: 'AAA AAA AAAA',
    latvia: 'AAAA AAAA',
    scotland: 'AAA AAA AAAA',
    sweden: 'AAA-AAAA-AAA',
    taiwan: 'A-AAAA-AAAA',
    germany: 'AA AAAAAA',
    france: 'A AA AA AA AA',
};

interface Params {
    value: PhoneNumber | undefined;
    country: Country | undefined;
}

export const formatPhoneNumber = ({ value, country }: Params) => {
    if (!country || !value) return '';

    const template = PHONE_NUMBER_FORMATS[country];
    const input = ('' + value).replace(/\D/g, '');

    let output = '';

    let templateIndex = 0;
    let inputIndex = 0;

    while (inputIndex < input.length) {
        if (template[templateIndex] === LINKING_SYMBOL || template[templateIndex] === SPACE) {
            output += template.charAt(templateIndex);
        } else {
            output += input.charAt(inputIndex);
            ++inputIndex;
        }
        ++templateIndex;
    }

    return output.substring(0, template.length);
};
