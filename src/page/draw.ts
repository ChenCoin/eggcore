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

    private readonly path = new PIXI.GraphicsPath()

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
        const path = this.path
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                const item = allGrid[i][j]
                if (item.isMoving()) {
                    continue
                }
                let itemIndex = item.ofColor()
                if (itemIndex == 0) {
                    continue
                }
                let color: [number, number] = UX.colorMap[itemIndex]

                const x = this.extra + j * this.extraSize
                const y = this.extra + i * this.extraSize + this.gridY
                // rect: x, y, starSize, starSize
                allStar.filletRect(x, y, this.starSize, this.starSize, this.fillet)
                allStar.fill(color[1])

                const cx = this.extraElse + j * this.extraSize
                const cy = this.extraElse + i * this.extraSize + this.gridY
                this.drawStar(path, cx, cy + 3, this.outerR, this.innerR, 0)
                allStar.path(path)
                allStar.fill({
                    color: 0x808080,
                    alpha: 0.3,
                })
                this.drawStar(path, cx, cy, this.outerR, this.innerR, 0)
                allStar.path(path)
                allStar.fill(color[0])
            }
        }
    }

    public drawBreakStar(panel: PIXI.Graphics, animValue: number,
        breakPoint: BreakPoint) {
        const path = this.path
        const list = breakPoint.ofList()
        let colorIndex = breakPoint.ofColor()
        if (colorIndex == 0) {
            return
        }
        let color = UX.colorMap[colorIndex][0]

        const animNum = animValue / 1000
        const alpha = 1 - 0.8 * animNum
        for (let k = 0; k < list.length; k++) {
            const item = list[k]
            const size = item.length - 2
            const i = item[0]
            const j = item[1]
            for (let index = 0; index < size; index++) {
                // rect: x, y, starSize, starSize
                const radius = item[index + 2]

                const rx = 100 * animNum * Math.sin(radius * 2 * Math.PI)
                const ry = 100 * animNum * Math.cos(radius * 2 * Math.PI)
                const rz = 360 * animNum
                const cx = this.extraElse + j * this.extraSize + rx
                const cy = this.extraElse + i * this.extraSize + this.gridY + ry
                this.drawStar(path, cx, cy, this.outerR, this.innerR, rz)
                panel.path(path)
                panel.fill({
                    color: color,
                    alpha: alpha,
                })
            }
        }
    }

    public drawMovingStar(panel: PIXI.Graphics, anim: { x: number },
        movingPoint: Array<GridPoint>) {
        const path = this.path
        const size = movingPoint.length
        const animNum = anim.x / 1000
        for (let k = 0; k < size; k++) {
            const item = movingPoint[k]
            if (!item.isThisMoveAnim(anim)) {
                continue
            }
            let itemIndex = item.ofColor()
            if (itemIndex == 0) {
                continue
            }
            const color: [number, number] = UX.colorMap[itemIndex]
            const [j, i] = item.ofPosition(animNum)

            const x = this.extra + j * this.extraSize
            const y = this.extra + i * this.extraSize + this.gridY
            // rect: x, y, starSize, starSize
            panel.filters = []
            panel.filletRect(x, y, this.starSize, this.starSize, this.fillet)
            panel.fill(color[1])

            const cx = this.extraElse + j * this.extraSize
            const cy = this.extraElse + i * this.extraSize + this.gridY
            this.drawStar(path, cx, cy + 2, this.outerR, this.innerR, 0)
            panel.path(path)
            panel.fill({
                color: 0x808080,
                alpha: 0.2,
            })
            this.drawStar(path, cx, cy, this.outerR, this.innerR, 0)
            panel.path(path)
            panel.fill(color[0])
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

    // // 绘制平滑的圆角矩形
    // private drawSmoothRoundRect(path: PIXI.GraphicsPath, left: number, top: number, width: number,
    //     height: number, radius: number) {
    //     const n = 4;
    //     const gap = radius / n;
    //     const right = left + width;
    //     const btm = top + height;
    //     path.clear();
    //     path.moveTo(left, top + radius);
    //     path.bezierCurveTo(left, top + gap, left + gap, top, left + radius, top);
    //     path.lineTo(right - radius, top);
    //     path.bezierCurveTo(right - gap, top, right, top + gap, right, top + radius);
    //     path.lineTo(right, btm - radius);
    //     path.bezierCurveTo(right, btm - gap, right - gap, btm, right - radius, btm);
    //     path.lineTo(left + radius, btm);
    //     path.bezierCurveTo(left + gap, btm, left, btm - gap, left, btm - radius);
    //     path.closePath();
    // }
}