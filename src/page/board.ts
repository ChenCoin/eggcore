import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import * as UX from '../ux';
import { Cover } from './cover';
import { Widget } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { StarDrawer } from './draw';

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

    private starDrawer = new StarDrawer(this.cover)

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
        this.starDrawer = new StarDrawer(cover)
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
                const breakPoint = result.ofBreakStar()
                const position = { x: 0, y: 0 }

                new Tween.Tween(position)
                    .to({ x: 100 }, 1000)
                    .easing(Tween.Easing.Quadratic.InOut)
                    .onUpdate(() =>
                        this.starDrawer.drawBreakStar(this.allStar, breakPoint)
                    )
                    .onComplete(() => this.draw())
                    .start()

                console.log(`Tween start`)
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
        this.allStar.clear()
        this.starDrawer.draw(this.allStar, this.story.ofData().ofGrids())

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
}