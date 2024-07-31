import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import * as UX from '../ux';
import { Widget } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { Cover } from './cover';

export class Board implements Widget {
    private story: Story

    private group: PIXI.Container

    private allStar = new PIXI.Graphics()

    private tapArea = new PIXI.Graphics()

    private scoreView = UX.createText()

    private levelView = UX.createText()

    private levelTargetView = UX.createText()

    private scaffoldCache = new Scaffold(0, 0)

    private cover = new Cover(0, 0)

    constructor(story: Story, group: PIXI.Container) {
        this.story = story
        this.group = group
    }

    create(): void {
        this.tapArea.zIndex = -1
        this.group.addChild(this.tapArea)
        this.group.addChild(this.allStar)
        this.group.addChild(this.scoreView)
        this.group.addChild(this.levelView)
        this.group.addChild(this.levelTargetView)
    }

    build(scaffold: Scaffold): void {
        this.scaffoldCache = scaffold
        const cover = scaffold.ofCover()
        this.cover = cover
        // add listener
        let tapArea = this.tapArea
        const padding = cover.padding
        const cw = cover.contentWidth
        const fillet = cover.fillet
        const dx = padding
        const dy = cover.gridY + padding
        tapArea.clear()
        tapArea.filletRect(dx, dy, cw, cw, fillet)
        tapArea.fill(0xFFFFFF)

        tapArea.eventMode = 'static';
        tapArea.removeAllListeners()
        const gridSize = (scaffold.width - padding * 2) / UX.col
        tapArea.on('pointertap', (event) => {
            const x = Math.floor((event.globalX - dx - this.group.x) / gridSize)
            const y = Math.floor((event.globalY - dy - this.group.y) / gridSize)
            console.log(`tap event: ${x} ${y}`)
            const result = this.story.onGridTap(x, y)
            if (result.isBreak()) {
                // draw static stars
                this.draw()
                // create break stars animotion
                const va = { x: 0 }
                new Tween.Tween(va, false)
                    .to({ x: 100 }, 1000)
                    .easing(Tween.Easing.Quadratic.InOut)
                    .onUpdate(() => {
                        console.log(`onUpdate ${va.x}`)
                    })
                    .start()
                // create moving stars animotion
            }
        })
        this.draw()

        let extra = new PIXI.Graphics()
        extra.zIndex = -1
        this.group.addChild(extra)
        extra.rect(0, (cover.height - cover.width - cover.yOffset) / 2, cover.width, cover.yOffset)
        // extra.fill(0xCDCDCD)

        const scoreView = this.scoreView
        const scoreSize = UX.scoreTextSize
        const style = new PIXI.TextStyle({
            align: 'center',
            fill: UX.themeColor,
            fontFamily: UX.pigFont,
            fontSize: scoreSize,
            stroke: {
                color: 0x808080,
                width: 1,
            },
        })
        scoreView.anchor = 0.5
        scoreView.style = style
        scoreView.x = cover.width / 2
        const tempY = cover.height - cover.width - cover.yOffset + scoreSize
        scoreView.y = tempY / 2 + 8

        const levelSize = 7
        const levelStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: UX.textFont,
            fontSize: levelSize * 3,
        })
        const levelView = this.levelView
        levelView.anchor = 0
        levelView.style = levelStyle
        levelView.x = cover.padding + 8
        levelView.y = (cover.height - cover.width + cover.yOffset) / 2 - levelSize * 5

        const levelTargetView = this.levelTargetView
        levelTargetView.anchor = 0.5
        levelTargetView.style = levelStyle
        levelTargetView.x = cover.width / 2
        levelTargetView.y = (cover.height - cover.width + cover.yOffset) / 2 - levelSize * 3
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
        const extraElse = padding + strokeHalf + gridSize / 2
        let allGrid = this.story.ofData().ofGrids()
        let path = new PIXI.GraphicsPath()
        this.allStar.clear()
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                let itemIndex = allGrid[i][j].ofColor()
                if (itemIndex == 0) {
                    continue
                }
                let color: [number, number] = UX.colorMap[itemIndex]

                const x = extra + j * extraSize
                const y = extra + i * extraSize + gridY
                // rect: x, y, starSize, starSize
                this.allStar.filters = []
                this.allStar.filletRect(x, y, starSize, starSize, fillet)
                this.allStar.fill(color[1])

                const cx = extraElse + j * extraSize
                const cy = extraElse + i * extraSize + gridY
                this.drawStar(path, cx, cy, outerR, innerR, 0)
                this.allStar.path(path)
                this.allStar.fill(color[0])
            }
        }

        this.scoreView.text = this.story.ofData().ofScore()
        this.levelView.text = this.story.ofData().ofLevel()
        this.levelTargetView.text = this.story.ofData().ofLevelTarget()
    }

    destory(): void {
        this.tapArea.clear()
        this.allStar.clear()
        this.group.removeChild(this.tapArea)
        this.group.removeChild(this.allStar)
        this.group.removeChild(this.scoreView)
        this.group.removeChild(this.levelView)
        this.group.removeChild(this.levelTargetView)
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