import { camelToTitleCase } from 'src/utils/format';

describe('Returns correct titles from camel cased strings', () => {
  test('Works on empty strings', () => {
    expect(camelToTitleCase('')).toBe('');
  });
  test('Works on random strings', () => {
    expect(camelToTitleCase('someString')).toBe('Some String');
    expect(camelToTitleCase('someOtherString')).toBe('Some Other String');
  });
  test('Works on non camelCase strings', () => {
    expect(camelToTitleCase('SomeString')).toBe('Some String');
    expect(camelToTitleCase('SomeOtherString')).toBe('Some Other String');
  });
});
