import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { useInView } from '../components/hooks/useInView';

function createObserverStub() {
  let callback: IntersectionObserverCallback = () => {};
  const mock = vi.fn(function (cb: IntersectionObserverCallback) {
    callback = cb;
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  });
  const trigger = (entries: Partial<IntersectionObserverEntry>[]) =>
    act(() => callback(entries as IntersectionObserverEntry[], {} as IntersectionObserver));
  vi.stubGlobal('IntersectionObserver', mock);
  return { mock, trigger };
}

function TestComp({ threshold, once }: { threshold?: number; once?: boolean }) {
  const { ref, v } = useInView({ threshold, once });
  return <div ref={ref as React.Ref<HTMLDivElement>} data-testid="v">{String(v)}</div>;
}

describe('useInView', () => {
  let stubs: ReturnType<typeof createObserverStub>;

  beforeEach(() => {
    stubs = createObserverStub();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ref and v=false initially with ref.current null', () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.v).toBe(false);
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('sets v=true when element becomes intersecting', () => {
    const { getByTestId } = render(<TestComp threshold={0.1} />);
    expect(getByTestId('v').textContent).toBe('false');

    stubs.trigger([{ isIntersecting: true }]);
    expect(getByTestId('v').textContent).toBe('true');
  });

  it('sets v=false when not intersecting in non-once mode', () => {
    const { getByTestId } = render(<TestComp once={false} />);
    expect(getByTestId('v').textContent).toBe('false');

    stubs.trigger([{ isIntersecting: true }]);
    expect(getByTestId('v').textContent).toBe('true');

    stubs.trigger([{ isIntersecting: false }]);
    expect(getByTestId('v').textContent).toBe('false');
  });

  it('keeps v=true after leaving view in once mode (default)', () => {
    const { getByTestId } = render(<TestComp />);

    stubs.trigger([{ isIntersecting: true }]);
    expect(getByTestId('v').textContent).toBe('true');

    stubs.trigger([{ isIntersecting: false }]);
    expect(getByTestId('v').textContent).toBe('true');
  });

  it('passes threshold to IntersectionObserver', () => {
    render(<TestComp threshold={0.5} />);
    expect(stubs.mock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });
});
