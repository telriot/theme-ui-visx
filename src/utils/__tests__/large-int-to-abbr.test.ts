import { largeIntToAbbr } from '../format';

describe('Returns abbreviations of large integers', () => {
  test('Works with thousands', () => {
    expect(largeIntToAbbr(1230)).toBe('1.2k');
    expect(largeIntToAbbr(1230, 2)).toBe('1.23k');
  });
  test('Works with millions', () => {
    expect(largeIntToAbbr(1230000)).toBe('1.2m');
    expect(largeIntToAbbr(1230000, 2)).toBe('1.23m');
  });
  test('Works with billions', () => {
    expect(largeIntToAbbr(1230000000)).toBe('1.2b');
    expect(largeIntToAbbr(1230000000, 2)).toBe('1.23b');
  });
});
