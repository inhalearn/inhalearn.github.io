import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Level } from './Level';
import { useCodeStore } from '@/store/codeStore';
import { useLevelStore } from '@/store/levelStore';
import { useProgressStore } from '@/store/progressStore';

function renderLevel(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/level/:id" element={<Level />} />
        <Route path="/levels" element={<div>levels page</div>} />
        <Route path="/completion" element={<div>completion page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Level screen', () => {
  beforeEach(() => {
    useCodeStore.getState().clearBlocks();
    useLevelStore.getState().reset();
    useLevelStore.getState().setExecutionSpeed('skip');
    useProgressStore.getState().reset();
  });

  it('shows only move-right in level 0', () => {
    renderLevel('/level/0');

    expect(screen.getByTestId('block-picker-move-right')).toBeDefined();
    expect(screen.queryByTestId('block-picker-move-up')).toBeNull();
  });

  it('shows move-up and move-right in level 1', () => {
    renderLevel('/level/1');

    expect(screen.getByTestId('block-picker-move-right')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-up')).toBeDefined();
  });

  it('shows a success message after solving level 0', async () => {
    renderLevel('/level/0');

    fireEvent.click(screen.getByTestId('block-picker-move-right'));
    fireEvent.click(screen.getByRole('button', { name: '▶ 실행하기' }));

    await waitFor(() => {
      expect(screen.getByText('성공! 인덕이가 목표에 도착했어요.')).toBeDefined();
    });
  });

  it('handles an invalid level id', () => {
    renderLevel('/level/999');

    expect(screen.getByText('레벨을 찾을 수 없어요')).toBeDefined();
    expect(screen.getByRole('link', { name: '레벨 목록으로' })).toBeDefined();
  });
});
