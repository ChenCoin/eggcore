import * as PIXI from 'pixi.js'
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from "./story";

export class Background implements Page {
    private app: PIXI.Application

    private panel = new PIXI.Graphics()

    constructor(story: Story) {
        this.app = story.ofApp()
    }

    create(): void {
        this.panel.zIndex = -2
        this.app.stage.addChild(this.panel)
    }

    build(_: Scaffold = new Scaffold(0, 0)): void {
        const renderer: PIXI.Renderer = this.app.renderer
        const width = renderer.width
        const height = renderer.height

        const gradientFill = new PIXI.FillGradient(0, 0, width, height)
        gradientFill.addColorStop(0, 0x55AEC0)
        gradientFill.addColorStop(1 / 2, 0xABC3B6);
        this.panel.rect(0, 0, width, height).fill(gradientFill)

        const path = new PIXI.GraphicsPath()

        path.clear()
        path.moveTo(0, height * 5 / 8)
        path.lineTo(width * 5 / 12, height * 2 / 5)
        path.lineTo(width, height * 9 / 16)
        path.lineTo(0, height * 5 / 8)
        this.panel.path(path).fill(0x7A7C93)

        path.clear()
        path.moveTo(0, height / 2)
        path.lineTo(width, height)
        path.lineTo(0, height)
        path.lineTo(0, height / 2)
        this.panel.path(path).fill(0x4D5D77)

        path.clear()
        path.moveTo(0, height * 7 / 8)
        path.lineTo(width, height * 9 / 10)
        path.lineTo(width, height)
        path.lineTo(0, height)
        path.lineTo(0, height * 7 / 8)
        this.panel.path(path).fill(0xC08774)

        path.clear()
        path.moveTo(0, height * 5 / 8)
        path.lineTo(width, height * 9 / 16)
        path.lineTo(width, height * 9 / 10)
        path.lineTo(0, height * 7 / 8)
        path.lineTo(0, height * 5 / 8)
        this.panel.path(path).fill(0xD09982)

    }

    update(_x: number, _y: number): void {
        // do nothing
    }

    show(): void {
        this.panel.visible = true
    }

    hide(): void {
        this.panel.visible = true
    }

    destory(): void {
        this.app.stage.removeChild(this.panel)
    }

    redraw() {
        this.destory()
        this.create()
        this.build()
    }
}