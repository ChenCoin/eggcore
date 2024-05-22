import { Size } from "./size";

export class BackgroundPanel {
    private readonly ctx: CanvasRenderingContext2D

    private stars = new Array<[number, number, number]>()

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    init() {
        let starCount = 10 + Math.floor(Math.random() * 5);
        for (let i = 0; i < starCount; i++) {
            let dx = Math.random()
            let dy = Math.random()
            let r = Math.random() * 4 + 2
            this.stars.push([dx, dy, r])
        }
    }

    draw(size: Size) {
        let ctx = this.ctx
        // create gradient
        const from = size.width / 2
        const grd = ctx.createLinearGradient(from, 0, size.width, size.height);
        grd.addColorStop(0, "#2C2E78");
        grd.addColorStop(1, "#3C2D58");

        // fill the color
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, size.width, size.height);

        // draw the moon
        const moonSize = Math.min(size.width, size.height);
        const r = moonSize / 2;

        const dx = -10
        const dy = size.height + 40
        const round = ctx.createRadialGradient(dx, dy, 0, dx, dy, r)
        round.addColorStop(0, "#432e5c")
        round.addColorStop(1, "#391e3f")

        ctx.fillStyle = round
        ctx.beginPath()
        ctx.arc(dx, dy, r, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#06D7F6"
        for (let i = 0; i < this.stars.length; i++) {
            let item = this.stars[i]
            ctx.beginPath()
            ctx.arc(item[0] * size.width, item[1] * size.height, item[2], 0, 2 * Math.PI)
            ctx.closePath()
            ctx.fill()
        }

        ctx.fillStyle = "#FFFFFF"
        let fontSize = 12
        ctx.font = `${fontSize}px serif`
        ctx.textBaseline = 'ideographic'
        let version = "v1.0.0"
        let text = ctx.measureText(version)
        // 5 pixel padding
        ctx.fillText(version, size.width - text.width - 5, size.height - 5)
    }
}