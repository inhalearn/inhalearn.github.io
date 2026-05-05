import { describe, it, expect, beforeEach } from 'vitest';
import { Turtle } from './turtle';

describe('Turtle', () => {
  let turtle: Turtle;

  beforeEach(() => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
    });
  });

  describe('초기화', () => {
    it('should start at initial position', () => {
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should have trail with start position only', () => {
      const trail = turtle.getTrail();
      expect(trail).toHaveLength(1);
      expect(trail[0]).toEqual({ x: 0, y: 0 });
    });
  });

  describe('이동 성공 케이스', () => {
    it('should move right correctly', () => {
      const success = turtle.move('right');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });
    });

    it('should move down correctly', () => {
      const success = turtle.move('down');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 1 });
    });

    it('should move left correctly from non-zero position', () => {
      turtle.move('right');
      const success = turtle.move('left');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should move up correctly from non-zero position', () => {
      turtle.move('down');
      const success = turtle.move('up');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });
  });

  describe('경계 초과 이동 (실패 케이스)', () => {
    it('should not move up from top edge', () => {
      const success = turtle.move('up');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should not move left from left edge', () => {
      const success = turtle.move('left');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should not move right beyond grid size', () => {
      turtle = new Turtle({
        gridSize: 2,
        startPosition: { x: 1, y: 0 },
      });
      const success = turtle.move('right');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });
    });

    it('should not move down beyond grid size', () => {
      turtle = new Turtle({
        gridSize: 2,
        startPosition: { x: 0, y: 1 },
      });
      const success = turtle.move('down');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 1 });
    });
  });

  describe('벽 충돌 (실패 케이스)', () => {
    it('should detect wall collision when moving right', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 0, y: 0 },
        walls: [{ x: 1, y: 0 }],
      });
      const success = turtle.move('right');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should detect wall collision when moving down', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 0, y: 0 },
        walls: [{ x: 0, y: 1 }],
      });
      const success = turtle.move('down');
      expect(success).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should allow movement when no wall is present', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 0, y: 0 },
        walls: [{ x: 2, y: 0 }],
      });
      const success = turtle.move('right');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });
    });

    it('should handle multiple walls correctly', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 1, y: 1 },
        walls: [
          { x: 2, y: 1 },
          { x: 1, y: 2 },
          { x: 0, y: 1 },
        ],
      });

      expect(turtle.move('right')).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 1 });

      expect(turtle.move('down')).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 1 });

      expect(turtle.move('left')).toBe(false);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 1 });

      expect(turtle.move('up')).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });
    });
  });

  describe('trail 추적', () => {
    it('should track trail with each move', () => {
      turtle.move('right');
      turtle.move('down');
      const trail = turtle.getTrail();

      expect(trail).toHaveLength(3);
      expect(trail[0]).toEqual({ x: 0, y: 0 });
      expect(trail[1]).toEqual({ x: 1, y: 0 });
      expect(trail[2]).toEqual({ x: 1, y: 1 });
    });

    it('should not add to trail on failed move', () => {
      turtle.move('up');
      const trail = turtle.getTrail();

      expect(trail).toHaveLength(1);
      expect(trail[0]).toEqual({ x: 0, y: 0 });
    });

    it('should track complex path', () => {
      turtle.move('right');
      turtle.move('right');
      turtle.move('down');
      turtle.move('left');

      const trail = turtle.getTrail();
      expect(trail).toHaveLength(5);
      expect(trail[4]).toEqual({ x: 1, y: 1 });
    });
  });

  describe('reset', () => {
    it('should reset position to start', () => {
      turtle.move('right');
      turtle.move('down');
      turtle.reset();

      expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('should reset trail to start position only', () => {
      turtle.move('right');
      turtle.move('down');
      turtle.reset();

      const trail = turtle.getTrail();
      expect(trail).toHaveLength(1);
      expect(trail[0]).toEqual({ x: 0, y: 0 });
    });

    it('should allow movement after reset', () => {
      turtle.move('right');
      turtle.reset();

      const success = turtle.move('down');
      expect(success).toBe(true);
      expect(turtle.getPosition()).toEqual({ x: 0, y: 1 });
    });
  });

  describe('불변성 (immutability)', () => {
    it('should return immutable position copy', () => {
      const pos1 = turtle.getPosition();
      pos1.x = 999;
      pos1.y = 999;

      const pos2 = turtle.getPosition();
      expect(pos2).toEqual({ x: 0, y: 0 });
    });

    it('should return immutable trail copy', () => {
      turtle.move('right');
      const trail1 = turtle.getTrail();
      trail1[0].x = 999;
      trail1.push({ x: 999, y: 999 });

      const trail2 = turtle.getTrail();
      expect(trail2).toHaveLength(2);
      expect(trail2[0]).toEqual({ x: 0, y: 0 });
    });

    it('should maintain internal state integrity after external modifications', () => {
      const trail = turtle.getTrail();
      trail[0].x = 999;

      turtle.move('right');
      const newTrail = turtle.getTrail();

      expect(newTrail[0]).toEqual({ x: 0, y: 0 });
      expect(newTrail[1]).toEqual({ x: 1, y: 0 });
    });
  });

  describe('엣지 케이스', () => {
    it('should handle 0 walls array', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 0, y: 0 },
        walls: [],
      });

      const success = turtle.move('right');
      expect(success).toBe(true);
    });

    it('should handle minimum grid size (3x3)', () => {
      turtle = new Turtle({
        gridSize: 3,
        startPosition: { x: 1, y: 2 },
      });

      expect(turtle.move('up')).toBe(true);
      expect(turtle.move('up')).toBe(true);
      expect(turtle.move('up')).toBe(false);
    });

    it('should handle starting at different positions', () => {
      turtle = new Turtle({
        gridSize: 5,
        startPosition: { x: 2, y: 3 },
      });

      expect(turtle.getPosition()).toEqual({ x: 2, y: 3 });
      expect(turtle.getTrail()[0]).toEqual({ x: 2, y: 3 });
    });
  });
});
