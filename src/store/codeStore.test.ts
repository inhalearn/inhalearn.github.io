/**
 * Tests for Code Store
 * Verifies block management functionality and immutability
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCodeStore } from './codeStore';
import { MoveBlock, RepeatBlock } from '../types/block';
import { MAX_BLOCKS } from '../utils/constants';

describe('codeStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useCodeStore.getState().clearBlocks();
  });

  describe('addBlock', () => {
    it('should add a block to empty list', () => {
      const block: MoveBlock = { id: '1', type: 'move-right' };

      useCodeStore.getState().addBlock(block);

      expect(useCodeStore.getState().blocks).toHaveLength(1);
      expect(useCodeStore.getState().blocks[0]).toEqual(block);
    });

    it('should add multiple blocks in order', () => {
      const block1: MoveBlock = { id: '1', type: 'move-right' };
      const block2: MoveBlock = { id: '2', type: 'move-up' };
      const block3: MoveBlock = { id: '3', type: 'move-left' };

      const { addBlock } = useCodeStore.getState();
      addBlock(block1);
      addBlock(block2);
      addBlock(block3);

      const blocks = useCodeStore.getState().blocks;
      expect(blocks).toHaveLength(3);
      expect(blocks[0].id).toBe('1');
      expect(blocks[1].id).toBe('2');
      expect(blocks[2].id).toBe('3');
    });

    it('should not exceed MAX_BLOCKS limit', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Add MAX_BLOCKS blocks
      for (let i = 0; i < MAX_BLOCKS; i++) {
        useCodeStore.getState().addBlock({
          id: `block-${i}`,
          type: 'move-right',
        });
      }

      expect(useCodeStore.getState().blocks).toHaveLength(MAX_BLOCKS);

      // Try to add one more
      useCodeStore.getState().addBlock({
        id: 'overflow',
        type: 'move-right',
      });

      // Should still be MAX_BLOCKS (not added)
      expect(useCodeStore.getState().blocks).toHaveLength(MAX_BLOCKS);

      // Should have warned
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('최대 블록 수')
      );

      warnSpy.mockRestore();
    });

    it('should add repeat blocks with children', () => {
      const repeatBlock: RepeatBlock = {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [{ id: '2', type: 'move-right' }],
      };

      useCodeStore.getState().addBlock(repeatBlock);

      const blocks = useCodeStore.getState().blocks;
      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('repeat');
      if (blocks[0].type === 'repeat') {
        expect(blocks[0].count).toBe(3);
        expect(blocks[0].children).toHaveLength(1);
      }
    });
  });

  describe('removeBlock', () => {
    it('should remove a block by id', () => {
      const block1: MoveBlock = { id: '1', type: 'move-right' };
      const block2: MoveBlock = { id: '2', type: 'move-up' };

      const { addBlock, removeBlock } = useCodeStore.getState();
      addBlock(block1);
      addBlock(block2);

      removeBlock('1');

      const blocks = useCodeStore.getState().blocks;
      expect(blocks).toHaveLength(1);
      expect(blocks[0].id).toBe('2');
    });

    it('should handle removing non-existent id gracefully', () => {
      const block: MoveBlock = { id: '1', type: 'move-right' };

      const { addBlock, removeBlock } = useCodeStore.getState();
      addBlock(block);

      // Remove non-existent id (should not error)
      removeBlock('non-existent');

      // Original block should still be there
      expect(useCodeStore.getState().blocks).toHaveLength(1);
      expect(useCodeStore.getState().blocks[0].id).toBe('1');
    });

    it('should handle removing from empty list', () => {
      // Should not error
      useCodeStore.getState().removeBlock('any-id');

      expect(useCodeStore.getState().blocks).toHaveLength(0);
    });

    it('should remove middle block correctly', () => {
      const { addBlock, removeBlock } = useCodeStore.getState();

      addBlock({ id: '1', type: 'move-right' });
      addBlock({ id: '2', type: 'move-up' });
      addBlock({ id: '3', type: 'move-down' });

      removeBlock('2');

      const blocks = useCodeStore.getState().blocks;
      expect(blocks).toHaveLength(2);
      expect(blocks[0].id).toBe('1');
      expect(blocks[1].id).toBe('3');
    });
  });

  describe('updateBlock', () => {
    it('should update a block by id', () => {
      const repeatBlock: RepeatBlock = {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [],
      };

      const { addBlock, updateBlock } = useCodeStore.getState();
      addBlock(repeatBlock);

      // Update count
      updateBlock('1', { count: 5 });

      const blocks = useCodeStore.getState().blocks;
      expect(blocks).toHaveLength(1);
      if (blocks[0].type === 'repeat') {
        expect(blocks[0].count).toBe(5);
      }
    });

    it('should handle updating non-existent id gracefully', () => {
      const block: MoveBlock = { id: '1', type: 'move-right' };

      const { addBlock, updateBlock } = useCodeStore.getState();
      addBlock(block);

      // Update non-existent id (should not error)
      updateBlock('non-existent', { type: 'move-up' });

      // Original block should be unchanged
      expect(useCodeStore.getState().blocks).toHaveLength(1);
      expect(useCodeStore.getState().blocks[0]).toEqual(block);
    });

    it('should only update specified fields', () => {
      const repeatBlock: RepeatBlock = {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [{ id: '2', type: 'move-right' }],
      };

      const { addBlock, updateBlock } = useCodeStore.getState();
      addBlock(repeatBlock);

      // Update only count
      updateBlock('1', { count: 7 });

      const blocks = useCodeStore.getState().blocks;
      if (blocks[0].type === 'repeat') {
        expect(blocks[0].count).toBe(7);
        expect(blocks[0].children).toHaveLength(1); // children unchanged
      }
    });
  });

  describe('clearBlocks', () => {
    it('should clear all blocks', () => {
      const { addBlock, clearBlocks } = useCodeStore.getState();

      addBlock({ id: '1', type: 'move-right' });
      addBlock({ id: '2', type: 'move-up' });
      addBlock({ id: '3', type: 'move-down' });

      expect(useCodeStore.getState().blocks).toHaveLength(3);

      clearBlocks();

      expect(useCodeStore.getState().blocks).toHaveLength(0);
    });

    it('should handle clearing empty list', () => {
      // Should not error
      useCodeStore.getState().clearBlocks();

      expect(useCodeStore.getState().blocks).toHaveLength(0);
    });
  });

  describe('immutability', () => {
    it('should not mutate original blocks array on add', () => {
      const { addBlock } = useCodeStore.getState();

      addBlock({ id: '1', type: 'move-right' });
      const firstBlocks = useCodeStore.getState().blocks;

      addBlock({ id: '2', type: 'move-up' });
      const secondBlocks = useCodeStore.getState().blocks;

      // Should be different array instances
      expect(firstBlocks).not.toBe(secondBlocks);
      expect(firstBlocks).toHaveLength(1);
      expect(secondBlocks).toHaveLength(2);
    });

    it('should not mutate original blocks array on remove', () => {
      const { addBlock, removeBlock } = useCodeStore.getState();

      addBlock({ id: '1', type: 'move-right' });
      addBlock({ id: '2', type: 'move-up' });

      const beforeRemove = useCodeStore.getState().blocks;

      removeBlock('1');

      const afterRemove = useCodeStore.getState().blocks;

      // Should be different array instances
      expect(beforeRemove).not.toBe(afterRemove);
      expect(beforeRemove).toHaveLength(2);
      expect(afterRemove).toHaveLength(1);
    });

    it('should not mutate original blocks array on update', () => {
      const { addBlock, updateBlock } = useCodeStore.getState();

      addBlock({
        id: '1',
        type: 'repeat',
        count: 3,
        children: [],
      });

      const beforeUpdate = useCodeStore.getState().blocks;

      updateBlock('1', { count: 5 });

      const afterUpdate = useCodeStore.getState().blocks;

      // Should be different array instances
      expect(beforeUpdate).not.toBe(afterUpdate);

      // Original should be unchanged
      if (beforeUpdate[0].type === 'repeat') {
        expect(beforeUpdate[0].count).toBe(3);
      }

      // New should be updated
      if (afterUpdate[0].type === 'repeat') {
        expect(afterUpdate[0].count).toBe(5);
      }
    });
  });
});
