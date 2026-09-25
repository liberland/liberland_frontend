/**
 * Tests for the short-form number formatting used across balance displays.
 * The suffix is picked by magnitude, so the boundaries are what matter here.
 */

import prettyNumber from '../prettyNumber';

describe('prettyNumber', () => {
  it('formats values below one thousand without a suffix', () => {
    expect(prettyNumber(999, false)).toBe('999.00');
  });

  it('formats thousands with a k suffix', () => {
    expect(prettyNumber(1500, false)).toBe('1.50k');
  });

  it('formats millions with an m suffix', () => {
    expect(prettyNumber(2500000, false)).toBe('2.50m');
  });

  it('formats billions with a b suffix', () => {
    expect(prettyNumber(3500000000, false)).toBe('3.50b');
  });
});
