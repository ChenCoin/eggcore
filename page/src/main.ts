import './style.css'
import * as TWEEN from '@tweenjs/tween.js'

let canvas: HTMLCanvasElement = document.getElementById('canvas')! as HTMLCanvasElement;

function render(): void {
  console.log(`canvas ${canvas.width} ${canvas.height}`)

  let ctx = canvas.getContext('2d')!;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#30FFFF";
  ctx.fillRect(100, 100, 55, 50);

  let position = { x: 100, y: 0 }
  let tween = new TWEEN.Tween(position)
  tween.to({ x: 200 }, 1000)
  console.log(`start ${position.x} ${position.y}`)

  ctx.fillStyle = "#CDCDCD";
  let fontSize = 12
  ctx.font = `${fontSize}px serif`;
  ctx.textBaseline = 'ideographic';
  let version = "v1.0"
  let text = ctx.measureText(version);
  // 5像素的padding
  ctx.fillText(version, canvas.width - text.width - 5, canvas.height - 5)
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();

  var mouseDown = false
  canvas.addEventListener('mousedown', (event) => {
    mouseDown = true
    console.log(`start ${event.x} ${event.y}`)
  });
  canvas.addEventListener('mousemove', (event) => {
    if (!mouseDown) {
      return
    }
    console.log(`start ${event.x} ${event.y}`)
  });
  canvas.addEventListener('mouseup', (event) => {
    mouseDown = false
    console.log(`start ${event.x} ${event.y}`)
  });

  canvas.addEventListener('touchstart', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`);
  });
  canvas.addEventListener('touchmove', (event) => {
    console.log(`start ${event.touches[0].pageX} ${event.touches[0].pageY}`);
  });
  canvas.addEventListener('touchend', (event) => {
    console.log(`end ${event.touches.length}`);
  });
}

function main(): void {
  console.log(`app start`)
  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
}
main()
