import './style.css'

let canvas: HTMLCanvasElement = document.getElementById('canvas')! as HTMLCanvasElement;

function render(): void {

}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}

function main(): void {
  window.addEventListener("resize", resizeCanvas, false);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log(`canvas ${canvas.width} ${canvas.height}`)

  let ctx = canvas.getContext('2d')!;

  ctx.fillStyle="#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fillRect(10, 10, 55, 50);

  render();
}
main()
