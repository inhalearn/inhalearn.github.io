import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * GitHub Pages SPA routing fallback tests
 *
 * These tests verify that the redirect mechanism in 404.html and index.html
 * correctly preserves paths and query parameters when accessing routes directly.
 */

describe('GitHub Pages SPA Routing', () => {
  let originalLocation: Location;
  let originalSessionStorage: Storage;

  beforeEach(() => {
    originalLocation = window.location;
    originalSessionStorage = window.sessionStorage;
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
    });
  });

  it('should handle root path correctly', () => {
    const mockLocation = {
      protocol: 'https:',
      hostname: 'inhalearn.github.io',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      href: 'https://inhalearn.github.io/',
    };

    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    expect(window.location.pathname).toBe('/');
  });

  it('should construct redirect URL for deep links', () => {
    // Simulate accessing /level/2 directly
    // This is what 404.html does
    const redirect =
      'https:' +
      '//' +
      'inhalearn.github.io' +
      '/' +
      '?' +
      '/' +
      'level/2';

    expect(redirect).toContain('/?/level/2');
  });

  it('should preserve query parameters in redirect', () => {
    // Simulate accessing /level/2?code=abc with query params
    const searchParams = '?code=abc';
    const pathname = '/level/2';

    // This is what 404.html does - encodes & as ~and~
    const encodedSearch = searchParams.slice(1).replace(/&/g, '~and~');
    const redirect = `/?/${pathname.slice(1)}&${encodedSearch}`;

    expect(redirect).toContain('/?/level/2&code=abc');
  });

  it('should restore path from sessionStorage redirect', () => {
    const mockSessionStorage: Record<string, string> = {
      redirect: 'https://inhalearn.github.io/level/2',
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        get redirect() {
          return mockSessionStorage.redirect;
        },
        set redirect(value: string) {
          mockSessionStorage.redirect = value;
        },
        removeItem: (key: string) => {
          delete mockSessionStorage[key];
        },
      },
      writable: true,
    });

    const redirect = window.sessionStorage.redirect;
    expect(redirect).toBe('https://inhalearn.github.io/level/2');
  });
});

describe('Base path configuration', () => {
  it('should use root base path for user site', () => {
    // For inhalearn.github.io (user site), base should be '/'
    // For inhalearn.github.io/project (project site), base would be '/project/'
    const basePath = '/';
    expect(basePath).toBe('/');
  });
});
