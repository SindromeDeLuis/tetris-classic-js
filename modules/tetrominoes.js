/* const SHAPES2 = [
  [ // i
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // J
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0]
  ],
  [ // L
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0]
  ],
  [ // o
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [ // s
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // t
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [ // z
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0]
  ]
] */
const SHAPES = [
  [ // i
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // J
    [0, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 2, 0],
    [0, 2, 2, 0]
  ],
  [ // L
    [0, 0, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 3, 0]
  ],
  [ // o
    [0, 0, 0, 0],
    [0, 4, 4, 0],
    [0, 4, 4, 0],
    [0, 0, 0, 0]
  ],
  [ // s
    [0, 0, 0, 0],
    [0, 5, 5, 0],
    [5, 5, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // t
    [0, 0, 0, 0],
    [0, 6, 0, 0],
    [6, 6, 6, 0],
    [0, 0, 0, 0]
  ],
  [ // z
    [0, 0, 0, 0],
    [0, 7, 7, 0],
    [0, 0, 7, 7],
    [0, 0, 0, 0]
  ]
]

const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'red', 'magenta', 'green']

const slots = []

const TETROMINO = {
  position: { x: 3, y: -1/* -SHAPES[index].length */ },
  shape: SHAPES[slots[0]],
  color: COLORS[slots[0]],
  index: slots[0]
}
let previousTetromino = null
let nextTetromino = null

function setSlots () {
  for (let i = 0; i < 6; i++) {
    slots.push(Math.floor(Math.random() * SHAPES.length))
  }
  previousTetromino = null
  nextTetromino = null
}
// let index = Math.floor(Math.random() * SHAPES.length)

function resetPiece () {
  slots.shift()
  TETROMINO.position = { x: 3, y: -1 }
  TETROMINO.shape = SHAPES[slots[0]]
  TETROMINO.color = COLORS[slots[0]]
  TETROMINO.index = slots[0]
  slots.push(Math.floor(Math.random() * SHAPES.length))
  nextPiece()
}

function rotatePiece () {
  const rotated = []

  for (let i = 0; i < TETROMINO.shape[0].length; i++) {
    const row = []
    for (let j = TETROMINO.shape.length - 1; j >= 0; j--) {
      row.push(TETROMINO.shape[j][i])
    }
    rotated.push(row)
  }
  // return rotated
  TETROMINO.shape = rotated
}

function swapPiece () {
  if (previousTetromino === null) {
    previousTetromino = Object.assign({}, TETROMINO)
    resetPiece()
  } else {
    const auxTetromino = Object.assign({}, previousTetromino)
    previousTetromino = Object.assign({}, TETROMINO)
    TETROMINO.shape = auxTetromino.shape
    TETROMINO.color = auxTetromino.color
    TETROMINO.index = auxTetromino.index
    TETROMINO.position = { x: 3, y: -1 }
  }
  previousTetromino.shape = SHAPES[previousTetromino.index]
  return previousTetromino
}

function nextPiece () {
  nextTetromino = {
    position: { x: 0, y: 0 },
    shape: SHAPES[slots[1]],
    color: COLORS[slots[1]],
    index: slots[1]
  }
}

export { TETROMINO, nextTetromino, resetPiece, rotatePiece, swapPiece, slots, setSlots, COLORS }
