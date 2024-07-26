import * as PIXI from 'pixi.js'
import { Widget } from "./page";
import { Scaffold } from "./scaffold";
import { UX } from '../ux';
import { Story } from './story';
import { Cover } from './cover';

export class Board implements Widget {
    private story: Story

    private group: PIXI.Container

    private allStar = new PIXI.Graphics()

    private tapArea = new PIXI.Graphics()

    private scaffoldCache = new Scaffold(0, 0)

    private cover = new Cover(0, 0)

    private readonly colorMap: Array<[number, number]> = [
        [0xFFFFFF, 0x000000], // white
        [0xEC7062, 0xE74C3C], // red
        [0x5CADE2, 0x5599C7], // blue
        [0xF4CF40, 0xF5B041], // yellow
        [0xAF7AC4, 0xA569BD], // purple
        [0x57D68C, 0x53BE80], // green
    ]

    constructor(story: Story, group: PIXI.Container) {
        this.story = story
        this.group = group
    }

    create(): void {
        this.group.addChild(this.allStar)
        this.group.addChild(this.tapArea)
    }

    build(scaffold: Scaffold): void {
        this.scaffoldCache = scaffold
        this.cover = new Cover(scaffold.width, scaffold.height)
        this.draw()
        // add listener
        this.tapArea.clear()
        const cw = this.cover.contentWidth
        this.tapArea.rect(this.cover.padding, this.cover.gridY, cw, cw)
        this.tapArea.on('pointertap', (event) => {
            const x = event.clientX
            const y = event.clientY
            console.log(`tap event: ${x} ${y}`)
            this.story.ofData().onGridTap(x, y)
        })
    }

    draw() {
        console.log(`draw star, scaffold: ${this.scaffoldCache}`)
        // draw all star
        const gridY = this.cover.gridY
        const strokeSize = this.cover.strokeSize
        const padding = this.cover.padding
        const gridSize = this.cover.gridSize
        const strokeHalf = this.cover.strokeHalf

        const starPadding = this.cover.starPadding
        const starSize = this.cover.starSize
        const outerR = this.cover.outerR
        const innerR = this.cover.innerR
        const fillet = this.cover.fillet

        const extraSize = gridSize + strokeSize
        const extra = padding + strokeHalf + starPadding
        const extraElse = Math.ceil(padding + strokeHalf + gridSize / 2)
        let allGrid = this.story.ofData().ofGrids()
        let path = new PIXI.GraphicsPath()
        let filter = UX.defaultShadow()
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                let item = allGrid[i][j]
                let color: [number, number] = this.colorMap[item.ofColor()]

                const x = extra + j * extraSize
                const y = extra + i * extraSize + gridY
                // rect: x, y, starSize, starSize
                this.allStar.filters = []
                this.allStar.filletRect(x, y, starSize, starSize, fillet)
                this.allStar.fill(color[0])

                const cx = extraElse + j * extraSize
                const cy = extraElse + i * extraSize + gridY + 1
                this.drawStar(path, cx, cy, outerR, innerR, 0)
                this.allStar.path(path)
                this.allStar.filters = [filter]
                this.allStar.fill(color[1])
            }
        }
        // add listener of tap

        // rebuild layout
    }

    destory(): void {
        this.group.removeChild(this.allStar)
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