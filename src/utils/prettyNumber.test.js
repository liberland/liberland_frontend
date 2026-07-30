import prettyNumber from './prettyNumber';

describe('prettyNumber', () => {
  test('formats values below one thousand without a suffix', () => {
    expect(prettyNumber(999, false)).toBe('999.00');
  });

  test('formats thousands with the k suffix', () => {
    expect(prettyNumber(1000, false)).toBe('1.00k');
  });

  test('formats millions with the m suffix', () => {
    expect(prettyNumber(10 ** 6, false)).toBe('1.00m');
  });

  test('formats billions with the b suffix', () => {
    expect(prettyNumber(10 ** 9, false)).toBe('1.00b');
  });
});
