import { TETROMINO, nextTetromino, resetPiece, rotatePiece, swapPiece, setSlots, COLORS } from './tetrominoes.js'
import { CONTROLS } from './controls.js'
import { newGameDialog } from './dialog.js'

const CANVAS = document.querySelector('#board')
const CANVAS_CONTEXT = CANVAS.getContext('2d')

const PREV_PIECE = document.querySelector('#prev__piece')
const PREV_PIECE_CONTEXT = PREV_PIECE.getContext('2d')

const NEXT_PIECE = document.querySelector('#next__piece')
const NEXT_PIECE_CONTEXT = NEXT_PIECE.getContext('2d')

const LEVEL = document.querySelector('#level')
const SCORE = document.querySelector('#score')
const LINES = document.querySelector('#lines')

const BLOCK_SIZE = 32
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

CANVAS.width = BLOCK_SIZE * BOARD_WIDTH
CANVAS.height = BLOCK_SIZE * BOARD_HEIGHT

// CANVAS_CONTEXT.scale(BLOCK_SIZE, BLOCK_SIZE)

const BOARD = [
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ],
  [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0
  ]
]
// Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(0))

PREV_PIECE.width = BLOCK_SIZE * 4
PREV_PIECE.height = BLOCK_SIZE * 4

PREV_PIECE_CONTEXT.scale(BLOCK_SIZE, BLOCK_SIZE)
PREV_PIECE_CONTEXT.fillRect(0, 0, PREV_PIECE.width, PREV_PIECE.height)

NEXT_PIECE.width = BLOCK_SIZE * 4
NEXT_PIECE.height = BLOCK_SIZE * 4

NEXT_PIECE_CONTEXT.scale(BLOCK_SIZE, BLOCK_SIZE)
NEXT_PIECE_CONTEXT.fillRect(0, 0, NEXT_PIECE.width, NEXT_PIECE.height)

let score = 0.00
let totalLines = 0

const LEVELS = [0, 10, 20, 30, 40, 55, 65, 75, 100]
let level = 1

let lastTime = 0
let dropCounter = 0

let isSwappable = true

let isGamePaused = false
let isGameOver = false

export function update (time = 0) {
  if (!isGameOver && !isGamePaused) {
    autoDrop(time)
    draw()
    window.requestAnimationFrame(update)
  }
}

function draw () {
  CANVAS_CONTEXT.strokeStyle = 'black'
  CANVAS_CONTEXT.fillStyle = '#333'
  CANVAS_CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)

  BOARD.forEach((row, y) => {
    row.forEach((col, x) => {
      CANVAS_CONTEXT.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      if (col !== 0 && col !== null && col !== undefined) {
        CANVAS_CONTEXT.fillStyle = COLORS[col - 1]
        CANVAS_CONTEXT.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      }
    })
  })

  TETROMINO.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      CANVAS_CONTEXT.strokeRect((x + TETROMINO.position.x) * BLOCK_SIZE, (y + TETROMINO.position.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      if (col === TETROMINO.index + 1) {
        CANVAS_CONTEXT.fillStyle = TETROMINO.color
        CANVAS_CONTEXT.fillRect((x + TETROMINO.position.x) * BLOCK_SIZE, (y + TETROMINO.position.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      }
    })
  })
}

function drawPrevPiece (piece) {
  PREV_PIECE_CONTEXT.fillStyle = '#333'
  PREV_PIECE_CONTEXT.fillRect(0, 0, PREV_PIECE.width, PREV_PIECE.height)
  // console.log(piece)
  piece.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === piece.index + 1) {
        PREV_PIECE_CONTEXT.fillStyle = piece.color
        PREV_PIECE_CONTEXT.fillRect(x, y, 1, 1)
      }
    })
  })
}

function drawNextPiece (piece) {
  NEXT_PIECE_CONTEXT.fillStyle = '#333'
  NEXT_PIECE_CONTEXT.fillRect(0, 0, NEXT_PIECE.width, NEXT_PIECE.height)
  piece.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === piece.index + 1) {
        NEXT_PIECE_CONTEXT.fillStyle = piece.color
        NEXT_PIECE_CONTEXT.fillRect(x, y, 1, 1)
      }
    })
  })
}

document.addEventListener('keydown', event => {
  if (event.key === CONTROLS.LEFT) {
    TETROMINO.position.x--
    if (checkCollision()) {
      TETROMINO.position.x++
    }
  }

  if (event.key === CONTROLS.RIGHT) {
    TETROMINO.position.x++
    if (checkCollision()) {
      TETROMINO.position.x--
    }
  }

  if (event.key === CONTROLS.DOWN) {
    TETROMINO.position.y++
    checkGround()
  }

  if (event.key === CONTROLS.SPACE) {
    fullDrop()
  }

  if (event.key === CONTROLS.UP) {
    preventCollisionOnRotate()
  }

  if (event.key === CONTROLS.SWAP) {
    if (isSwappable) {
      const prevPiece = swapPiece()
      drawPrevPiece(prevPiece)
      drawNextPiece(nextTetromino)
      isSwappable = false
    }
  }
})

function checkCollision () {
  return TETROMINO.shape.find((row, y) => {
    return row.find((col, x) => {
      return (
        col !== 0 && col !== null && col !== undefined &&
        BOARD[y + TETROMINO.position.y]?.[x + TETROMINO.position.x] !== 0
      )
    })
  })
}

function checkGround () {
  let stop = true
  if (checkCollision()) {
    TETROMINO.position.y--
    solidifyPiece()
    removeLines()
    stop = false
  }
  return stop
}

function preventCollisionOnRotate () {
  const previousOrientation = TETROMINO.shape
  rotatePiece()
  if (checkCollision()) {
    TETROMINO.shape = previousOrientation
  }
}

function solidifyPiece () {
  TETROMINO.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col !== 0 && col !== null && col !== undefined) {
        BOARD[y + TETROMINO.position.y][x + TETROMINO.position.x] = TETROMINO.index + 1
      }
    })
  })
  resetPiece()
  drawNextPiece(nextTetromino)
  isSwappable = true
  gameOver()
}

function removeLines () {
  const line = []

  BOARD.forEach((row, y) => {
    if (row.every(x => x !== 0)) {
      line.push(y)
    }
  })

  line.forEach(y => {
    BOARD.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    BOARD.unshift(newRow)
    score += 10
  })

  if (line.length > 1) {
    score *= 1.25
  }

  totalLines += line.length
  LINES.textContent = totalLines
  if (totalLines >= LEVELS[level] && level < LEVELS.length) {
    level++
    LEVEL.textContent = level
  }

  SCORE.textContent = score.toFixed(2)
}

function autoDrop (time) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    TETROMINO.position.y += 1 * level
    dropCounter = 0
    checkGround()
  }
}

function fullDrop () {
  let stop = true
  while (stop) {
    TETROMINO.position.y++
    stop = checkGround()
  }
}

export function setPauseState (value) {
  isGamePaused = value
}

export function resetGame () {
  BOARD.forEach(row => row.fill(0))
  setSlots()
  resetPiece()
  PREV_PIECE_CONTEXT.fillStyle = '#333'
  PREV_PIECE_CONTEXT.fillRect(0, 0, PREV_PIECE.width, PREV_PIECE.height)
  NEXT_PIECE_CONTEXT.fillStyle = '#333'
  NEXT_PIECE_CONTEXT.fillRect(0, 0, NEXT_PIECE.width, NEXT_PIECE.height)
  drawNextPiece(nextTetromino)
  LEVEL.textContent = 1
  SCORE.textContent = '0.00'
  LINES.textContent = 0
  setPauseState(false)
  isGameOver = false
}

function gameOver () {
  if (checkCollision()) {
    BOARD.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col !== 0 && col !== null && col !== undefined) {
          CANVAS_CONTEXT.fillStyle = 'gray'
          CANVAS_CONTEXT.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
        }
      })
    })
    isGameOver = true
    newGameDialog.querySelector('p').textContent = 'Game over'
    newGameDialog.querySelector('#start').textContent = 'New game'
    newGameDialog.showModal()
  }
}
