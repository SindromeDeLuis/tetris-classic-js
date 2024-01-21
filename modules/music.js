const backgroundMusic = new window.Audio('./resources/background_music.mp3')
backgroundMusic.loop = true

export function playMusic () {
  backgroundMusic.volume = 0.1
  backgroundMusic.play()
}
