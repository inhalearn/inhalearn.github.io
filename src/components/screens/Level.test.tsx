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

  it('shows repeat and four directions in level 3', () => {
    renderLevel('/level/3');

    expect(screen.getByTestId('block-picker-repeat')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-right')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-down')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-left')).toBeDefined();
    expect(screen.getByTestId('block-picker-move-up')).toBeDefined();
  });

  it('renders maze walls in level 4', () => {
    renderLevel('/level/4');

    expect(screen.getByTestId('wall-3-0')).toBeDefined();
    expect(screen.getByTestId('wall-7-7')).toBeDefined();
  });

  it('shows a success message after solving level 0', async () => {
    renderLevel('/level/0');

    fireEvent.click(screen.getByTestId('block-picker-move-right'));
    fireEvent.click(screen.getByRole('button', { name: '▶ 실행하기' }));

    await waitFor(() => {
      expect(screen.getByText('성공! 인덕이가 목표에 도착했어요.')).toBeDefined();
    });
  });

  it('unlocks repeat after discovery in level 2 and shows comparison modal on success', async () => {
    renderLevel('/level/2');

    expect(screen.getByTestId('block-picker-move-right')).toBeDefined();
    expect(screen.queryByTestId('block-picker-repeat')).toBeNull();

    for (let count = 0; count < 5; count += 1) {
      fireEvent.click(screen.getByTestId('block-picker-move-right'));
    }

    await waitFor(() => {
      expect(screen.getByText('발견!')).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: '💡 힌트 보기' }));

    await waitFor(() => {
      expect(screen.getByTestId('block-picker-repeat')).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: '전체 지우기' }));
    fireEvent.click(screen.getByTestId('block-picker-repeat'));
    fireEvent.click(screen.getByRole('button', { name: '오른쪽 추가' }));
    fireEvent.click(screen.getByRole('button', { name: '▶ 실행하기' }));

    await waitFor(() => {
      expect(screen.getByText(/코드 비교/)).toBeDefined();
    });
  });

  it('shows preset missions and palette selection in level 5', () => {
    renderLevel('/level/5');

    expect(screen.getByTestId('preset-mission-inha')).toBeDefined();
    expect(screen.getByTestId('preset-mission-heart')).toBeDefined();
    expect(screen.getByTestId('palette-#212121')).toBeDefined();
  });

  it('creates a color block with the selected palette color in level 5', () => {
    renderLevel('/level/5');

    fireEvent.click(screen.getByTestId('palette-#212121'));
    fireEvent.click(screen.getByTestId('block-picker-color'));

    expect(screen.getByText('🎨 색상 #212121')).toBeDefined();
  });

  it('completes free-draw level through the explicit completion action', async () => {
    renderLevel('/level/5');

    fireEvent.click(screen.getByTestId('block-picker-move-right'));
    fireEvent.click(screen.getByRole('button', { name: '✅ 완성했어요' }));

    await waitFor(() => {
      expect(screen.getByText('성공! 나만의 그림을 완성했어요.')).toBeDefined();
    });

    expect(useProgressStore.getState().completedLevels).toContain(5);
  });

  it('handles an invalid level id', () => {
    renderLevel('/level/999');

    expect(screen.getByText('레벨을 찾을 수 없어요')).toBeDefined();
    expect(screen.getByRole('link', { name: '레벨 목록으로' })).toBeDefined();
  });
});
