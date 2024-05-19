import './style.css'
import * as TWEEN from '@tweenjs/tween.js'

let canvas: HTMLCanvasElement = document.getElementById('canvas')! as HTMLCanvasElement;

function render(): void {
  console.log(`canvas ${canvas.width} ${canvas.height}`)

  let ctx = canvas.getContext('2d')!;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fillRect(10, 10, 55, 50);

  let position = { x: 100, y: 0 }
  let tween = new TWEEN.Tween(position)
  tween.to({ x: 200 }, 1000)
  console.log(`start ${position.x} ${position.y}`)
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}

function main(): void {
  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
}
main()
