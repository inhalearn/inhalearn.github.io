/**
 * Block type definitions for InhaLearn
 * Represents all available block types in the visual programming interface
 */

export type BlockType =
  | 'move-up'
  | 'move-down'
  | 'move-left'
  | 'move-right'
  | 'repeat'
  | 'color'
  | 'pen-up'
  | 'pen-down';

/**
 * Base block interface - all blocks extend this
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
}

/**
 * Movement block - moves in a single direction
 */
export interface MoveBlock extends BaseBlock {
  type: 'move-up' | 'move-down' | 'move-left' | 'move-right';
}

/**
 * Repeat block - executes children multiple times
 * Supports nesting up to MAX_REPEAT_DEPTH (3) levels
 */
export interface RepeatBlock extends BaseBlock {
  type: 'repeat';
  count: number; // 1-10 only
  children: Block[];
}

/**
 * Color block - changes pen color
 */
export interface ColorBlock extends BaseBlock {
  type: 'color';
  color: string; // hex color code
}

/**
 * Pen control blocks - raise/lower pen
 */
export interface PenBlock extends BaseBlock {
  type: 'pen-up' | 'pen-down';
}

/**
 * Union type of all possible blocks
 */
export type Block = MoveBlock | RepeatBlock | ColorBlock | PenBlock;
