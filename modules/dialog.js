import { resetGame, setPauseState, update } from './board'
import { CONTROLS } from './controls'
import { playMusic } from './music'

const back = document.querySelector('.dialog__back')

export const newGameDialog = document.querySelector('#newGame')
const startBtn = document.querySelector('#start')

startBtn.addEventListener('click', (e) => {
  resetGame()
  update()
  playMusic()
  closeDialog(newGameDialog)
})

const pauseDialog = document.querySelector('#pause')
const continueBtn = document.querySelector('#continue')
const resetBtn = document.querySelector('#reset')

continueBtn.addEventListener('click', (e) => {
  setPauseState(false)
  update()
  closeDialog(pauseDialog)
})

resetBtn.addEventListener('click', (e) => {
  resetGame()
  update()
  closeDialog(pauseDialog)
})

document.addEventListener('keydown', (event) => {
  if (event.key === CONTROLS.PAUSE) {
    setPauseState(true)
    pauseDialog.showModal()
    back.style.background = 'rgba(0,0,0,0.7)'
  }
  if (event.key === CONTROLS.ESC && pauseDialog.open) {
    setPauseState(true)
    update()
    closeDialog(pauseDialog)
  }
})

function closeDialog (dialog) {
  dialog.close()
  back.style.background = 'rgba(0,0,0,0)'
}
