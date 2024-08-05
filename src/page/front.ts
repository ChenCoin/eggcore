import * as PIXI from 'pixi.js'
import * as UX from "../ux"
import { Page } from "./page"
import { Scaffold } from "./scaffold"
import { Size } from "./size"
import { Story } from "./story"
import { TextButton } from '../view/button'

export class FrontPanel implements Page {
    private app: PIXI.Application

    private story: Story

    private group = new PIXI.Container()

    private title = UX.createText()

    private textButton = new TextButton()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.title)
        this.textButton.addToGroup(this.group)
        this.textButton.create(UX.startGame, () => this.story.onGameStart())
        this.app.stage.addChild(this.group)
        // new object
        // new groups and add object to groups
        // add groups to app stage
        const title = this.title
        const style = new PIXI.TextStyle({
            align: 'center',
            fill: 0xFFFFFF,
            fontFamily: UX.pigFont,
            fontSize: 84,
            stroke: {
                color: UX.themeColor,
                width: 16,
            },
        })
        title.anchor = 0.5
        title.style = style
        title.text = UX.title
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const padding = 48

        const title = this.title
        title.x = scaffold.width / 2
        title.y = scaffold.height / 2 - padding * 2

        const x = padding * 2
        const y = scaffold.height / 2 + padding * 2
        const width = scaffold.width - padding * 4
        const height = 48
        const btnSize = new Size(x, y, width, height)
        this.textButton.draw(btnSize, 24)
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

    clearAnim(): void { }

    destory(): void {
        // remove groups from app stage
        // groups to be null
        this.textButton.removeFromView(this.group)
        this.app.stage.removeChild(this.group)
    }
}