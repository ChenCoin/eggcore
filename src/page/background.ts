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
        gradientFill.addColorStop(0, 0x2C2E78)
        gradientFill.addColorStop(9 / 10, 0x3C2D58);

        // Create a fill graphic
        this.panel.rect(0, 0, width, height).fill(gradientFill)

        this.panel.circle(0, height, Math.min(width, height) * 2 / 5).fill(0x391E3F)
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