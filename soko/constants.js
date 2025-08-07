// Cells
export const EMPTY = 'empty'
export const WALL = 'wall'
export const BLOCK = 'block'
export const SUCCESS_BLOCK = 'success_block'
export const VOID = 'void'
export const PLAYER = 'player'

export const directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
}

export const keys = {
  [directions.up]: 'ArrowUp',
  [directions.down]: 'ArrowDown',
  [directions.left]: 'ArrowLeft',
  [directions.right]: 'ArrowRight',
  w: 'w',
  a: 'a',
  s: 's',
  d: 'd',
}

// export const size = {
//   height: 600,
//   width: 600,
// }

export const multiplier = 60

export const colors = {
  empty: { fill: '#ded7b3', stroke: '#ded7b3' },
  wall: { fill: '#868687', stroke: '#505051' },
  block: { fill: '#d9ae0a', stroke: '#C79300' },
  success_block: { fill: '#4ccd5a', stroke: '#3ca448' },
  void: { fill: '#dfbbb1', stroke: '#ca8e7d' },
  player: { fill: '#4f99e8', stroke: '#3f7ab9' },
}

// export levelOneMap = []
