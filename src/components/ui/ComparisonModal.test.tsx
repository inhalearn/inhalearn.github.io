import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComparisonModal } from './ComparisonModal';

describe('ComparisonModal', () => {
  it('renders before and after block lists when open', () => {
    render(
      <ComparisonModal
        isOpen
        beforeBlocks={[
          { id: 'before-1', type: 'move-right' },
          { id: 'before-2', type: 'move-right' },
        ]}
        afterBlocks={[
          {
            id: 'after-repeat',
            type: 'repeat',
            count: 2,
            children: [{ id: 'after-child', type: 'move-right' }],
          },
        ]}
        onNext={() => undefined}
        onClose={() => undefined}
      />
    );

    expect(screen.getByText(/코드 비교/)).toBeDefined();
    expect(screen.getByText(/이전 방법: 2줄/)).toBeDefined();
    expect(screen.getByText(/반복 사용: 2줄/)).toBeDefined();
    expect(screen.getAllByText('➡️ 오른쪽').length).toBeGreaterThan(0);
  });

  it('calls next and close callbacks', () => {
    const onNext = vi.fn();
    const onClose = vi.fn();

    render(
      <ComparisonModal
        isOpen
        beforeBlocks={[{ id: 'before-1', type: 'move-right' }]}
        afterBlocks={[{ id: 'after-1', type: 'move-right' }]}
        onNext={onNext}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '다음 스테이지로' }));
    fireEvent.click(screen.getByRole('button', { name: '여기서 더 보기' }));

    expect(onNext).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
