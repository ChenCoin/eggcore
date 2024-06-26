import './style.css'
import { DataBus } from "./databus.ts"
import { Size } from './view/size.ts'
import { UX } from "./ux.ts"
import { BackgroundPanel } from './view/background.ts'
import { GamePanel } from './view/game_panel.ts'

const gameCanvas = document.querySelector<HTMLCanvasElement>('#game')!
const gameContext = gameCanvas.getContext('2d')!

const bgrCanvas = document.querySelector<HTMLCanvasElement>('#background')!
const bgrContext = bgrCanvas.getContext('2d')!
const background = new BackgroundPanel(bgrContext)

var stabilizerTick: number = 0
const databus = new DataBus()

function render(size: Size) {
  console.log(`canvas ${size.width} ${size.height}`)
  background.draw(size)

  let gamePanel = new GamePanel(gameContext, size)
  gamePanel.init()
}

function addEvent() {
  var mouseDown = false
  gameCanvas.addEventListener('mousedown', (event) => {
    mouseDown = true
    console.log(`start ${event.x} ${event.y}`)
  })
  gameCanvas.addEventListener('mousemove', (event) => {
    if (!mouseDown) {
      return
    }
    console.log(`start ${event.x} ${event.y}`)
  })
  gameCanvas.addEventListener('mouseup', (event) => {
    mouseDown = false
    console.log(`start ${event.x} ${event.y}`)
  })

  gameCanvas.addEventListener('touchstart', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`)
  })
  gameCanvas.addEventListener('touchmove', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`)
  })
  gameCanvas.addEventListener('touchend', (event) => {
    console.log(`end ${event.touches.length}`)
  })
}

function resizeCanvas() {
  let ratio = window.devicePixelRatio
  let size = new Size(window.innerWidth * ratio, window.innerHeight * ratio)
  gameCanvas.width = size.width
  gameCanvas.height = size.height
  bgrCanvas.width = size.width
  bgrCanvas.height = size.height
  render(size)
  addEvent()
}

function stabilizer() {
  const now = Date.now()
  stabilizerTick = now
  window.setTimeout(() => {
    if (stabilizerTick == now) {
      resizeCanvas()
    }
  }, 100)
}

function main() {
  console.log(`eggcore: app start`)
  background.init()
  databus.init()

  window.addEventListener("resize", stabilizer, false)
  resizeCanvas()

  var s = UX.col
  console.log(`eggcore: ${s}`)
}
main()
