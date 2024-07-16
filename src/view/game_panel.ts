import { Size } from "./size";
import * as TWEEN from '@tweenjs/tween.js'

export class GamePanel {
    private readonly ctx: CanvasRenderingContext2D

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    init() {
        let position = { x: 100, y: 0 }
        let tween = new TWEEN.Tween(position)
        tween.to({ x: 200 }, 1000)
        console.log(`start ${position.x} ${position.y}`)
    }

    draw(size: Size) {
        console.log(`start ${size}`)
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(100, 100, 55, 50)
        this.drawButton(200, 200, 120, 48, 24, '开始')
    }

    drawButton(x: number, y: number, width: number, height: number,
        radius: number, text: string) {
        //分为4条直线4个圆角绘制
        let ctx = this.ctx
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arc(x + width - radius, y + radius, radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arc(x + width - radius, y + height - radius, radius, Math.PI, Math.PI / 2);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + radius);
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#fff";
        let fontSize = 24;
        ctx.font = `${fontSize}px serif`
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x + width / 2, y + height / 2);
    }
}