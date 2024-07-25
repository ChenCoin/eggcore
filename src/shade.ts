import * as PIXI from 'pixi.js'

export class Shade {
    private shade = new PIXI.Graphics()

    private resizeEvent = () => { }

    private app: PIXI.Application

    constructor(app: PIXI.Application) {
        this.app = app
    }

    public init() {
        let renderer = this.app.renderer
        let color = '0x000000CC'
        this.shade.rect(0, 0, renderer.width, renderer.height).fill(color)
        this.shade.zIndex = 10
        this.app.stage.addChild(this.shade);
        this.resizeEvent = () => {
            this.shade.clear()
            this.shade.rect(0, 0, renderer.width, renderer.height).fill(color)
        }
        renderer.addListener("resize", this.resizeEvent)
    }

    public destroy() {
        let renderer = this.app.renderer
        renderer.removeListener("resize", this.resizeEvent)
        this.shade.destroy()
    }
}