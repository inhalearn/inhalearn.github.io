import { describe, expect, it } from 'vitest';
import { getLevelById, getNextLevelId, levels } from './levels';

describe('levels', () => {
  it('contains stage 0, stage 1, and stage 2', () => {
    expect(levels).toHaveLength(3);
    expect(levels.map((level) => level.id)).toEqual([0, 1, 2]);
  });

  it('matches available blocks for stage 0, 1, and initial stage 2', () => {
    expect(levels[0].availableBlocks).toEqual(['move-right']);
    expect(levels[1].availableBlocks).toEqual(['move-up', 'move-right']);
    expect(levels[2].availableBlocks).toEqual(['move-right']);
  });

  it('returns a level by id', () => {
    expect(getLevelById(0)?.title).toBe('튜토리얼');
    expect(getLevelById(1)?.title).toBe('계단 오르기');
    expect(getLevelById(2)?.title).toBe('반복의 발견');
    expect(getLevelById(999)).toBeUndefined();
  });

  it('returns next level id when one exists', () => {
    expect(getNextLevelId(0)).toBe(1);
    expect(getNextLevelId(1)).toBe(2);
  });

  it('returns null when level is last or missing', () => {
    expect(getNextLevelId(2)).toBeNull();
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

  it('stores discovery metadata for stage 2', () => {
    const stageTwo = getLevelById(2);

    expect(stageTwo?.discoveryMode).toBe(true);
    expect(stageTwo?.unlockRepeatAt).toBe(5);
    expect(stageTwo?.availableBlocks).not.toContain('repeat');
  });
});
