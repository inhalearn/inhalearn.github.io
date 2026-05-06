import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { levels } from '@/data/levels';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders the expected number of grid cells', () => {
    render(
      <Canvas level={levels[0]} currentPosition={levels[0].startPosition} />
    );

    expect(screen.getAllByTestId(/grid-cell-/)).toHaveLength(
      levels[0].gridSize * levels[0].gridSize
    );
  });

  it('renders goal and walls from level data', () => {
    render(
      <Canvas level={levels[1]} currentPosition={levels[1].startPosition} />
    );

    expect(
      screen.getByTestId(
        `goal-${levels[1].goalPosition.x}-${levels[1].goalPosition.y}`
      )
    ).toBeDefined();

    levels[1].walls?.forEach((wall) => {
      expect(screen.getByTestId(`wall-${wall.x}-${wall.y}`)).toBeDefined();
    });
  });

  it('renders the induck marker and status label', () => {
    render(
      <Canvas
        level={levels[1]}
        currentPosition={{ x: 1, y: 4 }}
        trail={[levels[1].startPosition, { x: 1, y: 4 }]}
        isExecuting
      />
    );

    expect(screen.getByTestId('induck')).toBeDefined();
    expect(screen.getByText('실행 중')).toBeDefined();
  });

  it('renders colored trail segments when drawing metadata exists', () => {
    render(
      <Canvas
        level={levels[5]}
        currentPosition={{ x: 6, y: 5 }}
        trail={[levels[5].startPosition, { x: 6, y: 5 }]}
        drawSegments={[
          {
            from: { x: 5, y: 5 },
            to: { x: 6, y: 5 },
            color: '#212121',
          },
        ]}
      />
    );

    const line = screen.getByTestId('trail-line-0');

    expect(screen.getByTestId('trail-layer')).toBeDefined();
    expect(line.getAttribute('stroke')).toBe('#212121');
  });

  it('does not render trail layer for pen-up only movement', () => {
    render(
      <Canvas
        level={levels[5]}
        currentPosition={{ x: 6, y: 5 }}
        trail={[levels[5].startPosition, { x: 6, y: 5 }]}
        drawSegments={[]}
      />
    );

    expect(screen.queryByTestId('trail-layer')).toBeNull();
  });
});
