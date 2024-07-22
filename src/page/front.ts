import { Scaffold } from "./scaffold"
import { Page } from "./page"
import * as PIXI from 'pixi.js'
import { UX } from "../ux"

export class FrontPanel implements Page {
    private app: PIXI.Application

    private startGame: () => void

    private group = new PIXI.Container()

    private startButton = new PIXI.Graphics()

    private title = new PIXI.Text()

    private buttonText = new PIXI.Text()

    constructor(app: PIXI.Application, startGame: () => void) {
        this.app = app
        this.startGame = startGame
    }

    create(): void {
        this.group.addChild(this.title)
        this.group.addChild(this.startButton)
        this.group.addChild(this.buttonText)
        this.app.stage.addChild(this.group)
        // new object
        // new groups and add object to groups
        // add groups to app stage
        let title = this.title
        const style = new PIXI.TextStyle({
            fontSize: 24,
            align: 'center',
            fill: '#ffffff',
        })
        title.anchor = 0.5
        title.style = style
    }

    build(scaffold: Scaffold): void {
        console.log(`FrontPanel build: ${scaffold}`)
        let padding = 48

        let title = this.title
        title.text = UX.title
        title.x = scaffold.x + scaffold.width / 2
        title.y = scaffold.y + scaffold.height / 2 - padding * 2

        let x = scaffold.x + padding
        let y = scaffold.y + scaffold.height / 2 + padding * 2
        let width = scaffold.width - padding * 2
        let height = 48

        let button = this.startButton
        button.clear()
        button.filters = [UX.defaultShadow()]
        button.roundRect(x, y, width, height, 24)
        button.fill('0xFFFFFF')

        button.eventMode = 'static';
        button.on('pointerdown', () => button.fill('0xC0C0C0'))
        button.on('pointerup', () => button.fill('0xFFFFFF'))
        button.on('pointerupoutside', () => button.fill('0xFFFFFF'))
        button.on('pointertap', this.startGame)
    }

    show(): void {
        this.group.visible = true
    }

    hide(): void {
        this.group.visible = false
    }

    destory(): void {
        // remove groups from app stage
        // groups to be null
        this.startButton.clear()
        this.group.removeChild(this.startButton)
        this.app.stage.removeChild(this.group)
    }
}