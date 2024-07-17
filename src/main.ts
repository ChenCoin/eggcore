// https://cloud.tencent.com/developer/article/2261633
// npm create vite@latest
// npm run dev
// npm run build

// npm install @tweenjs/tween.js
// npm install pixi.js
// npm install
import './style.css'
import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import { Shade } from './shade'
import { Content } from './content'

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()

async function main() {
  console.log(`eggcore: app start: ${window.devicePixelRatio}`)

  // Wait for the Renderer to be available
  await app.init({
    antialias: true, // 抗锯齿
    autoDensity: true,
    backgroundColor: 0x6495ed,
    resizeTo: window, // 大小为全屏
    resolution: window.devicePixelRatio, // 适配缩放的分辨率
  })
  app.ticker.add(() => Tween.update())
  document.body.appendChild(app.canvas)

  let flag = false
  if (import.meta.env.DEV && flag) {
    document.title = 'DEMO'
    new Shade(app).init()
  }

  new Content(app).init()

  let rectangle = new PIXI.Graphics()
  rectangle.rect(160, 160, 64, 64).fill()
  app.stage.addChild(rectangle);

  // let myGraph = new PIXI.Graphics();
  // rectangle.position.set(240, 240);
  rectangle.moveTo(240, 240).lineTo(320, 320).stroke();
  rectangle.moveTo(320, 320).lineTo(320, 360).lineTo(340, 400).fill();

  // app.stage.addChild(myGraph);


}
main()