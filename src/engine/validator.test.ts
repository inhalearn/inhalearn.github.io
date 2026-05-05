import { describe, it, expect, beforeEach } from 'vitest';
import { Validator } from './validator';
import { Position } from '@/types/position';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('checkGoalReached', () => {
    it('목표 위치에 도달했을 때 true 반환', () => {
      const current: Position = { x: 3, y: 3 };
      const goal: Position = { x: 3, y: 3 };
      expect(validator.checkGoalReached(current, goal)).toBe(true);
    });

    it('목표 위치에 도달하지 못했을 때 false 반환 (x 불일치)', () => {
      const current: Position = { x: 2, y: 3 };
      const goal: Position = { x: 3, y: 3 };
      expect(validator.checkGoalReached(current, goal)).toBe(false);
    });

    it('목표 위치에 도달하지 못했을 때 false 반환 (y 불일치)', () => {
      const current: Position = { x: 3, y: 2 };
      const goal: Position = { x: 3, y: 3 };
      expect(validator.checkGoalReached(current, goal)).toBe(false);
    });

    it('목표 위치에 도달하지 못했을 때 false 반환 (x, y 모두 불일치)', () => {
      const current: Position = { x: 0, y: 0 };
      const goal: Position = { x: 3, y: 3 };
      expect(validator.checkGoalReached(current, goal)).toBe(false);
    });

    it('시작 위치와 목표가 같을 때 true 반환', () => {
      const current: Position = { x: 0, y: 0 };
      const goal: Position = { x: 0, y: 0 };
      expect(validator.checkGoalReached(current, goal)).toBe(true);
    });
  });

  describe('calculateStars', () => {
    it('최적 블록 수 정확히 사용 시 3개 별 반환', () => {
      expect(validator.calculateStars(5, 5)).toBe(3);
    });

    it('최적 블록 수보다 적게 사용 시 2개 별 반환 (1.5 이하)', () => {
      // 3 < 5, 그리고 3 <= floor(5 × 1.5) = 7 이므로 2개
      expect(validator.calculateStars(3, 5)).toBe(2);
    });

    it('최적 × 1.5 이하 사용 시 2개 별 반환 (정확히 1.5배)', () => {
      // 5 × 1.5 = 7.5 → floor(7.5) = 7
      expect(validator.calculateStars(7, 5)).toBe(2);
    });

    it('최적 × 1.5 이하 사용 시 2개 별 반환 (최적 + 1)', () => {
      expect(validator.calculateStars(6, 5)).toBe(2);
    });

    it('최적 × 1.5 초과 사용 시 1개 별 반환', () => {
      // 5 × 1.5 = 7.5 → floor(7.5) = 7, 8 > 7 이므로 1개
      expect(validator.calculateStars(8, 5)).toBe(1);
    });

    it('최적 × 1.5 초과 사용 시 1개 별 반환 (많이 초과)', () => {
      expect(validator.calculateStars(20, 5)).toBe(1);
    });

    it('경계값: 최적이 1일 때 정확히 사용 → 3개', () => {
      expect(validator.calculateStars(1, 1)).toBe(3);
    });

    it('경계값: 최적이 1일 때 1.5 이하 → 2개', () => {
      // 1 × 1.5 = 1.5 → floor(1.5) = 1, 1 <= 1 이므로 3개 (같음)
      expect(validator.calculateStars(1, 1)).toBe(3);
    });

    it('경계값: 최적이 2일 때 3 사용 → 2개', () => {
      // 2 × 1.5 = 3.0 → floor(3.0) = 3, 3 <= 3 이므로 2개
      expect(validator.calculateStars(3, 2)).toBe(2);
    });

    it('경계값: 최적이 2일 때 4 사용 → 1개', () => {
      // 2 × 1.5 = 3.0 → floor(3.0) = 3, 4 > 3 이므로 1개
      expect(validator.calculateStars(4, 2)).toBe(1);
    });

    it('경계값: 최적이 10일 때 15 사용 → 2개', () => {
      // 10 × 1.5 = 15.0 → floor(15.0) = 15, 15 <= 15 이므로 2개
      expect(validator.calculateStars(15, 10)).toBe(2);
    });

    it('경계값: 최적이 10일 때 16 사용 → 1개', () => {
      // 10 × 1.5 = 15.0 → floor(15.0) = 15, 16 > 15 이므로 1개
      expect(validator.calculateStars(16, 10)).toBe(1);
    });
  });

  describe('validate', () => {
    it('목표 도달 + 최적 블록 사용 → success: true, stars: 3', () => {
      const current: Position = { x: 3, y: 3 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 5, 5);
      expect(result).toEqual({ success: true, stars: 3 });
    });

    it('목표 도달 + 최적 × 1.5 이하 사용 → success: true, stars: 2', () => {
      const current: Position = { x: 3, y: 3 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 7, 5);
      expect(result).toEqual({ success: true, stars: 2 });
    });

    it('목표 도달 + 최적 × 1.5 초과 사용 → success: true, stars: 1', () => {
      const current: Position = { x: 3, y: 3 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 10, 5);
      expect(result).toEqual({ success: true, stars: 1 });
    });

    it('목표 미도달 → success: false, stars: 0 (블록 수 무관, 최적 사용)', () => {
      const current: Position = { x: 2, y: 2 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 5, 5);
      expect(result).toEqual({ success: false, stars: 0 });
    });

    it('목표 미도달 → success: false, stars: 0 (블록 수 무관, 많이 사용)', () => {
      const current: Position = { x: 2, y: 2 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 20, 5);
      expect(result).toEqual({ success: false, stars: 0 });
    });

    it('목표 미도달 → success: false, stars: 0 (블록 수 무관, 적게 사용)', () => {
      const current: Position = { x: 2, y: 2 };
      const goal: Position = { x: 3, y: 3 };
      const result = validator.validate(current, goal, 3, 5);
      expect(result).toEqual({ success: false, stars: 0 });
    });

    it('시작 위치가 목표 위치와 같을 때 (블록 0개) → success: true, stars: 3', () => {
      const current: Position = { x: 0, y: 0 };
      const goal: Position = { x: 0, y: 0 };
      const result = validator.validate(current, goal, 0, 0);
      expect(result).toEqual({ success: true, stars: 3 });
    });
  });
});
