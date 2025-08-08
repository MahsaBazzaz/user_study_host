import { EMPTY, WALL, BLOCK, SUCCESS_BLOCK, VOID, PLAYER } from './constants.js'

// Helpers
export const isBlock = (cell) => [BLOCK, SUCCESS_BLOCK].includes(cell)
export const isPlayer = (cell) => [PLAYER].includes(cell)
export const isTraversible = (cell) => [EMPTY, VOID].includes(cell)
export const isWall = (cell) => [WALL].includes(cell)
export const isVoid = (cell) => [VOID, SUCCESS_BLOCK].includes(cell)
export const sound = new Audio("move.ogg")

export const PlaySound = (name, loop) => {
    	sound.play();
}
    
export const getX = (x, direction, spaces = 1) => {
  if (direction === 'up' || direction === 'down') {
    return x
  }
  if (direction === 'right') {
    return x + spaces
  }
  if (direction === 'left') {
    return x - spaces
  }
}

export const getY = (y, direction, spaces = 1) => {
  if (direction === 'left' || direction === 'right') {
    return y
  }
  if (direction === 'down') {
    return y + spaces
  }
  if (direction === 'up') {
    return y - spaces
  }
}

export function generateGameBoardOg(level) {
  // console.log('Level text:', level);
  let arr = []
  if (level){
    const rows = level.split('\n');
    for (let row = 0; row < rows.length; row++) {
          arr[row] = [];
          for (let col = 0; col < rows[row].length; col++) {
              var char = rows[row][col]
              if (char == "#"){
                arr[row][col] = WALL
              }
              else if (char == "-" || char == " "){
                arr[row][col] = EMPTY
              }
              else if (char == "@"){
                arr[row][col] = PLAYER
              }
              else if (char == "$"){
                arr[row][col] = BLOCK
              }
              else if (char == "."){
                arr[row][col] = VOID
              }
              else if (char == "O" || char == "*"){
                arr[row][col] = SUCCESS_BLOCK
              }
            }}
  }
  return arr
}

export function generateGameBoard(level) {
  let arr = generateGameBoardOg(level)
  return JSON.parse(JSON.stringify(arr)) 
}

export function countBlocks(blockCount, y, x, direction, board) {
  if (isBlock(board[y][x])) {
    blockCount++
    return countBlocks(blockCount, getY(y, direction), getX(x, direction), direction, board)
  } else {
    return blockCount
  }
}
