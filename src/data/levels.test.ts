import { describe, expect, it } from 'vitest';
import { getLevelById, getNextLevelId, levels } from './levels';

describe('levels', () => {
  it('contains all six core stages', () => {
    expect(levels).toHaveLength(6);
    expect(levels.map((level) => level.id)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('matches available blocks for early stages', () => {
    expect(levels[0].availableBlocks).toEqual(['move-right']);
    expect(levels[1].availableBlocks).toEqual(['move-up', 'move-right']);
    expect(levels[2].availableBlocks).toEqual(['move-right']);
  });

  it('includes four directions and repeat for stage 3', () => {
    const stageThree = getLevelById(3);

    expect(stageThree?.availableBlocks).toEqual([
      'move-right',
      'move-down',
      'move-left',
      'move-up',
      'repeat',
    ]);
    expect(stageThree?.starRules).toEqual({
      type: 'repeat-usage',
      minRepeatBlocksForThreeStars: 2,
      minRepeatBlocksForTwoStars: 1,
    });
  });

  it('returns a level by id', () => {
    expect(getLevelById(0)?.title).toBe('튜토리얼');
    expect(getLevelById(1)?.title).toBe('계단 오르기');
    expect(getLevelById(2)?.title).toBe('반복의 발견');
    expect(getLevelById(3)?.title).toBe('사각형 그리기');
    expect(getLevelById(4)?.title).toBe('미로 탈출');
    expect(getLevelById(5)?.title).toBe('나만의 그림');
    expect(getLevelById(999)).toBeUndefined();
  });

  it('returns next level id when one exists', () => {
    expect(getNextLevelId(0)).toBe(1);
    expect(getNextLevelId(1)).toBe(2);
    expect(getNextLevelId(4)).toBe(5);
  });

  it('returns null when level is last or missing', () => {
    expect(getNextLevelId(5)).toBeNull();
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

  it('keeps stage 4 walls separate from the goal cell', () => {
    const stageFour = getLevelById(4);

    expect(stageFour).toBeDefined();
    expect(
      stageFour?.walls?.some(
        (wall) =>
          wall.x === stageFour.goalPosition.x && wall.y === stageFour.goalPosition.y
      )
    ).toBe(false);
  });

  it('stores free-draw metadata for stage 5', () => {
    const stageFive = getLevelById(5);

    expect(stageFive?.completionMode).toBe('free-draw');
    expect(stageFive?.palette).toEqual([
      '#0099CC',
      '#33B5E5',
      '#9E9E9E',
      '#212121',
    ]);
    expect(stageFive?.presetMissions?.map((mission) => mission.id)).toEqual([
      'inha',
      'heart',
      'free',
    ]);
    expect(stageFive?.starRules).toEqual({
      type: 'free-draw',
      autoStars: 3,
    });
  });
});
