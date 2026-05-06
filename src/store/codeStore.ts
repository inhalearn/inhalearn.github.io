/**
 * Code Store - manages the block editor state
 * Handles adding, removing, updating, and clearing blocks
 * Does NOT handle localStorage (that's progressStore's job)
 */

import { create } from 'zustand';
import {
  Block,
  MoveBlock,
  RepeatBlock,
  ColorBlock,
  PenBlock,
} from '../types/block';
import { MAX_BLOCKS } from '../utils/constants';

// Type for updates that can be applied to any block
// Using a more flexible type to handle discriminated unions
type BlockUpdates =
  | Partial<MoveBlock>
  | Partial<RepeatBlock>
  | Partial<ColorBlock>
  | Partial<PenBlock>;

interface CodeStore {
  blocks: Block[];
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: BlockUpdates) => void;
  clearBlocks: () => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  blocks: [],

  addBlock: (block) =>
    set((state) => {
      // Enforce MAX_BLOCKS limit
      if (state.blocks.length >= MAX_BLOCKS) {
        console.warn(
          `최대 블록 수(${MAX_BLOCKS})를 초과했습니다. 블록을 추가할 수 없습니다.`
        );
        return state; // Don't add, return unchanged state
      }

      // Add block to end of list (immutably)
      return { blocks: [...state.blocks, block] };
    }),

  removeBlock: (id) =>
    set((state) => ({
      // Filter out the block with matching id (immutably)
      blocks: state.blocks.filter((block) => block.id !== id),
    })),

  updateBlock: (id, updates) =>
    set((state) => ({
      // Map through blocks and update the matching one (immutably)
      // Cast is safe because we're merging partial updates into the existing block
      blocks: state.blocks.map((block) =>
        block.id === id ? ({ ...block, ...updates } as Block) : block
      ),
    })),

  clearBlocks: () =>
    set({
      blocks: [],
    }),
}));
