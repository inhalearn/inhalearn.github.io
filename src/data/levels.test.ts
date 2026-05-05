import { describe, expect, it } from 'vitest';
import { getLevelById, getNextLevelId, levels } from './levels';

describe('levels', () => {
  it('contains stage 0 and stage 1', () => {
    expect(levels).toHaveLength(2);
    expect(levels.map((level) => level.id)).toEqual([0, 1]);
  });

  it('matches available blocks for stage 0 and 1', () => {
    expect(levels[0].availableBlocks).toEqual(['move-right']);
    expect(levels[1].availableBlocks).toEqual(['move-up', 'move-right']);
  });

  it('returns a level by id', () => {
    expect(getLevelById(0)?.title).toBe('튜토리얼');
    expect(getLevelById(1)?.title).toBe('계단 오르기');
    expect(getLevelById(999)).toBeUndefined();
  });

  it('returns next level id when one exists', () => {
    expect(getNextLevelId(0)).toBe(1);
  });

  it('returns null when level is last or missing', () => {
    expect(getNextLevelId(1)).toBeNull();
    expect(getNextLevelId(999)).toBeNull();
  });

  it('keeps stage 1 walls separate from the goal cell', () => {
    const stageOne = getLevelById(1);

    expect(stageOne).toBeDefined();
    expect(
      stageOne?.walls?.some(
        (wall) =>
          wall.x === stageOne.goalPosition.x && wall.y === stageOne.goalPosition.y
      )
    ).toBe(false);
  });
});
