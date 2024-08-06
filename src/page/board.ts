import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import * as UX from '../ux';
import { Beater } from './beater';
import { BreakPoint, GridPoint, TapEventResult } from '../databus';
import { Cover } from './cover';
import { Widget } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { StarDrawer } from './draw';
import { FederatedMouseEvent } from 'pixi.js';

export class Board implements Widget, Beater {
    private story: Story

    private group: PIXI.Container

    private allStar = new PIXI.Graphics()

    private breakStarPanel = new PIXI.Graphics()

    private movingStarPanel = new PIXI.Graphics()

    private tapArea = new PIXI.Graphics()

    private scoreView = UX.createText()

    private levelView = UX.createText()

    private levelTargetView = UX.createText()

    private scaffoldCache = new Scaffold(0, 0)

    private cover = new Cover(0, 0)

    private starDrawer = new StarDrawer(this.cover)

    private breakState: StateFlag = new StateFlag(false, { x: 0 })

    private movingState: StateFlag = new StateFlag(false, { x: 0 })

    private animCache = new Set<Tween.Tween<{ x: number }>>()

    constructor(story: Story, group: PIXI.Container) {
        this.story = story
        this.group = group
    }

    create(): void {
        this.tapArea.zIndex = -1
        this.group.addChild(this.tapArea)
        this.group.addChild(this.allStar)
        this.group.addChild(this.breakStarPanel)
        this.group.addChild(this.movingStarPanel)
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
        tapArea.on('pointertap', (event: FederatedMouseEvent) => {
            const x = Math.floor((event.globalX - dx - this.group.x) / gridSize)
            const y = Math.floor((event.globalY - dy - this.group.y) / gridSize)
            this.story.onGridTap(x, y, this)
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
        this.breakStarPanel.clear()
        this.movingStarPanel.clear()
        this.starDrawer.draw(this.allStar, this.story.ofData().ofGrids())

        this.scoreView.text = this.story.ofData().ofScore()
        this.levelView.text = this.story.ofData().ofLevel()
        this.levelTargetView.text = this.story.ofData().ofLevelTarget()
    }

    destory(): void {
        this.animCache.forEach((item) => item.stop())
        this.animCache.clear()
        this.tapArea.clear()
        this.allStar.clear()
        this.breakStarPanel.clear()
        this.movingStarPanel.clear()
        this.group.removeChild(this.tapArea)
        this.group.removeChild(this.allStar)
        this.group.removeChild(this.breakStarPanel)
        this.group.removeChild(this.movingStarPanel)
        this.group.removeChild(this.scoreView)
        this.group.removeChild(this.levelView)
        this.group.removeChild(this.levelTargetView)
    }

    public clearAnim(): void {
        if (this.breakState.isRunning()) {
            this.breakStarPanel.clear()
        }
        if (this.movingState.isRunning()) {
            this.movingStarPanel.clear()
        }
    }

    public breakTapStar(result: TapEventResult) {
        // create break stars animotion
        const breakPoint = result.ofBreakStar()
        const anim: { x: number } = { x: 0 }
        this.breakState = new StateFlag(true, anim)
        const breakTween = new Tween.Tween(anim)
            .to({ x: 1000 }, UX.breakAnimDuration)
            // .easing(Tween.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.drawBreakStar(anim.x, breakPoint)
            })
            .onComplete(() => {
                this.animCache.delete(breakTween)
                this.breakState.endState(anim)
                this.draw()
            })
            .start()
        this.animCache.add(breakTween)

        console.log(`Tween start`)
        // create moving stars animotion
        const movingPoint = result.ofMovingStar()
        const animMove: { x: number } = { x: 0 }
        this.movingState = new StateFlag(true, animMove)
        for (let i = 0; i < movingPoint.length; i++) {
            const element = movingPoint[i];
            element.startMove(animMove)
        }
        const moveTween = new Tween.Tween(animMove)
            .to({ x: 1000 }, UX.breakAnimDuration)
            // .easing(Tween.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.drawMovingStar(animMove, movingPoint)
            })
            .onComplete(() => {
                this.animCache.delete(moveTween)
                this.movingState.endState(animMove)
                for (let i = 0; i < movingPoint.length; i++) {
                    const element = movingPoint[i];
                    element.endMove(animMove)
                }
                this.draw()
            })
            .start()
        this.animCache.add(moveTween)

        // draw static stars
        this.draw()
    }

    public breakAllStar(): void {
        const allGrid = this.story.ofData().ofGrids()
        const list = new Array<Array<number>>()
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                const item = allGrid[i][j]
                if (item.isEmpty()) {
                    continue
                }
                const pivot = item.getPivot()
                const itemList = new Array<number>()
                itemList.push(item.ofColor(), pivot[1], pivot[0])
                itemList.push(Math.random())
                itemList.push(Math.random())
                list.push(itemList)
                item.clear()
            }
        }

        const anim: { x: number } = { x: 0 }
        this.breakState = new StateFlag(true, anim)
        const breakTween = new Tween.Tween(anim)
            .to({ x: 1000 }, UX.breakAnimDuration * 2)
            .onUpdate(() => this.drawBreakAllStar(anim.x, list))
            .onComplete(() => {
                this.animCache.delete(breakTween)
                this.breakState.endState(anim)
                this.draw()
            })
            .start()
        this.animCache.add(breakTween)
        this.draw()
    }

    private drawBreakStar(anim: number, breakPoint: BreakPoint) {
        this.starDrawer.drawBreakStar(this.breakStarPanel, anim, breakPoint)
    }

    private drawMovingStar(anim: { x: number }, movingPoint: Array<GridPoint>) {
        this.starDrawer.drawMovingStar(this.movingStarPanel, anim, movingPoint)
    }

    private drawBreakAllStar(anim: number, list: Array<Array<number>>) {
        this.starDrawer.drawBreaAllkStar(this.breakStarPanel, anim, list)
    }
}

class StateFlag {
    private running: boolean

    private readonly flag: { x: number }

    constructor(running: boolean, flag: { x: number }) {
        this.running = running
        this.flag = flag
    }

    public isRunning(): boolean {
        return this.running
    }

    public endState(flag: { x: number }) {
        if (flag == this.flag) {
            this.running = false
        }
    }
}