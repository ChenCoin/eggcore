import { Scaffold } from "./scaffold"
import { Page } from "./page"
import * as PIXI from 'pixi.js'
import { UX } from "../ux"
import { Size } from "./size"
import { Story } from "./story"

export class FrontPanel implements Page {
    private app: PIXI.Application

    private story: Story

    private group = new PIXI.Container()

    private startButton = new PIXI.Graphics()

    private title = new PIXI.Text()

    private buttonText = new PIXI.Text()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.title)
        this.group.addChild(this.startButton)
        this.group.addChild(this.buttonText)
        this.app.stage.addChild(this.group)
        // new object
        // new groups and add object to groups
        // add groups to app stage
        const title = this.title
        const style = new PIXI.TextStyle({
            fontSize: 84,
            align: 'center',
            fill: 0xFFFFFF,
            stroke: {
                color: 0xFFC107,
                width: 16,
            },
        })
        title.anchor = 0.5
        title.style = style

        const btnText = this.buttonText
        const btnTextStyle = new PIXI.TextStyle({
            fontSize: 24,
            align: 'center',
            fill: 0xFFFFFF,
            stroke: {
                color: 0xC0C0C0,
                width: 1,
            },
        })
        btnText.anchor = 0.5
        btnText.style = btnTextStyle
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const padding = 48

        const title = this.title
        title.text = UX.title
        title.x = scaffold.width / 2
        title.y = scaffold.height / 2 - padding * 2

        const x = padding * 2
        const y = scaffold.height / 2 + padding * 2
        const width = scaffold.width - padding * 4
        const height = 48

        const btnText = this.buttonText
        btnText.text = UX.startGame
        btnText.x = scaffold.width / 2
        btnText.y = y + height / 2

        const button = this.startButton
        button.filters = [UX.defaultShadow()]
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', () => this.story.onPageChanged(1))
        UX.drawButton(button, new Size(x, y, width, height), 24, 0xFFC107)
        const normalEvent = () => {
            UX.drawButton(button, new Size(x, y, width, height), 24, 0xFFC107)
            btnText.style.fill = 0xFFFFFF
        }
        UX.addButtonEvent(button, normalEvent, () => {
            UX.drawButton(button, new Size(x, y, width, height), 24, 0xE5AC00)
            btnText.style.fill = 0xDDDDDD
        })
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
        // remove groups from app stage
        // groups to be null
        this.startButton.clear()
        this.group.removeChild(this.startButton)
        this.app.stage.removeChild(this.group)
    }
}