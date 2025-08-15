import {
  EMPTY,
  BLOCK,
  SUCCESS_BLOCK,
  VOID,
  PLAYER,
  directions,
  // size,
  multiplier,
  colors,
  // levelOneMap,
} from './constants.js'
import {
  isBlock,
  isWall,
  isTraversible,
  isVoid,
  getX,
  getY,
  countBlocks,
  generateGameBoard,
  generateGameBoardOg,
  PlaySound
} from './utils.js'

import {getAttempts, getPageId, getCount_down, getCount_left, getCount_right, getCount_up} from './script.js'
let size;
let targets_left;

export function getTargetsLeft() {
    return targets_left;
}


class Sokoban {
  constructor(level, width, height) {
    // console.log(width,height)
    size = { width : width, height : height}
    this.canvas = document.querySelector('canvas')
    this.canvas.width = size.width
    this.canvas.height = size.height


    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = colors.empty
    this.context.fillRect(0, 0, size.width, size.height)
    this.Paused = false
    this.level = level
    this.levelOneMap = generateGameBoardOg(level)
    this.board = generateGameBoard(level)

    const canvas = document.getElementById("sokocanvas");
    canvas.focus();
    canvas.addEventListener("blur", () => 
    {
        console.log("level paused")
        this.Paused = true
        this.render()
    });

    canvas.addEventListener("focus", () => {
        console.log("level resumed")
        this.Paused = false
        this.render()
    });

  }

  paintCell(context, cell, x, y) {
    if (cell === 'void' || cell === 'player') {
      const circleSize = cell === 'player' ? 20 : 10

      this.context.beginPath()
      this.context.rect(x * multiplier, y * multiplier, multiplier, multiplier)
      this.context.fillStyle = colors.empty.fill
      this.context.fill()

      this.context.beginPath()
      this.context.arc(x * multiplier + multiplier / 2, y * multiplier + multiplier / 2, circleSize, 0, 2 * Math.PI)
      this.context.lineWidth = 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.fillStyle = colors[cell].fill
      this.context.fill()
      this.context.stroke()
    } else {
      this.context.beginPath()
      this.context.rect(x * multiplier + 5, y * multiplier + 5, multiplier - 10, multiplier - 10)
      this.context.fillStyle = colors[cell].fill
      this.context.fill()

      this.context.beginPath()
      this.context.rect(x * multiplier + 5, y * multiplier + 5, multiplier - 10, multiplier - 10)
      this.context.lineWidth = 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.stroke()
    }
  }

  render(options = {}) {
    if (options.restart) {
      this.board = generateGameBoard(this.level)
    }
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.paintCell(this.context, cell, x, y)
      })
    })

    const rowsWithVoid = this.board.filter((row) => row.some((entry) => entry === VOID))
    // The player herself might be standing on an initially void cell:
    if (isVoid(this.levelOneMap[this.findPlayerCoords().y][this.findPlayerCoords().x])) {
      rowsWithVoid.push(this.levelOneMap[this.findPlayerCoords().y]);
    }

    const rowsWithSuccess = this.board.filter((row) => row.some((entry) => entry === SUCCESS_BLOCK))
    targets_left = rowsWithVoid.length
    const isWin = rowsWithVoid.length === 0

    if(this.Paused){
      this.context.font = 'bold 18px sans-serif'
      this.context.fillStyle = '#111'
      const text1Width = this.context.measureText('PAUSED').width;
      const text2Width = this.context.measureText('click to continue').width;

      // Draw text centered horizontally
      this.context.fillText('PAUSED', (this.canvas.width - text1Width) / 2, this.canvas.height / 2 - 10);
      this.context.fillText('click to continue', (this.canvas.width - text2Width) / 2, this.canvas.height / 2 + 15);
    }

    if (isWin) {
      // A winner is you
      this.context.fillStyle = '#111'
      this.context.fillRect(0, 0, size.width, size.height)
      this.context.font = 'bold 40px sans-serif'
      this.context.fillStyle = colors.success_block.fill
      this.context.fillText('You did it!', 130, 250)
      let outcome_obj = {
          "game": "soko",
          "id": PageId,
          "attempt": getAttempts(),
          "t": Date.now(),
          "res" : "success",
          "right_key": getCount_right(),
          "left_key": getCount_left(),
          "down_key": getCount_down(),
          "up_key": getCount_up(),
          "targets_left" : rowsWithVoid.length
        }
        justsendtoparent(`log_${PageId}_${Attempts}`, outcome_obj)
        console.log(outcome_obj)
      // clearLocalStorage()
      this.board = generateGameBoard(this.level)
    }
  }

  findPlayerCoords() {
    const y = this.board.findIndex((row) => row.includes(PLAYER))
    const x = this.board[y].indexOf(PLAYER)

    return {
      x,
      y,
      above: this.board[y - 1][x],
      below: this.board[y + 1][x],
      sideLeft: this.board[y][x - 1],
      sideRight: this.board[y][x + 1],
    }
  }

  movePlayer(playerCoords, direction) {
    // Replace previous spot with initial board state (void or empty)
    this.board[playerCoords.y][playerCoords.x] =
      isVoid(this.levelOneMap[playerCoords.y][playerCoords.x]) ? VOID : EMPTY

    // Move player
    this.board[getY(playerCoords.y, direction, 1)][getX(playerCoords.x, direction, 1)] = PLAYER
    PlaySound()
  }

  movePlayerAndBoxes(playerCoords, direction) {
    const newPlayerY = getY(playerCoords.y, direction, 1)
    const newPlayerX = getX(playerCoords.x, direction, 1)
    const newBoxY = getY(playerCoords.y, direction, 2)
    const newBoxX = getX(playerCoords.x, direction, 2)

    // Don't move if the movement pushes a box into a wall
    if (isWall(this.board[newBoxY][newBoxX])) {
      return
    }

    // Count how many blocks are in a row
    let blocksInARow = 0
    if (isBlock(this.board[newBoxY][newBoxX])) {
      blocksInARow = countBlocks(1, newBoxY, newBoxX, direction, this.board)
      // See what the next block is
      if (blocksInARow == 1){
        const nextBlock =
        this.board[getY(newPlayerY, direction, blocksInARow)][
          getX(newPlayerX, direction, blocksInARow)
        ]
      // Push all the blocks if you can
      if (isTraversible(nextBlock)) {
        for (let i = 0; i < blocksInARow; i++) {
          // Add blocks
          this.board[getY(newBoxY, direction, i)][getX(newBoxX, direction, i)] =
            isVoid(this.levelOneMap[getY(newBoxY, direction, i)][getX(newBoxX, direction, i)])
              ? SUCCESS_BLOCK
              : BLOCK
        }
        this.movePlayer(playerCoords, direction)
      }
      }
    } else {
      // Move box
      // If on top of void, make into a success box
      this.board[newBoxY][newBoxX] = isVoid(this.levelOneMap[newBoxY][newBoxX]) ? SUCCESS_BLOCK : BLOCK
      this.movePlayer(playerCoords, direction)
    }
  }

  move(playerCoords, direction) {
    if (!this.Paused){
      const { x, y, above, below, sideLeft, sideRight } = playerCoords

    const adjacentCell = {
      [directions.up]: above,
      [directions.down]: below,
      [directions.left]: sideLeft,
      [directions.right]: sideRight,
    }

    if (isTraversible(adjacentCell[direction])) {this.movePlayer(playerCoords, direction)}

    if (isBlock(adjacentCell[direction])) {this.movePlayerAndBoxes(playerCoords, direction)}
    }
  }
}

export default Sokoban
