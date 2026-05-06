import { describe, expect, it, vi } from 'vitest';
import { BlockInterpreter } from './interpreter';
import { Turtle } from './turtle';
import { Block } from '@/types/block';

describe('BlockInterpreter', () => {
  it('records draw segments with updated colors', async () => {
    const turtle = new Turtle({
      gridSize: 6,
      startPosition: { x: 1, y: 1 },
    });
    const interpreter = new BlockInterpreter(turtle);
    const blocks: Block[] = [
      { id: 'color-1', type: 'color', color: '#212121' },
      { id: 'move-1', type: 'move-right' },
      { id: 'move-2', type: 'move-down' },
    ];

    const result = await interpreter.execute(blocks, 'skip');

    expect(result.success).toBe(true);
    expect(result.drawSegments).toEqual([
      {
        from: { x: 1, y: 1 },
        to: { x: 2, y: 1 },
        color: '#212121',
      },
      {
        from: { x: 2, y: 1 },
        to: { x: 2, y: 2 },
        color: '#212121',
      },
    ]);
  });

  it('skips drawing while pen is up', async () => {
    const turtle = new Turtle({
      gridSize: 6,
      startPosition: { x: 1, y: 1 },
    });
    const interpreter = new BlockInterpreter(turtle);
    const blocks: Block[] = [
      { id: 'up', type: 'pen-up' },
      { id: 'move-1', type: 'move-right' },
      { id: 'down', type: 'pen-down' },
      { id: 'move-2', type: 'move-down' },
    ];

    const result = await interpreter.execute(blocks, 'skip');

    expect(result.success).toBe(true);
    expect(result.trail).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ]);
    expect(result.drawSegments).toEqual([
      {
        from: { x: 2, y: 1 },
        to: { x: 2, y: 2 },
        color: '#0099CC',
      },
    ]);
  });

  it('includes draw segments on failed execution', async () => {
    vi.useFakeTimers();

    const turtle = new Turtle({
      gridSize: 2,
      startPosition: { x: 0, y: 0 },
    });
    const interpreter = new BlockInterpreter(turtle);
    const blocks: Block[] = [
      { id: 'move-1', type: 'move-right' },
      { id: 'move-2', type: 'move-right' },
    ];

    const executePromise = interpreter.execute(blocks, 'normal');
    await vi.runAllTimersAsync();
    const result = await executePromise;

    expect(result.success).toBe(false);
    expect(result.drawSegments).toEqual([
      {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
        color: '#0099CC',
      },
    ]);

    vi.useRealTimers();
  });
});
