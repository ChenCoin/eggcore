import { Size } from "./size";
import * as TWEEN from '@tweenjs/tween.js'

export class GamePanel {
    private readonly ctx: CanvasRenderingContext2D

    private readonly size: Size

    constructor(ctx: CanvasRenderingContext2D, size: Size) {
        this.ctx = ctx
        this.size = size
    }

    init() {
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(100, 100, 55, 50)

        let position = { x: 100, y: 0 }
        let tween = new TWEEN.Tween(position)
        tween.to({ x: 200 }, 1000)
        console.log(`start ${position.x} ${position.y}`)
        console.log(`start ${this.size}`)
    }
}