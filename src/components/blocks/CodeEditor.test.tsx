import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CodeEditor } from './CodeEditor';
import { Block, BlockType } from '@/types/block';

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

  it('allows editing a repeat block count and children', () => {
    const onUpdateBlock = vi.fn();
    const createBlock = vi.fn((type: BlockType): Block => {
      if (type === 'repeat') {
        return { id: 'nested-repeat', type, count: 2, children: [] };
      }

      if (type === 'move-right') {
        return { id: 'child-right', type };
      }

      return { id: 'fallback-right', type: 'move-right' };
    });

    render(
      <CodeEditor
        blocks={[{ id: 'repeat-1', type: 'repeat', count: 2, children: [] }]}
        availableChildBlocks={['move-right', 'repeat']}
        onRemoveBlock={() => undefined}
        onClearBlocks={() => undefined}
        onUpdateBlock={onUpdateBlock}
        createBlock={createBlock}
      />
    );

    fireEvent.change(screen.getByTestId('repeat-count-repeat-1'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: '오른쪽 추가' }));

    expect(onUpdateBlock).toHaveBeenCalledWith('repeat-1', { count: 5 });
    expect(onUpdateBlock).toHaveBeenCalledWith('repeat-1', {
      children: [{ id: 'child-right', type: 'move-right' }],
    });
  });
});
