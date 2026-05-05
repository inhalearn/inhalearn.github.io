import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BlockPicker } from './BlockPicker';

describe('BlockPicker', () => {
  it('renders only the available blocks', () => {
    render(
      <BlockPicker
        availableBlocks={['move-right', 'move-up']}
        onAddBlock={() => undefined}
      />
    );

    expect(screen.getByTestId('block-picker-move-right')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-up')).toBeDefined();
    expect(screen.queryByTestId('block-picker-repeat')).toBeNull();
  });

  it('calls onAddBlock when a block button is clicked', () => {
    const onAddBlock = vi.fn();

    render(
      <BlockPicker
        availableBlocks={['move-right']}
        onAddBlock={onAddBlock}
      />
    );

    fireEvent.click(screen.getByTestId('block-picker-move-right'));

    expect(onAddBlock).toHaveBeenCalledWith('move-right');
  });

  it('renders repeat when it is available', () => {
    render(
      <BlockPicker
        availableBlocks={['move-right', 'repeat']}
        onAddBlock={() => undefined}
      />
    );

    expect(screen.getByTestId('block-picker-repeat')).toBeDefined();
  });
});
