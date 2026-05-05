import { Block, BlockType } from '@/types/block';

export function getBlockTypeLabel(type: BlockType): string {
  switch (type) {
    case 'move-up':
      return '위로';
    case 'move-down':
      return '아래로';
    case 'move-left':
      return '왼쪽';
    case 'move-right':
      return '오른쪽';
    case 'repeat':
      return '반복';
    case 'color':
      return '색깔';
    case 'pen-up':
      return '펜 들기';
    case 'pen-down':
      return '펜 놓기';
  }
}

export function getBlockLabel(block: Block): string {
  switch (block.type) {
    case 'move-up':
      return '⬆️ 위로';
    case 'move-down':
      return '⬇️ 아래로';
    case 'move-left':
      return '⬅️ 왼쪽';
    case 'move-right':
      return '➡️ 오른쪽';
    case 'repeat':
      return `🔁 ${block.count}번 반복`;
    case 'color':
      return `🎨 색상 ${block.color}`;
    case 'pen-up':
      return '✏️ 펜 들기';
    case 'pen-down':
      return '🖍️ 펜 놓기';
  }
}
