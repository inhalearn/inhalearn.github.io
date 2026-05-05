export type BlockType =
  | 'move-up'
  | 'move-down'
  | 'move-left'
  | 'move-right'
  | 'repeat'
  | 'color'
  | 'pen-up'
  | 'pen-down';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface MoveBlock extends BaseBlock {
  type: 'move-up' | 'move-down' | 'move-left' | 'move-right';
}

export interface RepeatBlock extends BaseBlock {
  type: 'repeat';
  count: number; // 반복 횟수 (1-10)
  children: Block[]; // 중첩된 블록들
}

export interface ColorBlock extends BaseBlock {
  type: 'color';
  color: string; // hex 색상 코드
}

export interface PenBlock extends BaseBlock {
  type: 'pen-up' | 'pen-down';
}

export type Block = MoveBlock | RepeatBlock | ColorBlock | PenBlock;
