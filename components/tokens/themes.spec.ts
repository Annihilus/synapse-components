import { THEMES, type Theme } from './themes';

describe('token themes', () => {
  it('exposes the generated theme list', () => {
    expect(THEMES).toEqual(['dark', 'light']);

    const theme: Theme = THEMES[0];
    expect(theme).toBe('dark');
  });
});
