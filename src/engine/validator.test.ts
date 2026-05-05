import { describe, expect, it } from 'vitest';
import { Validator } from './validator';
import { Block } from '@/types/block';
import { LevelConfig } from '@/types/level';

const validator = new Validator();

const baseLevel: LevelConfig = {
  id: 99,
  title: '테스트',
  mission: '테스트',
  gridSize: 7,
  startPosition: { x: 0, y: 0 },
  goalPosition: { x: 2, y: 2 },
  availableBlocks: ['move-right'],
  hints: [],
  optimalBlockCount: 4,
  completionMode: 'goal',
};

describe('Validator', () => {
  it('keeps optimal-block validation for existing stages', () => {
    const result = validator.validate(
      { x: 2, y: 2 },
      baseLevel,
      [
        { id: '1', type: 'move-right' },
        { id: '2', type: 'move-right' },
        { id: '3', type: 'move-down' },
        { id: '4', type: 'move-down' },
      ]
    );

    expect(result).toEqual({
      success: true,
      stars: 3,
    });
  });

  it('scores repeat-usage levels with repeat count requirements', () => {
    const level: LevelConfig = {
      ...baseLevel,
      id: 3,
      starRules: {
        type: 'repeat-usage',
        minRepeatBlocksForThreeStars: 2,
        minRepeatBlocksForTwoStars: 1,
      },
    };
    const blocks: Block[] = [
      {
        id: 'repeat-1',
        type: 'repeat',
        count: 2,
        children: [{ id: 'move-1', type: 'move-right' }],
      },
      {
        id: 'repeat-2',
        type: 'repeat',
        count: 2,
        children: [{ id: 'move-2', type: 'move-down' }],
      },
    ];

    const result = validator.validate({ x: 2, y: 2 }, level, blocks);

    expect(result.stars).toBe(3);
  });

  it('scores maze levels with repeat usage and block limits', () => {
    const level: LevelConfig = {
      ...baseLevel,
      id: 4,
      starRules: {
        type: 'repeat-usage',
        minRepeatBlocksForThreeStars: 1,
        threeStarMaxBlocks: 10,
        twoStarMaxBlocks: 15,
      },
    };
    const blocks: Block[] = [
      {
        id: 'repeat-1',
        type: 'repeat',
        count: 5,
        children: [{ id: 'move-1', type: 'move-right' }],
      },
      { id: 'move-2', type: 'move-down' },
    ];

    const result = validator.validate({ x: 2, y: 2 }, level, blocks);

    expect(result.stars).toBe(3);
  });

  it('returns fallback stars when repeat threshold is missed', () => {
    const level: LevelConfig = {
      ...baseLevel,
      starRules: {
        type: 'repeat-usage',
        minRepeatBlocksForThreeStars: 2,
        minRepeatBlocksForTwoStars: 1,
      },
    };

    const result = validator.validate(
      { x: 2, y: 2 },
      level,
      [{ id: '1', type: 'move-right' }]
    );

    expect(result.stars).toBe(3);
  });
});
