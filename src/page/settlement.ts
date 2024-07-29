import * as PIXI from 'pixi.js'
import * as UX from '../ux'
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { Size } from './size';
import { TextButton } from '../view/button';

export class Settlement implements Page {
    private story: Story

    private app: PIXI.Application

    private group = new PIXI.Container()

    private background = new PIXI.Graphics()

    private title = UX.createText()

    private nextBtn = new TextButton()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.background)
        this.group.addChild(this.title)
        this.nextBtn.addToGroup(this.group)
        this.nextBtn.create(this.story.ofData().ofNextBtnText())
        this.app.stage.addChild(this.group)
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const background = this.background
        const dw = scaffold.width / 8
        const dh = scaffold.height / 5
        const width = dw * 6
        const height = dh * 3
        const size = new Size(dw, dh, width, height)
        UX.drawButton(background, size, dw / 2, 0xF5A40A)
        background.stroke({
            color: 0xF9C406,
            width: 12,
        })

        this.story.onGridTap(-1, -1) // remove this line

        const textStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: UX.textFont,
            fontSize: 42,
        })
        const title = this.title
        title.anchor = 0.5
        title.style = textStyle
        title.x = scaffold.width / 2
        title.y = dh + 32 + 42 / 2
        title.text = '通关'

        const p = 32
        const btnH = 48
        const btnX = dw + p
        const btnY = dh + height - p - btnH
        const btnSize = new Size(btnX, btnY, width - p * 2, btnH)
        const btnArgs = [0xFFFFFF, 0xDDDDDD, 0x000000, 0x444444]
        this.nextBtn.draw(btnSize, 4, () => {
            if (this.story.ofData().isOnLevelWait()) {
                this.story.toNextLevel()
                return
            }
            // this.story.ofData().isOnLevelFinish()
            this.story.toHomePage()
        }, btnArgs)
    }

    update(x: number, y: number): void {
        this.group.x = x
        this.group.y = y
    }

    show(): void {
        this.group.visible = true
    }

    hide(): void {
        this.group.visible = false
    }

    destory(): void {
        this.background.clear()
        this.nextBtn.removeFromView(this.group)
        this.group.removeChild(this.title)
        this.group.removeChild(this.background)
        this.app.stage.removeChild(this.group)
    }
}