import './style.css'
import * as TWEEN from '@tweenjs/tween.js'
import { DataBus } from "./databus.ts"
import { UX } from "./ux.ts"
import { BackgroundPanel } from './view/background.ts'
import { Size } from './view/size.ts'

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
const ctx = canvas.getContext('2d')!
const bgrCanvas = document.querySelector<HTMLCanvasElement>('#background')!
const bgrContext = bgrCanvas.getContext('2d')!
const databus = new DataBus()

function render(size: Size) {
  console.log(`canvas ${size.width} ${size.height}`)

  let background = new BackgroundPanel(bgrContext, size)
  background.init()
  background.draw()

  ctx.fillStyle = "#30FFFF"
  ctx.fillRect(100, 100, 55, 50)

  let position = { x: 100, y: 0 }
  let tween = new TWEEN.Tween(position)
  tween.to({ x: 200 }, 1000)
  console.log(`start ${position.x} ${position.y}`)
}

function addEvent() {
  var mouseDown = false
  canvas.addEventListener('mousedown', (event) => {
    mouseDown = true
    console.log(`start ${event.x} ${event.y}`)
  })
  canvas.addEventListener('mousemove', (event) => {
    if (!mouseDown) {
      return
    }
    console.log(`start ${event.x} ${event.y}`)
  })
  canvas.addEventListener('mouseup', (event) => {
    mouseDown = false
    console.log(`start ${event.x} ${event.y}`)
  })

  canvas.addEventListener('touchstart', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`)
  })
  canvas.addEventListener('touchmove', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`)
  })
  canvas.addEventListener('touchend', (event) => {
    console.log(`end ${event.touches.length}`)
  })
}

function resizeCanvas() {
  let size = new Size(window.innerWidth, window.innerHeight)
  canvas.width = size.width
  canvas.height = size.height
  bgrCanvas.width = size.width
  bgrCanvas.height = size.height
  render(size)
  addEvent()
}

function main() {
  console.log(`eggcore: app start`)
  databus.init()

  window.addEventListener("resize", resizeCanvas, false)
  resizeCanvas()

  var s = UX.col
  console.log(`eggcore: ${s}`)
}
main()
