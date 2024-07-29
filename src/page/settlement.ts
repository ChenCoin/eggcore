import * as PIXI from 'pixi.js'
import * as UX from '../ux'
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { Size } from './size';

export class Settlement implements Page {
    private story: Story

    private app: PIXI.Application

    private group = new PIXI.Container()

    private background = new PIXI.Graphics()

    private title = UX.createText()

    private nextBtn = new PIXI.Graphics()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.background)
        this.group.addChild(this.title)
        this.group.addChild(this.nextBtn)
        this.app.stage.addChild(this.group)
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const cover = scaffold.ofCover()

        const background = this.background
        const dw = scaffold.width / 8
        const dh = scaffold.height / 5
        const size = new Size(dw, dh, dw * 6, dh * 3)
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
        this.group.removeChild(this.nextBtn)
        this.group.removeChild(this.title)
        this.group.removeChild(this.background)
        this.app.stage.removeChild(this.group)
    }
}