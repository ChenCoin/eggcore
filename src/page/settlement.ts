import * as PIXI from 'pixi.js'
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';

export class Settlement implements Page {
    private story: Story

    private app: PIXI.Application

    private group = new PIXI.Container()

    private background = new PIXI.Graphics()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.background)
        this.app.stage.addChild(this.group)
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const background = this.background
        const dw = scaffold.width / 5
        const dh = scaffold.height / 5
        background.filletRect(dw, dh, dw * 3, dh * 3, dw / 2).fill(0xFFFFFF)

        this.story.onGridTap(-1, -1) // remove this line
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
        this.group.removeChild(this.background)
        this.app.stage.removeChild(this.group)
    }
}