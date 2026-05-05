import { describe, it, expect, beforeEach } from 'vitest';
import { BlockInterpreter } from './interpreter';
import { Turtle } from './turtle';
import { Block } from '@/types/block';

describe('BlockInterpreter', () => {
  let interpreter: BlockInterpreter;
  let turtle: Turtle;

  beforeEach(() => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
    });
    interpreter = new BlockInterpreter(turtle);
  });

  it('should execute simple move sequence', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-down' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 1, y: 1 });
    expect(result.trail).toHaveLength(3); // start + 2 moves
  });

  it('should handle repeat block', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [{ id: '2', type: 'move-right' }],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 3, y: 0 });
    expect(result.trail).toHaveLength(4); // start + 3 moves
  });

  it('should handle nested repeat blocks (2 levels)', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 2,
        children: [
          {
            id: '2',
            type: 'repeat',
            count: 2,
            children: [{ id: '3', type: 'move-right' }],
          },
        ],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 4, y: 0 });
  });

  it('should return error block index on collision', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-up' }, // collision at y=0
      { id: '3', type: 'move-right' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('collision');
    expect(result.errorBlockIndex).toBe(1);
  });

  it('should not execute blocks after error', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-up' }, // error here
      { id: '3', type: 'move-right' }, // should not execute
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(turtle.getPosition()).toEqual({ x: 1, y: 0 }); // only first move
  });

  it('should return repeat block index when error occurs inside repeat', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      {
        id: '2',
        type: 'repeat',
        count: 5,
        children: [{ id: '3', type: 'move-right' }],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.errorBlockIndex).toBe(1); // error in repeat block, not child
  });

  it('should stop execution when MAX_ITERATIONS exceeded', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 100,
        children: [
          {
            id: '2',
            type: 'repeat',
            count: 100,
            children: [{ id: '3', type: 'move-down' }],
          },
        ],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('collision');
  });

  it('should ignore color, pen-up, pen-down blocks', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'color', color: '#FF0000' },
      { id: '3', type: 'pen-up' },
      { id: '4', type: 'move-down' },
      { id: '5', type: 'pen-down' },
      { id: '6', type: 'move-right' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 2, y: 1 });
  });

  it('should return success for empty blocks array', async () => {
    const blocks: Block[] = [];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 0, y: 0 });
  });

  it('should detect MAX_REPEAT_DEPTH exceeded (4 levels)', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 2,
        children: [
          {
            id: '2',
            type: 'repeat',
            count: 2,
            children: [
              {
                id: '3',
                type: 'repeat',
                count: 2,
                children: [
                  {
                    id: '4',
                    type: 'repeat',
                    count: 2,
                    children: [{ id: '5', type: 'move-right' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('collision');
  });

  it('should handle multiple move blocks in sequence', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-right' },
      { id: '3', type: 'move-down' },
      { id: '4', type: 'move-down' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 2, y: 2 });
  });

  it('should handle mixed blocks and repeats', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      {
        id: '2',
        type: 'repeat',
        count: 2,
        children: [{ id: '3', type: 'move-down' }],
      },
      { id: '4', type: 'move-left' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 0, y: 2 });
  });

  it('should respect grid boundaries', async () => {
    turtle = new Turtle({
      gridSize: 3,
      startPosition: { x: 2, y: 1 },
    });
    interpreter = new BlockInterpreter(turtle);

    const blocks: Block[] = [
      { id: '1', type: 'move-right' }, // should fail at x=3 (out of bounds)
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.errorBlockIndex).toBe(0);
  });

  it('should detect wall collision', async () => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
      walls: [{ x: 1, y: 0 }],
    });
    interpreter = new BlockInterpreter(turtle);

    const blocks: Block[] = [
      { id: '1', type: 'move-right' }, // should hit wall
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.errorBlockIndex).toBe(0);
  });

  it('should check goal position when provided', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-down' },
    ];
    const result = await interpreter.execute(blocks, 'skip', { x: 1, y: 1 });
    expect(result.success).toBe(true);
    expect(result.reason).toBe('goal-reached');
  });

  it('should not set goal-reached when position does not match', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
    ];
    const result = await interpreter.execute(blocks, 'skip', { x: 2, y: 0 });
    expect(result.success).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('should handle all move directions', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-down' },
      { id: '3', type: 'move-left' },
      { id: '4', type: 'move-up' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 0, y: 0 }); // back to start
  });
});
