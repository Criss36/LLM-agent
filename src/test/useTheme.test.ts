import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../components/hooks/useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  it('defaults to dark when localStorage is empty', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('reads saved theme from localStorage', () => {
    localStorage.setItem('p2-theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('sets data-theme attribute on document', () => {
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => result.current.setTheme('light'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('saves theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    expect(localStorage.getItem('p2-theme')).toBe('dark');

    act(() => result.current.setTheme('system'));
    expect(localStorage.getItem('p2-theme')).toBe('system');
  });

  it('handles localStorage throw gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    // Should not throw
    expect(result.current.theme).toBe('light');
  });

  it('handles localStorage getItem throw gracefully', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('access denied');
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });
});
