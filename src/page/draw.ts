import * as PIXI from 'pixi.js'
import * as UX from '../ux';
import { Cover } from "./cover"
import { BreakPoint, GridPoint } from '../databus';

export class StarDrawer {
    private readonly gridY
    private readonly strokeSize
    private readonly padding
    private readonly gridSize
    private readonly strokeHalf

    private readonly starPadding
    private readonly starSize
    private readonly outerR
    private readonly innerR
    private readonly fillet
    private readonly extraSize
    private readonly extra
    private readonly extraElse
    constructor(cover: Cover) {
        this.gridY = cover.gridY
        this.strokeSize = cover.strokeSize
        this.padding = cover.padding
        this.gridSize = cover.gridSize
        this.strokeHalf = cover.strokeHalf

        this.starPadding = cover.starPadding
        this.starSize = cover.starSize
        this.outerR = cover.outerR
        this.innerR = cover.innerR
        this.fillet = cover.fillet

        this.extraSize = this.gridSize + this.strokeSize
        this.extra = this.padding + this.strokeHalf + this.starPadding
        this.extraElse = this.padding + this.strokeHalf + this.gridSize / 2
    }

    public draw(allStar: PIXI.Graphics, allGrid: Array<Array<GridPoint>>) {
        const path = new PIXI.GraphicsPath()
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                let itemIndex = allGrid[i][j].ofColor()
                if (itemIndex == 0) {
                    continue
                }
                let color: [number, number] = UX.colorMap[itemIndex]

                const x = this.extra + j * this.extraSize
                const y = this.extra + i * this.extraSize + this.gridY
                // rect: x, y, starSize, starSize
                allStar.filters = []
                allStar.filletRect(x, y, this.starSize, this.starSize, this.fillet)
                allStar.fill(color[1])

                const cx = this.extraElse + j * this.extraSize
                const cy = this.extraElse + i * this.extraSize + this.gridY
                this.drawStar(path, cx, cy, this.outerR, this.innerR, 0)
                allStar.path(path)
                allStar.fill(color[0])
            }
        }
    }

    public drawBreakStar(allStar: PIXI.Graphics, breakPoint: BreakPoint) {
        console.log(`draw`)
        const path = new PIXI.GraphicsPath()
        const list = breakPoint.ofList()
        for (let k = 0; k < list.length; k++) {
            const item = list[k]
            const i = item[0]
            const j = item[1]
            let colorIndex = breakPoint.ofColor()
            if (colorIndex == 0) {
                console.log(`draw 0`)
                continue
            }
            let color: [number, number] = UX.colorMap[colorIndex]
            // rect: x, y, starSize, starSize
            const cx = this.extraElse + j * this.extraSize
            const cy = this.extraElse + i * this.extraSize + this.gridY
            this.drawStar(path, cx, cy, this.outerR, this.innerR, 0)
            allStar.path(path)
            allStar.fill(color[0])
        }
    }

    private drawStar(path: PIXI.GraphicsPath, dx: number, dy: number, R: number,
        r: number, rot: number) {
        const deg2Rad = (i: number) => (36 * i - rot) / 180 * Math.PI;
        path.clear();
        const rad = deg2Rad(10)
        path.moveTo(dx - Math.sin(rad) * R, dy - Math.cos(rad) * R);
        // 沿着10个点绘制路径
        for (let i = 1; i <= 10; i++) {
            const rad = i % 2 == 1 ? r : R;
            const posX = dx - Math.sin(deg2Rad(i)) * rad;
            const posY = dy - Math.cos(deg2Rad(i)) * rad;
            path.lineTo(posX, posY);
        }
        path.closePath()
    }
}