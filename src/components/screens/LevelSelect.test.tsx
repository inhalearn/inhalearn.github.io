import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LevelSelect } from './LevelSelect';
import { useProgressStore } from '@/store/progressStore';

describe('LevelSelect', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.getState().reset();
  });

  it('renders progress summary and unlock state from progressStore', () => {
    useProgressStore.getState().completeLevel(0, 3);

    render(
      <MemoryRouter>
        <LevelSelect />
      </MemoryRouter>
    );

    expect(screen.getByText('1/6')).toBeDefined();
    expect(screen.getByText('3/18')).toBeDefined();
    expect(screen.getByText('획득 별 3/3 · 시도 1회')).toBeDefined();
    expect(screen.getByText('도전 가능')).toBeDefined();
    expect(screen.getAllByText('잠금').length).toBeGreaterThan(0);
  });
});
