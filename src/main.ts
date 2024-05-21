import './style.css'
import * as TWEEN from '@tweenjs/tween.js'
import { DataBus } from "./databus.ts"
import { UX } from "./ux.ts"

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!

const databus = new DataBus()

function render() {
  console.log(`canvas ${canvas.width} ${canvas.height}`)

  let ctx = canvas.getContext('2d')!

  ctx.fillStyle = "#CDCDCD"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#30FFFF"
  ctx.fillRect(100, 100, 55, 50)

  let position = { x: 100, y: 0 }
  let tween = new TWEEN.Tween(position)
  tween.to({ x: 200 }, 1000)
  console.log(`start ${position.x} ${position.y}`)

  ctx.fillStyle = "#FFFFFF"
  let fontSize = 12
  ctx.font = `${fontSize}px serif`
  ctx.textBaseline = 'ideographic'
  let version = "v1.0.0"
  let text = ctx.measureText(version)
  // 5 pixel padding
  ctx.fillText(version, canvas.width - text.width - 5, canvas.height - 5)
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  render()

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

function main() {
  console.log(`eggcore: app start`)
  databus.init()

  window.addEventListener("resize", resizeCanvas, false)
  resizeCanvas()

  var s = UX.col
  console.log(`eggcore: ${s}`)
}
main()
