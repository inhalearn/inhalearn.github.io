import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CodeEditor } from './CodeEditor';

describe('CodeEditor', () => {
  it('shows empty state when there are no blocks', () => {
    render(
      <CodeEditor
        blocks={[]}
        onRemoveBlock={() => undefined}
        onClearBlocks={() => undefined}
      />
    );

    expect(screen.getByText('아직 비어 있어요')).toBeDefined();
    expect(screen.getByText('아래 블록을 눌러 코드를 만들어보세요.')).toBeDefined();
  });

  it('calls onRemoveBlock when delete button is clicked', () => {
    const onRemoveBlock = vi.fn();

    render(
      <CodeEditor
        blocks={[{ id: 'a', type: 'move-right' }]}
        onRemoveBlock={onRemoveBlock}
        onClearBlocks={() => undefined}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '1번째 블록 삭제' }));

    expect(onRemoveBlock).toHaveBeenCalledWith('a');
  });

  it('calls onClearBlocks when clear button is clicked', () => {
    const onClearBlocks = vi.fn();

    render(
      <CodeEditor
        blocks={[{ id: 'a', type: 'move-right' }]}
        onRemoveBlock={() => undefined}
        onClearBlocks={onClearBlocks}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '전체 지우기' }));

    expect(onClearBlocks).toHaveBeenCalled();
  });

  it('highlights the error block', () => {
    render(
      <CodeEditor
        blocks={[
          { id: 'a', type: 'move-right' },
          { id: 'b', type: 'move-up' },
        ]}
        errorBlockIndex={1}
        onRemoveBlock={() => undefined}
        onClearBlocks={() => undefined}
      />
    );

    expect(screen.getByTestId('code-block-1').className).toContain('border-red-400');
  });
});
