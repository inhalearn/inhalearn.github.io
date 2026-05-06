import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Completion } from './Completion';
import { useProgressStore } from '@/store/progressStore';

describe('Completion', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.getState().reset();
  });

  it('renders total stars and completed level count from progressStore', () => {
    for (let levelId = 0; levelId < 6; levelId += 1) {
      useProgressStore.getState().completeLevel(levelId, 3);
    }

    render(
      <MemoryRouter>
        <Completion />
      </MemoryRouter>
    );

    expect(screen.getByText('18/18')).toBeDefined();
    expect(screen.getByText('완료 스테이지 6/6')).toBeDefined();
    expect(screen.getByText('인덕이와 함께 6개 스테이지를 모두 완주했어요.')).toBeDefined();
  });
});
