import * as PIXI from 'pixi.js'
import { Falsework } from './view/falsework'

export class Content {
    private shade = new PIXI.Graphics()

    private resizeEvent = () => { }

    private app: PIXI.Application

    private readonly color = 0xFFFFFF

    constructor(app: PIXI.Application) {
        this.app = app
    }

    public init() {
        let renderer = this.app.renderer
        this.app.stage.addChild(this.shade);
        this.draw()
        this.resizeEvent = () => this.draw()
        renderer.addListener("resize", this.resizeEvent)
    }

    public destroy() {
        let renderer = this.app.renderer
        renderer.removeListener("resize", this.resizeEvent)
        this.shade.destroy()
    }

    private draw() {
        this.shade.clear()
        let size = Falsework.fromRenderer(this.app.renderer)
        let w = size.width
        let h = size.height
        this.shade.roundRect(size.x, size.y, w, h, 16).fill(this.color)
    }
}