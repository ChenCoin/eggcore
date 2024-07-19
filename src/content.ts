import * as PIXI from 'pixi.js'
import { Falsework } from './view/falsework'
import { DropShadowFilter } from 'pixi-filters'

export class Content {
    private container = new PIXI.Container()

    private shade = new PIXI.Graphics()

    private resizeEvent = () => { }

    private app: PIXI.Application

    private readonly color = 0xFFFFFF

    constructor(app: PIXI.Application) {
        this.app = app
    }

    public init() {
        this.app.stage.addChild(this.shade);
        this.app.stage.addChild(this.container);
        this.resize()
        this.draw()

        this.resizeEvent = () => this.resize()
        let renderer = this.app.renderer
        renderer.addListener("resize", this.resizeEvent)
    }

    public destroy() {
        let renderer = this.app.renderer
        renderer.removeListener("resize", this.resizeEvent)
        this.shade.destroy()
    }

    private resize() {
        let size = Falsework.fromRenderer(this.app.renderer)
        let x = size.x
        let y = size.y
        let w = size.width
        let h = size.height

        this.container.x = x + (w - 320) / 2
        this.container.y = y + (h - 320) / 2
        console.log(`container width: ${w}`)
        console.log(`container height: ${h}`)

        let dropShadowFilter = new DropShadowFilter()
        dropShadowFilter.color = 0x404040
        dropShadowFilter.alpha = 0.5
        dropShadowFilter.antialias = 'on'

        // let stroke = new PIXI.Graphics()
        // stroke.filters = [dropShadowFilter]
        // stroke.roundRect(size.x, size.y, w, h, 16).stroke()

        this.shade.clear()
        this.shade.filters = [dropShadowFilter]
        this.shade.roundRect(size.x, size.y, w, h, 16).fill(this.color)
    }

    private draw() {
        let rect = new PIXI.Graphics()
        rect.roundRect(0, 0, 320, 320, 16).fill('0x909090')
        this.container.addChild(rect)
        console.log(`container width: ${this.container.width}`)
    }

    // private drawOther() {
    //     let rectangle = new PIXI.Graphics()
    //     rectangle.rect(160, 160, 64, 64).fill()
    //     this.app.stage.addChild(rectangle)

    //     // let myGraph = new PIXI.Graphics()
    //     // rectangle.position.set(240, 240)
    //     rectangle.moveTo(240, 240).lineTo(320, 320).stroke()
    //     rectangle.moveTo(320, 320).lineTo(320, 360).lineTo(340, 400).fill()
    //     // app.stage.addChild(myGraph)
    // }
}