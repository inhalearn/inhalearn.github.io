import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiscoveryModal } from './DiscoveryModal';

describe('DiscoveryModal', () => {
  it('renders its core content when open', () => {
    render(
      <DiscoveryModal
        isOpen
        onHint={() => undefined}
        onContinue={() => undefined}
        onClose={() => undefined}
      />
    );

    expect(screen.getByText('발견!')).toBeDefined();
    expect(screen.getByRole('button', { name: '💡 힌트 보기' })).toBeDefined();
    expect(screen.getByRole('button', { name: '➡️ 계속하기' })).toBeDefined();
  });

  it('calls action callbacks', () => {
    const onHint = vi.fn();
    const onContinue = vi.fn();

    render(
      <DiscoveryModal
        isOpen
        onHint={onHint}
        onContinue={onContinue}
        onClose={() => undefined}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '💡 힌트 보기' }));
    fireEvent.click(screen.getByRole('button', { name: '➡️ 계속하기' }));

    expect(onHint).toHaveBeenCalled();
    expect(onContinue).toHaveBeenCalled();
  });
});
