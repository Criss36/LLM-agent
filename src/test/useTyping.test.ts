import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTyping } from '../components/hooks/useTyping';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useTyping', () => {
  it('returns empty string when not active', () => {
    const { result } = renderHook(() => useTyping('hello', 40, false));
    expect(result.current).toBe('');
  });

  it('types text character by character', () => {
    const { result } = renderHook(() => useTyping('hi', 40, true));

    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(40); });
    expect(result.current).toBe('h');

    act(() => { vi.advanceTimersByTime(40); });
    expect(result.current).toBe('hi');
  });

  it('stops at end of text', () => {
    const { result } = renderHook(() => useTyping('ab', 40, true));

    act(() => { vi.advanceTimersByTime(120); });
    expect(result.current).toBe('ab');
  });

  it('respects speed parameter', () => {
    const { result } = renderHook(() => useTyping('abc', 100, true));

    act(() => { vi.advanceTimersByTime(99); });
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe('a');
  });

  it('resets when text changes', () => {
    const { result, rerender } = renderHook(
      ({ text, active }) => useTyping(text, 40, active),
      { initialProps: { text: 'hi', active: true } }
    );

    act(() => { vi.advanceTimersByTime(80); });
    expect(result.current).toBe('hi');

    rerender({ text: 'hello', active: true });
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(40); });
    expect(result.current).toBe('h');
  });
});
